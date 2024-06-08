import { MetaFunction } from "@remix-run/node";
import ExpenseUploader from "app/components/ExpenseUploader";
import FileListViewer from "app/components/FileListViewer";
import { useState } from "react";

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
    
  const handleRemove = (file: File) => {
      setFiles(Array.from(files || []).filter((f) => f.name !== file.name));
  }

  return (
    <div className="p-16">
      <ExpenseUploader setFiles={setFiles} />
      <FileListViewer files={Array.from(files || [])} onRemove={handleRemove} />
    </div>
  );
}
