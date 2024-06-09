import { FIELDS_LIST } from "app/helper/constant";
import Dropdown from 'app/common/Dropdown';

interface FileHeaderProps {
    header: { label: string, field: string }
    handleClick: (field: string) => void;
}

export const FileHeader = ({ header, handleClick }: FileHeaderProps) => {
    const validFields = FIELDS_LIST.filter(field => field.isValid);
    const columnHeader = Object.values(validFields).find(field => field.value === header.field)?.label || header.label;

    return (
        <th scope="col" className="relative px-6 py-3 cursor-pointer">
            <Dropdown
                items={validFields}
                onItemClick={handleClick}
                buttonLabel={columnHeader}
            />
        </th>
    );
};