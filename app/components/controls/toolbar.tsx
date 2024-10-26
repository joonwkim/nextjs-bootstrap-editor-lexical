import { DropdownItem, RichTextAction, ToolbarItem } from '../data/toolbarData';
import ToolbarDropdown from './toolbarDropdown';
import InsertImageModal from '../editor/modals/insertImageModal';
import { InsertImagePayload } from '../editor/plugins/ToolbarPlugin';
import './styles.css'
interface ToolbarProps {
    toolbarData: ToolbarItem[],
    selectedItem: DropdownItem | undefined;
    canUndo: boolean,
    canRedo: boolean,
    handleToolbarSelect: (item: ToolbarItem) => void,
    onClick: (payload: InsertImagePayload) => void,
}

const Toolbar = ({ toolbarData, canUndo, canRedo, selectedItem, handleToolbarSelect, onClick }: ToolbarProps) => {

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
                                {/* <button className='btn btn-outline-secondary border-0' data-bs-target={item.databstarget} data-bs-toggle={item.databstoggle} title={item.title} >
                                <i className={item.icon}></i>
                            </button> */}
                                <InsertImageModal onClick={onClick} />
                            </>) : (<button className='btn btn-outline-secondary border-0' disabled={item.id === RichTextAction.Undo ? !canUndo : item.id === RichTextAction.Redo ? !canRedo : true} title={item.title} data-bs-toggle="button"
                            onClick={() => handleToolbarSelect(item)}> <i className={item.icon}></i> </button>)
                        )
                    )}
                </div>
            ))}
        </div>
    );
}

export default Toolbar