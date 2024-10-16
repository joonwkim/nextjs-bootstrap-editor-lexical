'use client'

import React, { useEffect, useState } from 'react';
import { DropdownItem } from '../data/toolbarData';

interface ToolbarDropdownProps {
    dropdownItems?: DropdownItem[],
    update: boolean;
    selectedItem: DropdownItem | undefined;
    updateSelectionChange?: boolean,
    handleDropdownSelect: (item: DropdownItem) => void,
}

const ToolbarDropdown = ({ dropdownItems, update, selectedItem, updateSelectionChange, handleDropdownSelect }: ToolbarDropdownProps) => {
    const [canUpdate, setCanUpdate] = useState(update);

    useEffect(() => {
        if (canUpdate && selectedItem) {
            setCanUpdate(false);  // Stop further updates after initial set
        }
    }, [selectedItem, canUpdate]);

    const handleSelect = (item: DropdownItem) => {
        handleDropdownSelect(item);
        setCanUpdate(false);
    };

    return (
        <div className="btn-group" role="group" aria-label="Second group">
            <div className="btn-group" role="group">
                {updateSelectionChange ? (
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle border-0" data-bs-toggle="dropdown" aria-expanded="false" title="Options">
                        <i className={`bi ${selectedItem?.icon} me-2`}></i>{selectedItem?.name}<i className='bi bi-chevron ms-2'></i>
                    </button>
                ) : (
                    <button type="button" className="btn btn-outline-secondary dropdown-toggle border-0" data-bs-toggle="dropdown" aria-expanded="false" title="Options">
                        <i className='bi bi-plus'></i>삽입<i className='bi bi-chevron ms-2'></i>
                    </button>)}
                <ul className="dropdown-menu">
                    {dropdownItems?.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item)}>
                            <a className={`dropdown-item${item.active === true ? ' active' : ''}`} href="#">
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
