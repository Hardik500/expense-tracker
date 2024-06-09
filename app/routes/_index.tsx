import { useMemo, useState } from "react";
import { MetaFunction } from "@remix-run/node";
import ExpenseUploader from "app/components/ExpenseUploader";
import FileListViewer from "app/components/FileListViewer";

export const meta: MetaFunction = () => {
  return [
    {
      property: "title",
      content: "Expense Tracker",
    },
  ];
};

export default function Index() {
  const [files, setFiles] = useState<Iterable<File> | ArrayLike<File> | null>(null);
  const filesArray: File[] = useMemo(() => Array.from(files || []), [files]);
    
  const handleRemove = (file: File) => {
      setFiles(filesArray.filter((f) => f.name !== file.name));
  }

  return (
    <div className="p-16 h-full">
      <ExpenseUploader setFiles={setFiles} />
      {filesArray.length > 0 && <FileListViewer files={filesArray} onRemove={handleRemove} />}
    </div>
  );
}
