import { useRef, useState } from 'react';
import classNames from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

interface DropdownProps {
    items: { label: string, value: string }[];
    onItemClick: (item: string) => void;
    buttonLabel: string;
}

const Dropdown = ({ items, onItemClick, buttonLabel }: DropdownProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const toggleDropdown = () => {
        if (!isOpen) {
            const rect = buttonRef.current!.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
                <button ref={buttonRef} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" onClick={toggleDropdown}>
                    {buttonLabel}
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div style={dropdownStyle} className={classNames("absolute z-10 bg-white rounded shadow", { 'hidden': !isOpen })}>
                    <ul className="text-gray-700">
                        {items.map((item, index) => (
                            <li key={index} className="w-full px-4 py-2 hover:bg-gray-100">
                                <button className='w-full' onClick={() => {
                                    onItemClick(item.value);
                                    setIsOpen(false);
                                }}>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </OutsideClickHandler>
        </div>
    );
};

export default Dropdown;