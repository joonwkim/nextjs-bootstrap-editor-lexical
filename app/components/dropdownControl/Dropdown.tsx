// components/Dropdown.tsx
import { FC } from 'react';
import { DropdownItem } from './types/toolbar';

interface DropdownProps {
    items: DropdownItem[];
}

const Dropdown: FC<DropdownProps> = ({ items }) => {
    return (
        <div className="dropdown">
            {items.map(item => (
                <button
                    key={item.id}
                    className={`dropdown-item ${item.active ? 'active' : ''}`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default Dropdown;
