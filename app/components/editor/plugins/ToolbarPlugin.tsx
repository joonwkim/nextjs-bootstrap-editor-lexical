'use client'
import React, { createContext, Dispatch, useCallback, useContext, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { actionName, DropdownItem, getRichTextAction, RichTextAction, ToolbarItem } from '../data/toolbarData';
import Toolbar from '../../controls/toolbar';
import { $createNodeSelection, $createParagraphNode, $createRangeSelection, $getRoot, $getSelection, $insertNodes, $isElementNode, $isNodeSelection, $isRangeSelection, $isRootOrShadowRoot, $setSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, createCommand, DRAGOVER_COMMAND, DRAGSTART_COMMAND, DROP_COMMAND, EditorThemeClasses, ElementFormatType, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, INDENT_CONTENT_COMMAND, KEY_MODIFIER_COMMAND, Klass, LexicalCommand, LexicalEditor, LexicalNode, NodeKey, OUTDENT_CONTENT_COMMAND, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical';
import { $findMatchingParent, $isEditorIsNestedEditor, $getNearestNodeOfType, mergeRegister, $wrapNodeInElement, $insertNodeToNearestRoot } from '@lexical/utils'
import { $isParentElementRTL, $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $isListNode, INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, } from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { getSelectedNode } from '../utils/getSelectedNode';
// import { sanitizeUrl } from '../utils/url';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createImageNode, $isImageNode, ImageNode, ImagePayload } from '../nodes/ImageNode';
import { CAN_USE_DOM } from '@lexical/utils'
import { sanitizeUrl } from '../utils/url';
import { $createInlineImageNode, InlineImagePayload } from '../nodes/InlineImageNode';
import { $createTableNodeWithDimensions, INSERT_TABLE_COMMAND, InsertTableCommandPayload, TableNode } from '@lexical/table';
import { INSERT_LAYOUT_COMMAND } from './LayoutPlugin';
import { $createStickyNode } from '../nodes/StickyNode';
import { INSERT_YOUTUBE_COMMAND } from './YouTubePlugin';

// const getDOMSelection = (targetWindow: Window | null): Selection | null => CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

export type InsertImagePayload = Readonly<ImagePayload>;
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

// export type InsertInlineImagePayload = Readonly<InlineImagePayload>;
// export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImagePayload> = createCommand('INSERT_INLINE_IMAGE_COMMAND');

export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> = createCommand('INSERT_NEW_TABLE_COMMAND');


export type CellEditorConfig = Readonly<{ namespace: string; nodes?: ReadonlyArray<Klass<LexicalNode>>; onError: (error: Error, editor: LexicalEditor) => void; readOnly?: boolean; theme?: EditorThemeClasses; }>;

export type CellContextShape = {
    cellEditorConfig: null | CellEditorConfig;
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
    set: (cellEditorConfig: null | CellEditorConfig, cellEditorPlugins: null | JSX.Element | Array<JSX.Element>,) => void;
};

export const CellContext = createContext<CellContextShape>({
    cellEditorConfig: null,
    cellEditorPlugins: null,
    set: () => {
        // Empty
    },
});

interface LexicalToolbarProps {
    isReadOnly: boolean,
    lexicalToolbarData: ToolbarItem[],
    setIsLinkEditMode: Dispatch<boolean>,
}

// const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
// const img = document.createElement('img');
// img.src = TRANSPARENT_IMAGE;

//#region  insert image

// function $onDragStart(event: DragEvent): boolean {
//     console.log('$onDragStart:')
//     const node = $getImageNodeInSelection();
//     if (!node) {
//         return false;
//     }
//     const dataTransfer = event.dataTransfer;
//     if (!dataTransfer) {
//         return false;
//     }
//     dataTransfer.setData('text/plain', '_');
//     dataTransfer.setDragImage(img, 0, 0);
//     dataTransfer.setData(
//         'application/x-lexical-drag',
//         JSON.stringify({
//             data: {
//                 altText: node.__altText,
//                 caption: node.__caption,
//                 height: node.__height,
//                 key: node.getKey(),
//                 maxWidth: node.__maxWidth,
//                 showCaption: node.__showCaption,
//                 src: node.__src,
//                 width: node.__width,
//             },
//             type: 'image',
//         }),
//     );

//     return true;
// }

// function $onDragover(event: DragEvent): boolean {
//     const node = $getImageNodeInSelection();
//     if (!node) {
//         return false;
//     }
//     if (!canDropImage(event)) {
//         event.preventDefault();
//     }
//     return true;
// }

// function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
//     const node = $getImageNodeInSelection();
//     if (!node) {
//         return false;
//     }
//     const data = getDragImageData(event);
//     if (!data) {
//         return false;
//     }
//     event.preventDefault();
//     if (canDropImage(event)) {
//         const range = getDragSelection(event);
//         node.remove();
//         const rangeSelection = $createRangeSelection();
//         if (range !== null && range !== undefined) {
//             rangeSelection.applyDOMRange(range);
//         }
//         $setSelection(rangeSelection);
//         editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
//     }
//     return true;
// }

// function $getImageNodeInSelection(): ImageNode | null {
//     const selection = $getSelection();
//     if (!$isNodeSelection(selection)) {
//         return null;
//     }
//     const nodes = selection.getNodes();
//     const node = nodes[0];
//     return $isImageNode(node) ? node : null;
// }

// function getDragImageData(event: DragEvent): null | InsertImagePayload {
//     const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
//     if (!dragData) {
//         return null;
//     }
//     const { type, data } = JSON.parse(dragData);
//     if (type !== 'image') {
//         return null;
//     }

//     return data;
// }

// declare global {
//     interface DragEvent {
//         rangeOffset?: number;
//         rangeParent?: Node;
//     }
// }

// function canDropImage(event: DragEvent): boolean {
//     const target = event.target;
//     return !!(
//         target &&
//         target instanceof HTMLElement &&
//         !target.closest('code, span.editor-image') &&
//         target.parentElement &&
//         target.parentElement.closest('div.ContentEditable__root')
//     );
// }

// function getDragSelection(event: DragEvent): Range | null | undefined {
//     let range;
//     const target = event.target as null | Element | Document;
//     const targetWindow =
//         target == null
//             ? null
//             : target.nodeType === 9
//                 ? (target as Document).defaultView
//                 : (target as Element).ownerDocument.defaultView;
//     const domSelection = getDOMSelection(targetWindow);
//     if (document.caretRangeFromPoint) {
//         range = document.caretRangeFromPoint(event.clientX, event.clientY);
//     } else if (event.rangeParent && domSelection !== null) {
//         domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
//         range = domSelection.getRangeAt(0);
//     } else {
//         throw Error(`Cannot get the selection when dragging`);
//     }

//     return range;
// }

//#endregion

const ToolbarPlugin = ({ lexicalToolbarData, isReadOnly, setIsLinkEditMode }: LexicalToolbarProps) => {
    const [editor] = useLexicalComposerContext();
    const [toolbarData, setToolbarData] = useState<ToolbarItem[]>(lexicalToolbarData)
    const [activeEditor, setActiveEditor] = useState(editor);
    const [blockType, setBlockType] = useState<keyof typeof actionName>(RichTextAction.Paragraph);
    const [isRTL, setIsRTL] = useState(false);
    const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null,);
    const [selectedRichTextAction, setSelectedRichTextAction] = useState<RichTextAction | null>(null)
    const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [selectedBlockType, setSelectedBlockType] = useState<DropdownItem | undefined>()
    const cellContext = useContext(CellContext);
    // const cellContext = useContext(CellContext);


    const $updateDropdownItemForBlockFormatItmes = useCallback((action: RichTextAction) => {
        const updatedToolbarData = toolbarData.map(item => ({ ...item, dropdownItems: item.dropdownItems?.map(dropdown => dropdown.id === action ? { ...dropdown, active: true } : { ...dropdown, active: false }) }));
        const si = updatedToolbarData[4].dropdownItems?.find(item => item.id === action);
        if (si) {
            setSelectedBlockType(si)
        }
    }, [toolbarData]);


    //updateToolbar
    const $updateToolbar = useCallback(() => {

        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // console.log('selection: ', selection)
            if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
                // const rootElement = activeEditor.getRootElement();
                // setIsImageCaption(!!rootElement?.parentElement?.classList.contains('image-caption-container',),);
            } else {
                // setIsImageCaption(false);
            }

            // console.log('isImageCaption', isImageCaption)

            const anchorNode = selection.anchor.getNode();
            // console.log('anchorNode', anchorNode)
            let element = anchorNode.getKey() === 'root' ? anchorNode : $findMatchingParent(anchorNode, (e) => { const parent = e.getParent(); return parent !== null && $isRootOrShadowRoot(parent); });

            // console.log('element:', element)

            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow();
            }

            const elementKey = element.getKey();
            // console.log('elementKey:', elementKey)
            const elementDOM = activeEditor.getElementByKey(elementKey);
            // console.log('elementDOM:', elementDOM)

            setIsRTL($isParentElementRTL(selection));
            // console.log('isRTL:', isRTL)

            // Update links
            const node = getSelectedNode(selection);
            // console.log('node: ', node)
            const parent = node.getParent();
            // console.log('parent: ', parent)
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                // console.log('selectedElementKey', selectedElementKey)
                let type;
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode,);
                    type = parentList ? parentList.getListType() : element.getListType();
                    setBlockType(type as keyof typeof actionName);
                    // console.log('type: $isListNode(element)', blockType)
                    // console.log('type:', type)
                } else {
                    type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    // console.log('type:$isListNode(element) else', type)
                    if (type in actionName) {
                        setBlockType(type as keyof typeof actionName);
                        // console.log('blockType:', blockType)
                    }

                }
                const action = getRichTextAction(type)

                if (action) {
                    // console.log('action: ', action)
                    setSelectedRichTextAction(action)
                    $updateDropdownItemForBlockFormatItmes(action);

                }
            }
            let matchingParent;
            if ($isLinkNode(parent)) {
                matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),);
                // console.log('matchingParent:', matchingParent)
            }

            // If matchingParent is a valid node, pass it's format type
            setElementFormat($isElementNode(matchingParent) ? matchingParent.getFormatType() : $isElementNode(node) ? node.getFormatType() : parent?.getFormatType() || 'left',);
        }
        if ($isRangeSelection(selection)) {
            // console.log('selection: ', selection)
        }
    }, [$updateDropdownItemForBlockFormatItmes, activeEditor, editor]);

    // editor.setEditable(!isReadOnly); /
    useEffect(() => {
        editor.setEditable(!isReadOnly); // Set editor to editable when not in read-only mode
    }, [editor, isReadOnly]);


    //set toolbar  data
    useEffect(() => {
        // console.log('LexicalToolbar use effect set toolbar  data')
        setToolbarData(lexicalToolbarData)
    }, [lexicalToolbarData])

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }
        return mergeRegister(
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    setActiveEditor(newEditor);
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),

            activeEditor.registerCommand<InsertImagePayload>(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    // console.log('payload: ', payload)
                    const imageNode = $createImageNode(payload);
                    $insertNodes([imageNode]);
                    if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
                        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                    }
                    return true;
                }, COMMAND_PRIORITY_EDITOR,),

            // activeEditor.registerCommand<InsertInlineImagePayload>(
            //     INSERT_INLINE_IMAGE_COMMAND,
            //     (payload) => {
            //         // const inlineImageNode = $createInlineImageNode(payload);
            //         // const selection = $createNodeSelection();
            //         // $setSelection(selection);
            //         // selection.insertNodes([inlineImageNode]);

            //         // console.log('payload: ', payload)
            //         const imageNode = $createInlineImageNode(payload);
            //         $insertNodes([imageNode]);
            //         if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            //             $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
            //         }

            //         return true;
            //     }, COMMAND_PRIORITY_EDITOR,
            // ),

            // activeEditor.registerCommand<DragEvent>(
            //     DRAGSTART_COMMAND,
            //     (event) => {
            //         return $onDragStart(event);
            //     },
            //     COMMAND_PRIORITY_HIGH,
            // ),
            // activeEditor.registerCommand<DragEvent>(
            //     DRAGOVER_COMMAND,
            //     (event) => {
            //         return $onDragover(event);
            //     },
            //     COMMAND_PRIORITY_LOW,
            // ),
            // activeEditor.registerCommand<DragEvent>(
            //     DROP_COMMAND,
            //     (event) => {
            //         return $onDrop(event, activeEditor);
            //     },
            //     COMMAND_PRIORITY_HIGH,
            // ),
            activeEditor.registerEditableListener((editable) => {
                setIsEditable(editable);
            }),
            activeEditor.registerCommand<boolean>(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            activeEditor.registerCommand<boolean>(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),

        );
    }, [$updateToolbar, activeEditor, editor]);

    //to get updated content
    useEffect(() => {
        return activeEditor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                $updateToolbar();
            });
        });
    }, [$updateToolbar, activeEditor]);

    // useEffect(() => {
    //     return editor.registerCommand(
    //         SELECTION_CHANGE_COMMAND,
    //         (_payload, newEditor) => {
    //             setActiveEditor(newEditor);
    //             console.log('updatetoolbar SELECTION_CHANGE_COMMAND: ')
    //             $updateToolbar();
    //             return false;
    //         },
    //         COMMAND_PRIORITY_CRITICAL,
    //     );
    // }, [editor, $updateToolbar]);

    // useEffect(() => {
    //     activeEditor.getEditorState().read(() => {
    //         console.log('updatetoolbar getEditorState: ')
    //         $updateToolbar();
    //     });
    // }, [activeEditor, $updateToolbar]);


    //useEffect activeEditor.registerCommand: KEY_MODIFIER_COMMAND
    useEffect(() => {
        // console.log('useEffect activeEditor.registerCommand: ')
        return activeEditor.registerCommand(
            KEY_MODIFIER_COMMAND,
            (payload) => {
                const event: KeyboardEvent = payload;
                const { code, ctrlKey, metaKey } = event;

                if (code === 'KeyK' && (ctrlKey || metaKey)) {
                    event.preventDefault();
                    let url: string | null;
                    if (!isLink) {
                        setIsLinkEditMode(true);
                        url = sanitizeUrl('https://');
                    } else {
                        setIsLinkEditMode(false);
                        url = null;
                    }
                    return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
                }
                return false;
            },
            COMMAND_PRIORITY_NORMAL,
        );
    }, [activeEditor, isLink, setIsLinkEditMode]);



    useEffect(() => {
        // console.log('useEffect activeEditor.registerCommand: ')
        return activeEditor.registerCommand(
            KEY_MODIFIER_COMMAND,
            (payload) => {
                const event: KeyboardEvent = payload;
                const { code, ctrlKey, metaKey } = event;

                if (code === 'KeyK' && (ctrlKey || metaKey)) {
                    event.preventDefault();
                    let url: string | null;
                    if (!isLink) {
                        setIsLinkEditMode(true);
                        url = sanitizeUrl('https://');
                    } else {
                        setIsLinkEditMode(false);
                        url = null;
                    }
                    return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
                }
                return false;
            },
            COMMAND_PRIORITY_NORMAL,
        );
    }, [activeEditor, isLink, setIsLinkEditMode]);

    useEffect(() => {
        if (!activeEditor.hasNodes([TableNode])) {
            // invariant(false, 'TablePlugin: TableNode is not registered on editor');
        }

        // cellContext.set(cellEditorConfig, children);

        return activeEditor.registerCommand<InsertTableCommandPayload>(
            INSERT_NEW_TABLE_COMMAND,
            ({ columns, rows, includeHeaders }) => {
                const tableNode = $createTableNodeWithDimensions(
                    Number(rows),
                    Number(columns),
                    includeHeaders,
                );
                $insertNodes([tableNode]);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [activeEditor]);


    const handleToolbarSelect = (item: ToolbarItem) => {
        switch (item.id) {
            case RichTextAction.Undo: {
                const td = toolbarData.map(item =>
                    item.id === RichTextAction.Undo ? { ...item, disabled: false } : item
                );
                setToolbarData(td);
                activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
                break;
            }
            case RichTextAction.Redo: {
                activeEditor.dispatchCommand(REDO_COMMAND, undefined);
                break;
            }
            case RichTextAction.Bold: {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                break;
            }
            case RichTextAction.Italics: {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                break;
            }
            case RichTextAction.Underline: {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                break;
            }
            case RichTextAction.Strikethrough: {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                break;
            }

            case RichTextAction.Paragraph: {
                activeEditor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createParagraphNode());
                    }
                });
                break;
            }
            case RichTextAction.H1: {
                activeEditor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createHeadingNode(RichTextAction.H1));
                    }
                });
                break;
            }
            case RichTextAction.H2: {
                activeEditor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createHeadingNode(RichTextAction.H2));
                    }
                });

                break;
            }
            case RichTextAction.H3: {
                activeEditor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createHeadingNode(RichTextAction.H3));
                    }
                });
                break;
            }
            case RichTextAction.Bullet: {
                activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                break;
            }
            case RichTextAction.Number: {
                activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                break;
            }
            case RichTextAction.Check: {
                activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
                break;
            }
            case RichTextAction.Quote: {

                activeEditor.update(() => {
                    const selection = $getSelection();
                    $setBlocksType(selection, () => $createQuoteNode());
                });
                break;
            }
            case RichTextAction.HR: {
                activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                break;
            }

            case RichTextAction.CenterAlign: {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                break;
            }
            case RichTextAction.RightAlign: {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                break;
            }
            case RichTextAction.JustifyAlign: {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                break;
            }
            case RichTextAction.Indent: {
                activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                break;
            }
            case RichTextAction.Outdent: {
                activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                break;
            }
            case RichTextAction.Sticky: {
                activeEditor.update(() => {
                    const root = $getRoot();
                    const stickyNode = $createStickyNode(0, 0);
                    root.append(stickyNode);
                });
                break;
            }
        }
    }

    const handleInsertImage = (payload: InsertImagePayload) => {
        // console.log('payload: ', payload)
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    };
    // const handleInsertInlineImage = (payload: InlineImagePayload) => {
    //     // alert(JSON.stringify(payload))
    //     activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
    // };

    const handleInsertTable = (payload: InsertTableCommandPayload) => {

        // activeEditor.update(() => {
        //     const tableNode = $createTableNodeWithDimensions(Number(payload.rows), Number(payload.columns), true);
        //     $insertNodeToNearestRoot(tableNode);
        // });
        activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, payload);
    };
    const handleInsertColumnsLayout = (payload: { value: string }) => {
        // alert(payload.value)
        // activeEditor.update(() => {
        //     const tableNode = $createTableNodeWithDimensions(Number(payload.rows), Number(payload.columns), true);
        //     $insertNodeToNearestRoot(tableNode);
        // });
        activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, payload.value);
    };
    const handleEmbedYoutube = (payload: { value: string }) => {
        activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, payload.value);
    };



    return (
        <div>
            <Toolbar toolbarData={toolbarData} canUndo={canUndo} canRedo={canRedo}
                handleToolbarSelect={handleToolbarSelect} selectedItem={selectedBlockType}
                handleInsertImage={handleInsertImage} handleInsertTable={handleInsertTable}
                handleInsertColumnsLayout={handleInsertColumnsLayout}
                handleEmbedYoutube={handleEmbedYoutube}
            />
        </div>

    )
}

export default ToolbarPlugin
