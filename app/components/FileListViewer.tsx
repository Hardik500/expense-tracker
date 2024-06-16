import { useEffect, useState } from "react";
import Dropdown from '~/common/Dropdown';
import BankData from "~/helper/banks.json";
import * as XLSX from 'xlsx';
import { ActiveFileType } from "~/helper/interfaces";

interface FileListViewerProps {
    files: File[];
    onRemove: (file: File) => void;
    setActiveFile: (file: ActiveFileType | null) => void;
}

export default function FileListViewer({ files, setActiveFile, onRemove }: FileListViewerProps) {
    const [filesBankMap, setFilesBankMap] = useState<{ [key: string]: ActiveFileType }>({});
    const banksList = Object.entries(BankData).sort((a, b) => a[1].localeCompare(b[1])).map(([key, value]) => ({ label: value, value: key }))

    useEffect(() => {
        return () => {
            setFilesBankMap({});
        }
    }, []);

    const fetchBankFields = (async (bankName: string) => {
        try {
            const response = await fetch(`/bankFieldsMap?bankName=${bankName}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data) {
                return data;
            }
        } catch (error) {
            console.error("Failed to fetch bank fields:", error);
        }
    });

    const readBankName = async (file: File, filesBankMap: { [key: string]: ActiveFileType }) => {
        const reader = new FileReader();
        let bankName = "";

        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // From BankData file get all the keys and check if in the sheet there is a cell that contains the key value
            // If it does then set the bank name for the file
            // The value won't be in a specific cell, it can be anywhere in the sheet and it can be part of a sentence
            // Start scanning the sheet from the start and stop when the key is found

            for (const key of Object.keys(BankData)) {
                const cell = Object.values(sheet);

                for (let i = 0; i < cell.length; i++) {
                    const cellValue = cell[i].v;
                    if (cellValue && cellValue.toString().toLowerCase().includes(key.toLowerCase())) {
                        bankName = key;
                        break;
                    }
                }
            }

        };


        reader.onloadend = async () => {
            if (bankName) {
                const { id, field_map } = await fetchBankFields(bankName);
                filesBankMap[file.name] = {
                    active: false, file, bank: {
                        id,
                        headers: field_map,
                        name: bankName,
                    }
                }
                setFilesBankMap(filesBankMap);
            }
        }

        reader.readAsArrayBuffer(file);
    }

    useEffect(() => {
        // Set bank name for each file

        const filesBankMapCopy = {};

        files.forEach(async (file) => {
            await readBankName(file, filesBankMapCopy);
        });
    }, [files]);

    const editFile = (file: File) => {
        setFilesBankMap((prev) => ({ ...prev, [file.name]: { ...prev[file.name], active: true } }));
    };

    const handleBankChange = (file: File, bankName: string) => {
        setFilesBankMap((prev) => ({ ...prev, [file.name]: { ...prev[file.name], bankName } }));
    }

    useEffect(() => {
        setActiveFile(Object.values(filesBankMap).find((file) => file.active) || null);
    }, [filesBankMap]);

    if (!files || files.length === 0) {
        return null;
    }

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="w-full text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="">
                        <th scope="col" className="px-6 py-3">
                            File name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Bank name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center" colSpan={2}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        files.map((file) => (
                            <tr className="bg-white dark:bg-gray-800" key={file.name}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-5/12">
                                    {file.name}
                                </th>
                                <td className="px-6 py-4 text-left w-5/12">
                                    <Dropdown
                                        items={banksList}
                                        onItemClick={(bank) => handleBankChange(file, bank)}
                                        buttonLabel={filesBankMap[file.name]?.bank.name || "Select bank"}
                                    />
                                </td>
                                {filesBankMap[file.name] && <td className="px-6 py-4 text-left w-1/12">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => editFile(file)}>Edit</button>
                                </td>}
                                <td className="px-6 py-4 text-right w-1/12">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => onRemove(file)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}