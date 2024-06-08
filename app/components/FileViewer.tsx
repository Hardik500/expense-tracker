import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

interface FileViewerProps {
    file: File;
}

export default function FileViewer({ file }: FileViewerProps) {
    const SPECIAL_CHAR = "$%";
    const [dataHeaders, setDataHeaders] = useState<string[]>([]);
    const [dataRows, setDataRows] = useState<string[][]>([]);

    const handleHeaders = (headers: string[]) => {
        setDataHeaders(headers.map(header => header.trim()));
    }

    const handleRows = (rows: string[][]) => {
        setDataRows(rows.map(row => row.map(data => data.trim())));
    }

    const removeRow = (index: number) => {
        setDataRows(dataRows.filter((_, i) => i !== index));
    }

    const removeColumn = (index: number) => {
        setDataHeaders(dataHeaders.filter((_, i) => i !== index));
        setDataRows(dataRows.map(row => row.filter((_, i) => i !== index)));
    }

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            workbook.SheetNames.forEach(sheetName => {
                // Convert the data to JSON
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: SPECIAL_CHAR });

                // Create a object of the row size and increase the count if the row size is the same
                // Then get the count with the most row size
                const dataSizeMap = data.reduce((acc: { [key: string]: number }, row: any) => {
                    const rowSize = row.length;
                    acc[rowSize] = (acc[rowSize] || 0) + 1;
                    return acc;
                }, {} as { [key: string]: number });

                const maxRowSize = Object.keys(dataSizeMap).reduce((a, b) => dataSizeMap[a] > dataSizeMap[b] ? a : b);

                // Get all rows with the max row size where the first row is the header and the rest are data
                // Also remove any row that has more than one % in it
                const [headers, ...rows] = data
                    .filter(row => row.length === parseInt(maxRowSize))
                    .filter(row => row.filter((data: string) => data.toString().includes(SPECIAL_CHAR)).length <= 1)
                    .map(row => row.map((data: string) => data.toString().replace(SPECIAL_CHAR, '0')));

                handleHeaders(headers);
                handleRows(rows);
            });
        }

        reader.readAsArrayBuffer(file);
    }

    useEffect(() => {
        handleFile(file);

        return () => {
            setDataHeaders([]);
            setDataRows([]);
        }
    }, [file]);

    if (!dataHeaders || dataHeaders.length === 0) {
        return null;
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    Statement
                    <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Showing {dataRows.length} rows</p>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                        {
                            dataHeaders.map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3">
                                    {header}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((rowData, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                            <td className="px-6 py-4 text-right">
                                <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => removeRow(index)}>Remove</button>
                            </td>
                            {rowData.map((row, index) => (
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" key={index}>
                                    {row}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}