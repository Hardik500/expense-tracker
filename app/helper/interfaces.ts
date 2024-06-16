interface FileHeaderType {
    label: string;
    field: string;
}

interface ActiveFileType {
    bankName: string;
    file: File;
    active: boolean;
    headers: FileHeaderType[];
}

export type {
    FileHeaderType,
    ActiveFileType
}