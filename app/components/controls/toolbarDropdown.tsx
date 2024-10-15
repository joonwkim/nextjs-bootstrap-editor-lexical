'use client'

import React, { useEffect, useState } from 'react';
import { DropdownItem } from '../data/toolbarData';

interface ToolbarDropdownProps {
    dropdownItems?: DropdownItem[],
    updateSelectionChange?: boolean,
    handleDropdownSelect: (item: DropdownItem) => void,
}

const ToolbarDropdown = ({ dropdownItems, updateSelectionChange, handleDropdownSelect }: ToolbarDropdownProps) => {
    const [selected, setSelected] = useState<DropdownItem>();    
    useEffect(() => {
        if (dropdownItems) {
            setSelected(dropdownItems[0])
        }       
    }, [dropdownItems])
    const handleSelect = (item: DropdownItem) => {
        handleDropdownSelect(item);
        setSelected(item);
    };

    return (
        <div className="btn-group" role="group" aria-label="Second group">
            <div className="btn-group" role="group">
                {updateSelectionChange ? (
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle border-0" data-bs-toggle="dropdown" aria-expanded="false" title="Options">
                        <i className={`bi ${selected?.icon} me-2`}></i>{selected?.name }<i className='bi bi-chevron ms-2'></i>
                    </button>
                ) : (
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle border-0" data-bs-toggle="dropdown" aria-expanded="false" title="Options">
                        <i className='bi bi-plus'></i>삽입<i className='bi bi-chevron ms-2'></i>
                    </button>)}
                <ul className="dropdown-menu">
                    {dropdownItems?.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item)}>
                            <a className={`dropdown-item${item.active ? ' active' : ''}`} href="#">
                                <i className={`bi ${item.icon}`}></i> {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ToolbarDropdown;
