export const FIELDS_MAP = {
    DATE: "DATE",
    ORIGINAL_DESCRIPTION: "ORIGINAL_DESCRIPTION",
    UNKNOWN: "UNKNOWN",
    CATEGORY: "CATEGORY",
    CREDIT: "CREDIT",
    DEBIT: "DEBIT",
    BALANCE: "BALANCE"
};

interface FieldList {
    label: string;
    value: string;
    isValid: boolean;
    type: string;
}

export const FIELDS_LIST: FieldList[] = [
    {
        label: 'Date',
        value: FIELDS_MAP.DATE,
        isValid: true,
        type: 'date'
    },
    {
        label: 'Original Description',
        value: FIELDS_MAP.ORIGINAL_DESCRIPTION,
        isValid: true,
        type: 'string'
    },
    {
        label: 'Unknown',
        value: FIELDS_MAP.UNKNOWN,
        isValid: false,
        type: 'string'
    },
    {
        label: 'Category',
        value: FIELDS_MAP.CATEGORY,
        isValid: true,
        type: 'string'
    },
    {
        label: 'Credit',
        value: FIELDS_MAP.CREDIT,
        isValid: true,
        type: 'number'
    },
    {
        label: 'Debit',
        value: FIELDS_MAP.DEBIT,
        isValid: true,
        type: 'number'
    },
    {
        label: 'Balance',
        value: FIELDS_MAP.BALANCE,
        isValid: true,
        type: 'number'
    }
];