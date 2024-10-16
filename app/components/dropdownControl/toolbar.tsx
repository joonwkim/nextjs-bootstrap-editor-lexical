// components/Toolbar.tsx
import { useEffect, useState } from 'react';
import { DropdownItem, ToolbarItem, toolbarItems } from './types/toolbar';
import Dropdown from './Dropdown';

const Toolbar = () => {
    const [toolbarData, setToolbarData] = useState<ToolbarItem[]>([]);
    const [update, setUpdate] = useState(false);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState<DropdownItem | undefined>(undefined);  // Track selected item

    useEffect(() => {
        setToolbarData(toolbarItems);
    }, []);

    // Update Option A (id: 13) to active: true, which is the 3rd item in the dropdowns array
    const updateOptionA = () => {
        setToolbarData(prevData =>
            prevData.map(item => {
                if (item.id === 2 && item.dropdowns) {
                    const updatedDropdowns = item.dropdowns.map(ddItem =>
                        ddItem.id === 12 ? { ...ddItem, active: true } : { ...ddItem, active: false }
                    );
                    const selectedItem = updatedDropdowns.find(ddItem => ddItem.id === 12);
                    setSelectedDropdownItem(selectedItem);  // Set the selected item here
                    return {
                        ...item,
                        dropdowns: updatedDropdowns,
                    };
                }
                return item;
            })
        );
        setUpdate(prev => !prev);  // Toggle update to trigger Dropdown re-render
    };

    // Handle dropdown selection (from Dropdown component)
    const handleSelectDropdownItem = (item: DropdownItem) => {
        setSelectedDropdownItem(item);
    };

    return (
        <div className='btn-toolbar' role='group' aria-label='Toolbar with button groups'>
            <button className="btn btn-info ms-3" onClick={updateOptionA}>
                Activate Option A (3rd dropdown)
            </button>

            {toolbarData.map((item: ToolbarItem, index: number) => (
                <div key={index} className="toolbar-item ms-3">
                    <button className={`btn ${item.active ? 'btn-primary' : 'btn-outline-primary'}`}>
                        {item.name}
                    </button>

                    {item.isDropdown && item.dropdowns && (
                        <Dropdown
                            items={item.dropdowns}
                            update={update}
                            selectedItem={selectedDropdownItem}  // Pass the selected item
                            onSelect={handleSelectDropdownItem}  // Handle selection from Dropdown
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Toolbar;
