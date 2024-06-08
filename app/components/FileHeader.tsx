import { useState, useRef } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import classNames from 'classnames';
import { FIELDS_LIST } from "app/helper/constant";
interface FileHeaderProps {
    header: { label: string, field: string }
    handleClick: (field: string) => void;
}

export const FileHeader = ({ header, handleClick }: FileHeaderProps) => {
    const buttonRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const validFieldsList = Object.values(FIELDS_LIST).filter(field => field.isValid).map(field => field.label);
    const validFields = Object.keys(FIELDS_LIST).filter(key => validFieldsList.includes(FIELDS_LIST[key as keyof typeof FIELDS_LIST].label));
    const columnHeader = validFields.includes(header.field) ? header.field : header.label;

    const toggleDropdown = () => {
        if (!dropdownOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`
            });
        }
        setDropdownOpen(!dropdownOpen);
    }

    const onClick = (field: string) => {
        handleClick(field);
        setDropdownOpen(false);
    };

    return (
        <th scope="col" className="relative px-6 py-3 cursor-pointer">
            <OutsideClickHandler onOutsideClick={() => setDropdownOpen(false)}>
                <button ref={buttonRef} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={toggleDropdown}>{columnHeader} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
                </button>

                <div id="dropdown" style={dropdownStyle} className={classNames(
                    "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700",
                    { 'block': dropdownOpen, 'hidden': !dropdownOpen }
                )} role="menu" aria-orientation="vertical" aria-labelledby="dropdownDefaultButton">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {
                            validFields.map((field, index) => (
                                <li key={index} className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" role="button" tabIndex={index} onClick={() => onClick(field)}>{field}</li>
                            ))
                        }
                    </ul>
                </div>
            </OutsideClickHandler>
        </th>
    )
}