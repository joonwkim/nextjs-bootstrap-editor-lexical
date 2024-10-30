import { DropdownItem, RichTextAction, ToolbarItem } from '../data/toolbarData';
import ToolbarDropdown from './toolbarDropdown';
import InsertImageModal from '../editor/modals/InsertImageModal';
import { InsertImagePayload } from '../editor/plugins/ToolbarPlugin org';
import './styles.css'
import InsertColumnsLayoutModal from '../editor/modals/InsertColumnsLayoutModal';
import InsertInlineImageModal from '../editor/modals/InsertInlineImageModal';
import InsertTableModal from '../editor/modals/InsertTableModal';
import InsertYouTubeVideoModal from '../editor/modals/InsertYouTubeVideoModal';
import { InlineImagePayload } from '../editor/nodes/InlineImageNode';
import './styles.css'
interface ToolbarProps {
    toolbarData: ToolbarItem[],
    selectedItem: DropdownItem | undefined;
    canUndo: boolean,
    canRedo: boolean,
    handleToolbarSelect: (item: ToolbarItem) => void,
    handleInsertImage: (payload: InsertImagePayload) => void,
    handleInsertInlineImage: (payload: InlineImagePayload) => void,
}

const Toolbar = ({ toolbarData, canUndo, canRedo, selectedItem, handleToolbarSelect, handleInsertImage, handleInsertInlineImage }: ToolbarProps) => {

    const getDisabled = (item: ToolbarItem) => {
        if (item.id === RichTextAction.Undo) { return !canUndo; }
        else if (item.id === RichTextAction.Redo) { return !canRedo }
        else {
            return false;
        }
    }

    const getActive = (item: ToolbarItem) => {
        if (item.id === RichTextAction.Undo && !canRedo) { return true }
        else if (item.id === RichTextAction.Redo && !canUndo) { return true }
        else {
            return false;
        }
    }
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
                                {/* <InsertImageModal onClick={onClick} />
                                <InsertInlineImageModal />
                                <InsertColumnsLayoutModal /> */}
                            </>) : (
                                <button className={`btn btn-outline-secondary border-0 ${getActive(item)}`} title={item.title} data-bs-toggle="button" disabled={getDisabled(item)}
                                    onClick={() => handleToolbarSelect(item)}>
                                    <i className={item.icon}></i>
                                </button>
                            )
                        )
                    )}
                </div>
            ))}
            <InsertImageModal onClick={handleInsertImage} />
            <InsertInlineImageModal onClick={handleInsertInlineImage} />
            <InsertTableModal />
            <InsertColumnsLayoutModal />
            <InsertYouTubeVideoModal />
        </div>
    );
}

export default Toolbar