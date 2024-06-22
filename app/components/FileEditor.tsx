import { useCallback, useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { FileHeader } from "app/components/FileHeader"
import { FIELDS_MAP } from "app/helper/constant";
import { filterData, fillDataEntriesByType } from "app/helper/dataUtil";
import { BankType, FileHeaderType } from "~/helper/interfaces";

interface FileViewerProps {
    file: File;
    bank: BankType;
}

export default function FileViewer({ file, bank }: FileViewerProps) {
    const SPECIAL_CHAR = "$%";
    const bankId = bank?.id;
    const bankName = bank?.name;
    const [dataHeaders, setDataHeaders] = useState<FileHeaderType[]>(bank?.headers);
    const [dataRows, setDataRows] = useState<string[][]>([]);

    const updateBankFieldsWithHeaders = useCallback((dataHeaders: FileHeaderType[], dataRows: string[][]) => {
        if (dataHeaders.length > 0 && dataRows.length > 0) {
            let tempDataRows = [...dataRows];

            for (let i = 0; i < dataHeaders.length; i++) {
                const field = dataHeaders[i].field;
                const filteredData = filterData({ data: tempDataRows, field, index: i });
                const updatedDataForIndex = fillDataEntriesByType({ data: filteredData, field, index: i });
                // Update each row in dataRows for the index
                tempDataRows = filteredData.map((row, rowIndex) => {
                    const updatedRow = [...row];
                    updatedRow[i] = updatedDataForIndex[rowIndex];
                    return updatedRow;
                });
            }

            setDataRows(tempDataRows);
        }
    }, [dataRows]);

    const updateBankFields = async () => {
        try {
            const response = await fetch(`/bankFieldsMap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bankName, fieldMap: dataHeaders })
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data.bank) {
                setDataHeaders(data.bank.field_map);
            }
        } catch (error) {
            console.error("Failed to update bank fields:", error);
        }
    }

    const uploadStatement = async () => {
        try {
            const mappedData = dataRows.map(row => {
                const mappedRow: Record<string, string> = {};
                row.forEach((data, index) => {
                    const field = dataHeaders[index].field;
                    if (field !== FIELDS_MAP.UNKNOWN)
                        mappedRow[field.toLowerCase()] = data;
                });
                return mappedRow;
            });

            const statement = {
                bankId: bankId,
                statement: mappedData
            };

            const response = await fetch(`/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statement)
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Failed to upload statement:", error);
        }
    };

    const handleHeaders = (headers: string[]) => {
        if (bank?.headers && bank?.headers.length > 0) return bank?.headers;
        const trimmedHeaders = headers.map(header => header.trim());
        const finalHeaders = trimmedHeaders.map(header => ({ label: header, field: dataHeaders.find(prevHeader => prevHeader.label === header)?.field || FIELDS_MAP.UNKNOWN }));
        setDataHeaders(finalHeaders);
        return finalHeaders;
    }

    const handleRows = (rows: string[][]) => {
        const trimmedRows = rows.map(row => row.map(data => data.trim()));
        setDataRows(trimmedRows);
        return trimmedRows;
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
                const [headers, ...rows]: string[][] = data
                    .filter(row => row.filter((data: string) => data.toString().includes(SPECIAL_CHAR)).length <= 1)
                    .map(row => row.map((data: string) => data.toString().replace(SPECIAL_CHAR, '0')));

                const headerData = handleHeaders(headers);
                const rowData = handleRows(rows);

                updateBankFieldsWithHeaders(headerData, rowData);
            });
        }

        reader.readAsArrayBuffer(file);
    }

    const handleHeaderClick = (field: string, index: number) => {
        const updatedHeaders = [...dataHeaders];
        updatedHeaders[index].field = field;
        setDataHeaders(updatedHeaders);
        const filteredData = filterData({ data: dataRows, field: updatedHeaders[index].field, index });
        const updatedDataForIndex = fillDataEntriesByType({ data: filteredData, field: updatedHeaders[index].field, index });
        // Update each row in dataRows for the index
        const updatedDataRows = filteredData.map((row, rowIndex) => {
            const updatedRow = [...row];
            updatedRow[index] = updatedDataForIndex[rowIndex];
            return updatedRow;
        });
        setDataRows(updatedDataRows);
    };

    useEffect(() => {
        handleFile(file);
    }, []);

    if (!dataHeaders || dataHeaders.length === 0) {
        return null;
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            Statement
                            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Showing {dataRows.length} rows</p>
                        </div>
                        <div>
                            <button className="px-4 py-2 mr-4 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={updateBankFields}>
                                Update Fields
                            </button>
                            <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600" onClick={uploadStatement}>
                                Upload Statement
                            </button>
                        </div>
                    </div>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {
                            dataHeaders.map((header, index) => <FileHeader key={index} header={header} handleClick={(field) => handleHeaderClick(field, index)} />)
                        }
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((rowData, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                            {rowData.map((row, index) => (
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white overflow-hidden text-ellipsis max-w-20" key={index}>
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