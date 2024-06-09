import { useEffect, useState } from "react";
import FileEditor from "~/components/FileEditor";
import Dropdown from 'app/common/Dropdown';
import BankData from "app/helper/banks.json";

interface FileListViewerProps {
    files: File[];
    onRemove: (file: File) => void;
}

export default function FileListViewer({ files, onRemove }: FileListViewerProps) {
    const [activeFile, setActiveFile] = useState<File | null>(null);
    const [activeBank, setActiveBank] = useState<string | null>(null);
    const banksList = Object.entries(BankData).sort((a, b) => a[1].localeCompare(b[1])).map(([key, value]) => ({ label: value, value: key }))

    useEffect(() => {
        setActiveFile(null);

        return () => {
            setActiveBank(null);
            setActiveFile(null);
        }
    }, []);

    const editFile = (file: File) => {
        setActiveFile(file);
    };

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
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/5">
                                    {file.name}
                                </th>
                                <td className="px-6 py-4 text-left w-2/5">
                                    <Dropdown
                                        items={banksList}
                                        onItemClick={(bank) => setActiveBank(bank)}
                                        buttonLabel={activeBank || 'Select bank'}
                                    />
                                </td>
                                <td className="px-6 py-4 text-left w-1/5">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => editFile(file)}>Edit</button>
                                </td>
                                <td className="px-6 py-4 text-right w-1/5">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => onRemove(file)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <br className="mb-16" />
            {activeFile && <FileEditor file={activeFile} />}
        </div>
    )
}