import React, { useMemo, useState, Suspense } from "react";
import { MetaFunction } from "@remix-run/node";
import FileListViewer from "app/components/FileListViewer";
const LazyExpenseUploader = React.lazy(() => import("app/components/ExpenseUploader"));

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
      <Suspense fallback={<div>Loading...</div>}>
        <LazyExpenseUploader setFiles={setFiles} />
      </Suspense>
      {filesArray.length > 0 && <FileListViewer files={filesArray} onRemove={handleRemove} />}
    </div>
  );
}
