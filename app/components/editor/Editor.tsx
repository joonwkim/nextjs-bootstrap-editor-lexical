'use client'
import React, { useCallback, useEffect, useState } from 'react'
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
import { lexicalToolbarData, RichTextAction, toolbarData, ToolbarItem } from './data/toolbarData';
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
import TableCellResizer from './plugins/TableCellResizer';
import { LayoutPlugin } from './plugins/LayoutPlugin';
import { LayoutContainerNode } from './nodes/LayoutContainerNode';
import { LayoutItemNode } from './nodes/LayoutItemNode';
import { StickyNode } from './nodes/StickyNode';
import { YouTubeNode } from './nodes/YouTubeNode';
import YouTubePlugin from './plugins/YouTubePlugin';
import { CAN_USE_DOM } from '@lexical/utils';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import { LinkNode } from '@lexical/link';
import LinkPlugin from './plugins/LinkPlugin';

const Editor = () => {
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    const placeholder = '내용을 기술하세요...';
    const onRef = (_floatingAnchorElem: HTMLDivElement) => { if (_floatingAnchorElem !== null) { setFloatingAnchorElem(_floatingAnchorElem); } };

    useEffect(() => {

        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

            if (isNextSmallWidthViewport !== isSmallWidthViewport) {
                setIsSmallWidthViewport(isNextSmallWidthViewport);
            }
        };

        updateViewPortWidth();
        window.addEventListener('resize', updateViewPortWidth);

        return () => {
            window.removeEventListener('resize', updateViewPortWidth);
        };
    }, [isSmallWidthViewport]);

    const editorConfig = {
        namespace: 'React.js Lexical',
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, HorizontalRuleNode, ImageNode, TableNode, TableRowNode, TableCellNode,
            LayoutContainerNode, LayoutItemNode, StickyNode, YouTubeNode, LinkNode],
        editorState: null,
        onError(error: Error) {
            throw error;
        },
        theme: EditorTheme,
    };

    const toggleEditMode = () => {
        setIsReadOnly((prev) => !prev);
    };

    return (
        <>
            <button onClick={toggleEditMode}>
                {isReadOnly ? 'Switch to Edit Mode' : 'Switch to Read-Only'}
            </button>
            <div className='editor-shell'>
                <div className='editor-container tree-view'>
                    <LexicalComposer initialConfig={editorConfig}>
                        <div className="editor-scroller">
                            {!isReadOnly && <ToolbarPlugin lexicalToolbarData={toolbarData} isReadOnly={isReadOnly} setIsLinkEditMode={setIsLinkEditMode} />}
                            <div className='editor' ref={onRef}>
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
                                <LinkPlugin />
                                <ListPlugin />
                                <CheckListPlugin />
                                <HorizontalRulePlugin />
                                <TablePlugin
                                    hasCellMerge={true}
                                    hasCellBackgroundColor={true}
                                />
                                <TableCellResizer />
                                <TableHoverActionsPlugin />
                                <LayoutPlugin />
                                <YouTubePlugin />

                                {floatingAnchorElem && !isSmallWidthViewport && (<>

                                    <FloatingLinkEditorPlugin
                                        anchorElem={floatingAnchorElem}
                                        isLinkEditMode={isLinkEditMode}
                                        setIsLinkEditMode={setIsLinkEditMode}
                                    />

                                </>)}
                                <TreeViewPlugin />
                            </div>
                        </div>
                    </LexicalComposer>
                </div>

            </div>
        </>


    );
}

export default Editor