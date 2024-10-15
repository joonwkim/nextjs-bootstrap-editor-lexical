'use client'
import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { getRichTextAction, RichTextAction, ToolbarItem } from '../../data/toolbarData';
import Toolbar from '../../controls/toolbar';
import { $createParagraphNode, $getSelection, $isElementNode, $isRangeSelection, $isRootOrShadowRoot, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, COMMAND_PRIORITY_NORMAL, createCommand, ElementFormatType, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, KEY_MODIFIER_COMMAND, LexicalCommand, NodeKey, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from 'lexical';
import { $findMatchingParent, $isEditorIsNestedEditor, $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { $isParentElementRTL, $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $isListNode, ListNode, } from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { getSelectedNode } from '../utils/getSelectedNode';
import { sanitizeUrl } from '../utils/url';
// import { $isTableNode } from '@lexical/table';

export const INSERT_UNORDERED_LIST_COMMAND: LexicalCommand<void> = createCommand('INSERT_UNORDERED_LIST_COMMAND');
export const INSERT_ORDERED_LIST_COMMAND: LexicalCommand<void> = createCommand('INSERT_ORDERED_LIST_COMMAND',);
export const INSERT_CHECK_LIST_COMMAND: LexicalCommand<void> = createCommand('INSERT_CHECK_LIST_COMMAND',);
export const REMOVE_LIST_COMMAND: LexicalCommand<void> = createCommand('REMOVE_LIST_COMMAND',);


interface LexicalToolbarProps {
    isReadOnly: boolean,
    lexicalToolbarData: ToolbarItem[],
    setIsLinkEditMode: Dispatch<boolean>,
}

const LexicalToolbar = ({ lexicalToolbarData, isReadOnly, setIsLinkEditMode }: LexicalToolbarProps) => {
    const [editor] = useLexicalComposerContext();
    const [toolbarData, setToolbarData] = useState<ToolbarItem[]>(lexicalToolbarData)
    const [activeEditor, setActiveEditor] = useState(editor);
    const [isRTL, setIsRTL] = useState(false);
    const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null,);
    const [selectedRichTextAction, setSelectedRichTextAction] = useState<RichTextAction | null>(null)
    // const [isImageCaption, setIsImageCaption] = useState(false);
    const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
    const [isEditable, setIsEditable] = useState(() => editor.isEditable());
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isLink, setIsLink] = useState(false);

    const $updateDropdownItemForBlockFormatItmes = useCallback((action: RichTextAction) => {
        const updatedToolbarData = toolbarData.map(item => ({ ...item, dropdownItems: item.dropdownItems?.map(dropdown => dropdown.id === action ? { ...dropdown, active: true } : { ...dropdown, active: false }) }));
        console.log('dropdownItems: ',updatedToolbarData[4].dropdownItems);

        // setToolbarData(updatedToolbarData)
        // console.log('data.dropdownItems:', td.dropdownItems, 'action:', action)
    }, [toolbarData]);

    const $updateToolbar = useCallback(() => {
        // console.log('isEditable', isEditable)
        // console.log('canUndo', canUndo)
        // console.log('canRedo', canRedo)

        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
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
            const elementDOM = activeEditor.getElementByKey(elementKey);

            setIsRTL($isParentElementRTL(selection));
            console.log('isRTL', isRTL)

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }

            // const tableNode = $findMatchingParent(node, $isTableNode);
            // if ($isTableNode(tableNode)) {
            //     setRootType('table');
            // } else {
            //     setRootType('root');
            // }

            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                console.log('selectedElementKey', selectedElementKey)
                let type;
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode,);
                    type = parentList ? parentList.getListType() : element.getListType();
                    // console.log('type:', type)
                } else {
                    type = $isHeadingNode(element) ? element.getTag() : element.getType();
                    // console.log('type:', type)
                    // if (type in blockTypeToBlockName) {
                    //     setBlockType(type as keyof typeof blockTypeToBlockName);
                    // }
                    // if ($isCodeNode(element)) {
                    //     const language =
                    //         element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
                    //     setCodeLanguage(
                    //         language ? CODE_LANGUAGE_MAP[language] || language : '',
                    //     );
                    //     return;
                    // }
                }
                const action = getRichTextAction(type)
                if (action) {
                    setSelectedRichTextAction(action)
                    $updateDropdownItemForBlockFormatItmes(action);
                    console.log('action: ', action)
                }
            }
            // Handle buttons
            // setFontColor(
            //     $getSelectionStyleValueForProperty(selection, 'color', '#000'),
            // );
            // setBgColor(
            //     $getSelectionStyleValueForProperty(
            //         selection,
            //         'background-color',
            //         '#fff',
            //     ),
            // );
            // setFontFamily(
            //     $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
            // );
            let matchingParent;
            if ($isLinkNode(parent)) {
                // If node is a link, we need to fetch the parent paragraph node to set format
                matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),);
                // console.log('matchingParent:', matchingParent)
            }

            // If matchingParent is a valid node, pass it's format type
            setElementFormat($isElementNode(matchingParent) ? matchingParent.getFormatType() : $isElementNode(node) ? node.getFormatType() : parent?.getFormatType() || 'left',);
        }
        if ($isRangeSelection(selection)) {
            // setIsBold(selection.hasFormat('bold'));
            // setIsItalic(selection.hasFormat('italic'));
            // setIsUnderline(selection.hasFormat('underline'));
            // setIsStrikethrough(selection.hasFormat('strikethrough'));
            // setIsSubscript(selection.hasFormat('subscript'));
            // setIsSuperscript(selection.hasFormat('superscript'));
            // setIsCode(selection.hasFormat('code'));


            // console.log('selection.hasFormat bold:', selection.hasFormat('bold'))
            // console.log('selection.hasFormat italic:', selection.hasFormat('italic'))
            // console.log('selection.hasFormat underline:', selection.hasFormat('underline'))
            // console.log('selection.hasFormat strikethrough:', selection.hasFormat('strikethrough'))
            // console.log('selection.hasFormat subscript:', selection.hasFormat('subscript'))
            // console.log('selection.hasFormat superscript:', selection.hasFormat('superscript'))
            // console.log('selection.hasFormat code:', selection.hasFormat('code'))

            // setFontSize(
            //     $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
            // );
        }
    }, [$updateDropdownItemForBlockFormatItmes, activeEditor, editor, isRTL, selectedElementKey]);

    useEffect(() => {
        editor.setEditable(!isReadOnly); // Set editor to editable when not in read-only mode
    }, [editor, isReadOnly]);

    // const [headingType, setHeadingType] = useState('Normal');

    // console.log('editor:', editor)
    //set toolbar  data
    useEffect(() => {
        // console.log('LexicalToolbar use effect set toolbar  data')
        setToolbarData(lexicalToolbarData)
    }, [lexicalToolbarData])



    //register SELECTION_CHANGE_COMMAND
    useEffect(() => {
        console.log('useEffect SELECTION_CHANGE_COMMAND: ')
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                setActiveEditor(newEditor);
                $updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar]);

    useEffect(() => {
        console.log('useEffect activeEditor.getEditorState(): ')
        activeEditor.getEditorState().read(() => {
            $updateToolbar();
        });
    }, [activeEditor, $updateToolbar]);

    //register command
    useEffect(() => {
        console.log('useEffect mergeRegister: ')
        return mergeRegister(
            editor.registerEditableListener((editable) => {
                setIsEditable(editable);
            }),
            activeEditor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
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
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
            });
        });
    }, [editor]);

    useEffect(() => {
        console.log('useEffect activeEditor.registerCommand: ')
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

    // const insertLink = useCallback(() => {
    //     console.log('insertLink useCallback: ')
    //     if (!isLink) {
    //         setIsLinkEditMode(true);
    //         activeEditor.dispatchCommand(
    //             TOGGLE_LINK_COMMAND,
    //             sanitizeUrl('https://'),
    //         );
    //     } else {
    //         setIsLinkEditMode(false);
    //         activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    //     }
    // }, [activeEditor, isLink, setIsLinkEditMode]);


    const handleToolbarSelect = (item: ToolbarItem) => {
        if (item.id !== undefined && typeof item.id in RichTextAction) {
            setSelectedRichTextAction(item.id);
            console.log('selectedRichTextAction', selectedRichTextAction)
        }

        switch (item.id) {
            case RichTextAction.Undo: {
                const td = toolbarData.map(item =>
                    item.id === RichTextAction.Undo ? { ...item, disabled: false } : item
                );
                setToolbarData(td);
                editor.dispatchCommand(UNDO_COMMAND, undefined);

                break;
            }
            case RichTextAction.Redo: {
                editor.dispatchCommand(REDO_COMMAND, undefined);
                break;
            }
            case RichTextAction.Bold: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                break;
            }
            case RichTextAction.Italics: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                break;
            }
            case RichTextAction.Underline: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                break;
            }
            case RichTextAction.Strikethrough: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                break;
            }

            case RichTextAction.Paragraph: {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createParagraphNode());
                    }
                });
                break;
            }
            case RichTextAction.H1: {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createHeadingNode(RichTextAction.H1));
                    }
                });
                break;
            }
            case RichTextAction.H2: {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createHeadingNode(RichTextAction.H2));
                    }
                });

                break;
            }
            case RichTextAction.H3: {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $setBlocksType(selection, () => $createHeadingNode(RichTextAction.H3));
                    }
                });
                break;
            }
            case RichTextAction.Bullet: {
                // alert(RichTextAction.Bullet)
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                    }
                });
                break;
            }
            case RichTextAction.Number: {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                break;
            }
            case RichTextAction.Check: {
                editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
                break;
            }
            case RichTextAction.Quote: {
                editor.update(() => {
                    const selection = $getSelection();
                    $setBlocksType(selection, () => $createQuoteNode());
                });
                break;
            }
            case RichTextAction.LeftAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                break;
            }
            case RichTextAction.CenterAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                break;
            }
            case RichTextAction.RightAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                break;
            }
            case RichTextAction.JustifyAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                break;
            }
        }
    }

    return (
        <div>
            {JSON.stringify(elementFormat, null, 2)}
            <Toolbar toolbarData={toolbarData} handleToolbarSelect={handleToolbarSelect} />
        </div>

    )
}

export default LexicalToolbar


