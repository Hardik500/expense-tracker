interface FileHeaderType {
    label: string;
    field: string;
}

interface BankType {
    name: string;
    id: string;
    headers: FileHeaderType[];
}

interface ActiveFileType {
    file: File;
    active: boolean;
    bank: BankType;
}

export type {
    ActiveFileType,
    BankType,
    FileHeaderType,
}