// components/Toolbar.tsx
import { FC, useState } from 'react';
import { ToolbarItem } from './types/toolbar';
import Dropdown from './Dropdown';

interface ToolbarProps {
    items: ToolbarItem[];
}

const Toolbar: FC<ToolbarProps> = ({ items }) => {
    const [toolbarData, setToolbarData] = useState<ToolbarItem[]>(items);

    // Update Option A to active: true
    const updateOptionA = () => {
        const updatedData = toolbarData.map(item => ({
            ...item,
            dropdowns: item.dropdowns?.map(dropdown =>
                dropdown.label === 'Option A' ? { ...dropdown, active: true } : dropdown
            )
        }));
        setToolbarData(updatedData);
    };

    return (
        <div className="btn-toolbar">
            {toolbarData.map(item => (
                <div key={item.id} className="toolbar-item">
                    <button className={`btn ${item.active ? 'btn-primary' : 'btn-outline-primary'}`}>
                        {item.name}
                    </button>

                    {item.dropdowns && <Dropdown items={item.dropdowns} />}
                </div>
            ))}

            <button className="btn btn-info mt-3" onClick={updateOptionA}>
                Activate Option A
            </button>
        </div>
    );
};

export default Toolbar;
