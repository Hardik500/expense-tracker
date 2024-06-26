import { FIELDS_LIST } from "app/helper/constant";
import * as chrono from 'chrono-node';

interface filterDataProps {
    data: string[][],
    field: string,
    index: number
}

const isFieldDate = (field: string) => {
    // Check if the field is a date using regex
    return chrono.parseDate(field);
};

const isFieldNumber = (field: string) => {
    // Check if the field is either empty or if field contains at least one digit
    return field === '' || /\d/.test(field);
}


const isValidType = (value: string, type: string) => {
    if (type === 'date') {
        return isFieldDate(value); // Check if the value is a valid date
    } else if (type === 'number') {
        return isFieldNumber(value); // Check if the value is a valid number
    } else if (type === 'string') {
        return typeof value === 'string'; // Check if the value is a string
    }
    return false;
};

export const filterData = ({ data, field, index }: filterDataProps) => {
    if (!FIELDS_LIST.find(f => f.value === field)) {
        console.log("Invalid field");
        return data;
    }
    const expectedType = FIELDS_LIST.find(f => f.value === field)?.type || 'string';

    const filteredData = data.filter(entry => {
        const fieldValue = entry[index];
        return isValidType(fieldValue, expectedType);
    });

    return filteredData;
};

export const fillDataByType = (data: string, type: string) => {
    if (type === 'date') {
        return chrono.parseDate(data)?.toISOString() || '';
    } else if (type === 'number') {
        return parseFloat(data) || 0;
    }
    return data;
}

export const fillDataEntriesByType = ({ data, field, index }: filterDataProps) => {
    const expectedType = FIELDS_LIST.find(f => f.value === field)?.type || 'string';
    return data.map(entry => {
        const fieldValue = entry[index];
        return isValidType(fieldValue, expectedType) ? fillDataByType(fieldValue, expectedType) : fieldValue;
    });
}