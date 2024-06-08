import { FIELDS_LIST } from "app/helper/constant";
import * as chrono from 'chrono-node';

interface filterDataProps {
    data: string[][],
    field: keyof typeof FIELDS_LIST,
    index: number
}

const isFieldDate = (field: string) => {
    // Check if the field is a date using regex
    return chrono.parseDate(field);
};

const isFieldNumber = (field: string) => {
    // Check if the field is a number or float using regex
    return field.match(/^-?\d*\.?\d+$/) !== null;
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
    if (!FIELDS_LIST[field] || !FIELDS_LIST[field].isValid) {
        console.log("Invalid field");
        return data;
    }
    const expectedType = FIELDS_LIST[field].type;

    const filteredData = data.filter(entry => {
        const fieldValue = entry[index];
        return isValidType(fieldValue, expectedType);
    });

    return filteredData;
};