import { useEffect, useState } from 'react';
import { DropdownItem } from './types/toolbar';
interface DropdownProps {
    items: DropdownItem[];
    update: boolean;
    selectedItem: DropdownItem | undefined;
    onSelect: (item: DropdownItem) => void;
}

const Dropdown = ({ items, update, selectedItem, onSelect }: DropdownProps) => {
    const [canUpdate, setCanUpdate] = useState(update);

    useEffect(() => {
        if (canUpdate && selectedItem) {
            setCanUpdate(false);  
        }
    }, [selectedItem, canUpdate]);

    const handleSelect = (item: DropdownItem) => {
        onSelect(item);
        setCanUpdate(false); 
    };

    return (
        <div className="btn-group" role="group" aria-label="Dropdown group">
            <button type="button" className="btn btn-outline-secondary dropdown-toggle border-0" data-bs-toggle="dropdown" aria-expanded="false" title="Options">
                {selectedItem?.label || 'Select'} 
            </button>
            <ul className="dropdown-menu">
                {items.map((item, index) => (
                    <li key={index} onClick={() => handleSelect(item)}>
                        <button className={`dropdown-item ${item.active ? 'active' : ''}`}                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
