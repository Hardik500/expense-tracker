import { useEffect, useState } from "react";
import FileEditor from "~/components/FileEditor";

interface FileListViewerProps {
    files: File[];
    onRemove: (file: File) => void;
}

export default function FileListViewer({ files, onRemove }: FileListViewerProps) {
    const [activeFile, setActiveFile] = useState<File | null>(null);

    useEffect(() => {
        setActiveFile(null);

        return () => {
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
                        <th scope="col" className="px-6 py-3 text-center" colSpan={2}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        files.map((file) => (
                            <tr className="bg-white dark:bg-gray-800" key={file.name}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {file.name}
                                </th>
                                <td className="px-6 py-4 text-left">
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => editFile(file)}>Edit</button>
                                </td>
                                <td className="px-6 py-4 text-right">
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