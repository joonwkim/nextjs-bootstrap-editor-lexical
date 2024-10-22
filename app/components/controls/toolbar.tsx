import { DropdownItem, ToolbarItem } from '../data/toolbarData';
import ToolbarDropdown from './toolbarDropdown';

import './styles.css'
import InsertImageModal from '../editor/modals/insertImageModal';
import InsertSampleImage from '../editor/modals/insertSampleImage';
import InsertImageUrl from '../editor/modals/insertImageUrl';
import InsertImageFile from '../editor/modals/insertImageFile';

interface ToolbarProps {
    toolbarData: ToolbarItem[],
    selectedItem: DropdownItem | undefined;
    handleToolbarSelect: (item: ToolbarItem) => void,
}

const Toolbar = ({ toolbarData, selectedItem, handleToolbarSelect }: ToolbarProps) => {

    // Track selected item
    return (
        <div className='btn-toolbar' role='group' aria-label='Toolbar with button groups'>
            {toolbarData.map((item: ToolbarItem, index: number) => (
                <div key={index}>
                    {item.isDropdown ? (
                        <ToolbarDropdown dropdownItems={item.dropdownItems} selectedItem={selectedItem}
                            updateSelectionChange={item.updateSelectionChange}
                            handleDropdownSelect={handleToolbarSelect} />
                    ) : (item.isDevider ? (<div className="divider"></div>) :
                        (item.isModal ? (<>
                            <button className='btn btn-outline-secondary border-0' data-bs-target={item.databstarget} data-bs-toggle={item.databstoggle} title={item.title} >
                                <i className={item.icon}></i>
                            </button>
                            <InsertImageModal />
                        </>) : (<button className='btn btn-outline-secondary border-0' disabled={item.disabled} title={item.title} data-bs-toggle="button"
                            onClick={() => handleToolbarSelect(item)}> <i className={item.icon}></i> </button>)
                        )
                    )}
                </div>
            ))}

        </div>
    );
}

export default Toolbar