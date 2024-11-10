'use client'
import React, { useState } from 'react'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import EditorTheme from './themes/editorTheme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { toolbarData } from '../data/toolbarData';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import ReadOnlyPlugin from './plugins/ReadOnlyPlugin';
import { ListItemNode, ListNode, } from '@lexical/list';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import './styles.css'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
// import CustomImageNode from './nodes/CustomImageNode';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import { ImageNode } from './nodes/ImageNode';
// import { InlineImageNode } from './nodes/InlineImageNode';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
// import { useSettings } from './context/SettingsContext';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';
import AddTableColumn from './plugins/AddTableColumn';
import { CustomTableNode } from './nodes/CustomTableNode';
import TableCellResizer from './plugins/TableCellResizer';

const Editor = () => {
    // const { settings: { tableCellMerge, tableCellBackgroundColor, }, } = useSettings();
    // console.log('settings:', tableCellMerge, tableCellBackgroundColor)
    const [isReadOnly, setIsReadOnly] = useState(false);
    //const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    // console.log('isLinkEditMode',isLinkEditMode)

    const placeholder = '내용을 기술하세요...';

    const editorConfig = {
        namespace: 'React.js Lexical',
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, HorizontalRuleNode, ImageNode, TableNode, TableRowNode, TableCellNode],
        editorState: null,
        onError(error: Error) {
            console.log('error: ', error)
            throw error;
        },
        theme: EditorTheme,
    };

    const toggleEditMode = () => {
        setIsReadOnly((prev) => !prev);
    };

    return (
        <div className='editor-shell'>

            <button onClick={toggleEditMode}>
                {isReadOnly ? 'Switch to Edit Mode' : 'Switch to Read-Only'}
            </button>
            <div className='editor-container tree-view'>
                <LexicalComposer initialConfig={editorConfig}>
                    <div className="editor-scroller">
                        {!isReadOnly && <ToolbarPlugin lexicalToolbarData={toolbarData} isReadOnly={isReadOnly} setIsLinkEditMode={setIsReadOnly} />}
                        <div className='editor' >
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable
                                        className="editor-input"
                                        aria-placeholder={placeholder}
                                        placeholder={
                                            <div className="editor-placeholder">{placeholder}</div>
                                        }
                                    />
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <ReadOnlyPlugin isReadOnly={isReadOnly} />
                            <HistoryPlugin />
                            <AutoFocusPlugin />
                            <ListPlugin />
                            <CheckListPlugin />
                            <HorizontalRulePlugin />
                            <TablePlugin
                                hasCellMerge={true}
                                hasCellBackgroundColor={true}
                            />

                            <TableCellResizer />
                            <TableHoverActionsPlugin />
                            {/* <TreeViewPlugin /> */}
                        </div>
                    </div>
                </LexicalComposer>
            </div>

        </div>

    );
}

export default Editor