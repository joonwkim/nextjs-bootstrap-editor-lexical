// components/Dropdown.tsx
import { useEffect, useState } from 'react';
import { DropdownItem } from './types/toolbar';

interface DropdownProps {
    items: DropdownItem[];
    update: boolean;
    selectedItem: DropdownItem | undefined;  // Add this prop to control the selected item from parent
    onSelect: (item: DropdownItem) => void;  // Add this prop to notify parent of the selection
}

const Dropdown = ({ items, update, selectedItem, onSelect }: DropdownProps) => {
    const [canUpdate, setCanUpdate] = useState(update);

    useEffect(() => {
        if (canUpdate && selectedItem) {
            setCanUpdate(false);  // Stop further updates after initial set
        }
    }, [selectedItem, canUpdate]);

    const handleSelect = (item: DropdownItem) => {
        onSelect(item);  // Notify parent when selection is made
        setCanUpdate(false);  // Disable further updates after manual selection
    };

    return (
        <div className="btn-group" role="group" aria-label="Dropdown group">
            <button
                type="button"
                className="btn btn-outline-secondary dropdown-toggle border-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Options"
            >
                {selectedItem?.label || 'Select'}  {/* Display the selected label */}
            </button>
            <ul className="dropdown-menu">
                {items.map((item, index) => (
                    <li key={index} onClick={() => handleSelect(item)}>
                        <button
                            className={`dropdown-item ${item.active ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
