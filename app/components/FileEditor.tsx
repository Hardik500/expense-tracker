import { useEffect, useState } from "react";
import { FileHeader } from "app/components/FileHeader"
import * as XLSX from 'xlsx';

interface FileViewerProps {
    file: File;
}

const SUPPORTED_FIELDS = {
    DATE: 'Date',
    DESCRIPTION: 'Description',
    DEBIT: 'Debit',
    CREDIT: 'Credit',
    BALANCE: 'Balance',
    CATEGORY: 'Category',
};

const FIELDS_LIST = {
    ...SUPPORTED_FIELDS,
    NONE: 'None',
    UNKNOWN: 'Unknown'
};


export default function FileViewer({ file }: FileViewerProps) {
    const SPECIAL_CHAR = "$%";
    const [dataHeaders, setDataHeaders] = useState<{ label: string, field: string }[]>([]);
    console.log("🚀 ~ FileViewer ~ dataHeaders:", dataHeaders);
    const [dataRows, setDataRows] = useState<string[][]>([]);

    const handleHeaders = (headers: string[]) => {
        const trimmedHeaders = headers.map(header => header.trim());
        setDataHeaders(trimmedHeaders.map(header => ({ label: header, field: FIELDS_LIST.UNKNOWN })));
    }

    const handleRows = (rows: string[][]) => {
        setDataRows(rows.map(row => row.map(data => data.trim())));
    }

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            workbook.SheetNames.forEach(sheetName => {
                // Convert the data to JSON
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: SPECIAL_CHAR });

                // Get all rows with the max row size where the first row is the header and the rest are data
                // Also remove any row that has more than one % in it
                const [headers, ...rows] = data
                    .filter(row => row.filter((data: string) => data.toString().includes(SPECIAL_CHAR)).length <= 1)
                    .map(row => row.map((data: string) => data.toString().replace(SPECIAL_CHAR, '0')));

                handleHeaders(headers);
                handleRows(rows);
            });
        }

        reader.readAsArrayBuffer(file);
    }

    const handleHeaderClick = (field: string, index: number) => {
        const updatedHeaders = [...dataHeaders];
        updatedHeaders[index].field = field;
        setDataHeaders(updatedHeaders);
    };

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
                        {
                            dataHeaders.map((header, index) => <FileHeader key={index} header={header} fieldsList={SUPPORTED_FIELDS} handleClick={(field) => handleHeaderClick(field, index)} />)
                        }
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((rowData, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
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