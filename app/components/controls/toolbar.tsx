import { DropdownItem, RichTextAction, ToolbarItem } from '../editor/data/toolbarData';
import ToolbarDropdown from './toolbarDropdown';
import ImageModal from '../editor/modals/ImageModal';
import ColumnsLayoutModal from '../editor/modals/ColumnsLayoutModal';
import TableModal from '../editor/modals/TableModal';
import { InsertImagePayload, } from '../editor/plugins/ToolbarPlugin';
import { InsertTableCommandPayload } from '@lexical/table';
import EmbedYoutubeModal from '../editor/modals/EmbedYoutubeModal';
import './styles.css'
interface ToolbarProps {
    toolbarData: ToolbarItem[],
    selectedItem: DropdownItem | undefined;
    canUndo: boolean,
    canRedo: boolean,
    handleToolbarSelect: (item: ToolbarItem) => void,
    handleInsertImage: (payload: InsertImagePayload) => void,
    // handleInsertInlineImage: (payload: InlineImagePayload) => void,
    handleInsertTable: (payload: InsertTableCommandPayload) => void,
    handleInsertColumnsLayout: (payload: { value: string }) => void,
    handleEmbedYoutube: (payload: { value: string }) => void,
}

const Toolbar = ({ toolbarData, canUndo, canRedo, selectedItem, handleToolbarSelect,
    handleInsertImage, handleInsertTable, handleInsertColumnsLayout, handleEmbedYoutube }: ToolbarProps) => {

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
            <ImageModal onClick={handleInsertImage} />
            <TableModal onClick={handleInsertTable} />
            <ColumnsLayoutModal onClick={handleInsertColumnsLayout} />
            <EmbedYoutubeModal onClick={handleEmbedYoutube} />
        </div>
    );
}

export default Toolbar