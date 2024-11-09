import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getTableColumnIndexFromTableCellNode,
    $getTableRowIndexFromTableCellNode,
    $insertTableColumn__EXPERIMENTAL,
    $insertTableRow__EXPERIMENTAL,
    $isTableCellNode,
    $isTableNode,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $getNearestNodeFromDOMNode, NodeKey, } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { useDebounce } from './CodeActionMenuPlugin/utils';

const BUTTON_WIDTH_PX = 20;

function TableHoverActionsContainer({ anchorElem, }: { anchorElem: HTMLElement; }): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [isShownRow, setShownRow] = useState<boolean>(false);
    const [isShownColumn, setShownColumn] = useState<boolean>(true);
    const [shouldListenMouseMove, setShouldListenMouseMove] = useState<boolean>(false);
    const [position, setPosition] = useState({});
    const codeSetRef = useRef<Set<NodeKey>>(new Set());
    const tableDOMNodeRef = useRef<HTMLElement | null>(null);

    const debouncedOnMouseMove = useDebounce((event: MouseEvent) => {

        const { isOutside, tableDOMNode } = getMouseInfo(event);
        if (isOutside) {
            setShownRow(false);
            setShownColumn(false);
            return;
        }

        if (!tableDOMNode) {
            return;
        }

        tableDOMNodeRef.current = tableDOMNode;

        let hoveredRowNode: TableCellNode | null = null;
        let hoveredColumnNode: TableCellNode | null = null;
        let tableDOMElement: HTMLElement | null = null;

        // console.log('tableDOMNodeRef.current', tableDOMNodeRef.current)

        editor.update(() => {
            const maybeTableCell = $getNearestNodeFromDOMNode(tableDOMNode);
            // console.log('maybeTableCell: ', maybeTableCell);
            // console.log('$isTableCellNode(maybeTableCell):', $isTableCellNode(maybeTableCell))
            if ($isTableCellNode(maybeTableCell)) {
                const tableNode = $findMatchingParent(maybeTableCell, (node) => $isTableNode(node),);

                if (!$isTableNode(tableNode)) {
                    return;
                }

                // console.log('tableNode: ', tableNode)

                tableDOMElement = editor.getElementByKey(tableNode?.getKey());
                // console.log('tableDOMElement: ', tableDOMElement)

                if (tableDOMElement) {
                    const rowCount = tableNode.getChildrenSize();
                    const colCount = ((tableNode as TableNode).getChildAtIndex(0) as TableRowNode)?.getChildrenSize();
                    const rowIndex = $getTableRowIndexFromTableCellNode(maybeTableCell);
                    const colIndex = $getTableColumnIndexFromTableCellNode(maybeTableCell);

                    if (rowIndex === rowCount - 1) {
                        hoveredRowNode = maybeTableCell;
                    } else if (colIndex === colCount - 1) {
                        hoveredColumnNode = maybeTableCell;
                    }
                    // console.log('rowCount, colCount, rowIndex, colIndex : ', rowCount, colCount, rowIndex, colIndex)
                }
            }
        });

        if (tableDOMElement) {
            const { width: tableElemWidth, y: tableElemY, x: tableElemX, right: tableElemRight, bottom: tableElemBottom, height: tableElemHeight, } = (tableDOMElement as HTMLTableElement).getBoundingClientRect();

            const { y: editorElemY } = anchorElem.getBoundingClientRect();

            if (hoveredRowNode) {
                setShownColumn(false);
                setShownRow(true);
                setPosition({ height: BUTTON_WIDTH_PX, left: tableElemX, top: tableElemBottom - editorElemY, width: tableElemWidth, });
                // setPosition({ height: BUTTON_WIDTH_PX, left: tableElemX, top: tableElemBottom - editorElemY + 5, width: tableElemWidth, });
            } else if (hoveredColumnNode) {
                setShownColumn(true);
                setShownRow(false);
                setPosition({ height: tableElemHeight, left: tableElemRight, top: tableElemY - editorElemY, width: BUTTON_WIDTH_PX, });
                // setPosition({ height: tableElemHeight, left: tableElemRight + 5, top: tableElemY - editorElemY, width: BUTTON_WIDTH_PX, });
            }
        }
    },
        50,
        250,
    );

    useEffect(() => {
        if (!shouldListenMouseMove) {
            console.log('!shouldListenMouseMove', !shouldListenMouseMove)
            return;
        }
        document.addEventListener('mousemove', debouncedOnMouseMove);

        return () => {
            setShownRow(false);
            setShownColumn(false);
            debouncedOnMouseMove.cancel();
            document.removeEventListener('mousemove', debouncedOnMouseMove);
        };
    }, [shouldListenMouseMove, debouncedOnMouseMove]);

    useEffect(() => {
        return mergeRegister(
            editor.registerMutationListener(
                TableNode,
                (mutations) => {
                    editor.getEditorState().read(() => {
                        // console.log('mutations: ', mutations)
                        mutations.forEach((mutation, nodeKey) => {
                            if (mutation === 'created') {
                                console.log(`mutation created TableNode with key ${nodeKey} was added`);
                                codeSetRef.current.add(nodeKey);
                                setShouldListenMouseMove(codeSetRef.current.size > 0);
                                // Additional logic when a tableNode is created
                            } else if (mutation === 'updated') {
                                console.log(`mutation updated TableNode with key ${nodeKey} was updated`);
                                // Additional logic when a tableNode is updated
                            } else if (mutation === 'destroyed') {
                                console.log(`mutaion destroyed TableNode with key ${nodeKey} was removed`);
                                codeSetRef.current.delete(nodeKey);
                                setShouldListenMouseMove(codeSetRef.current.size > 0);
                                // Additional logic when a tableNode is deleted
                            }
                        });
                    });
                },
                { skipInitialization: false },
            ),
        );
    }, [editor]);

    const insertAction = (insertRow: boolean) => {
        if (insertRow) {
            alert('add row button clicked')
        } else {
            alert('add column  button clicked')
        }

        editor.update(() => {
            if (tableDOMNodeRef.current) {
                const maybeTableNode = $getNearestNodeFromDOMNode(tableDOMNodeRef.current,);
                maybeTableNode?.selectEnd();
                if (insertRow) {
                    $insertTableRow__EXPERIMENTAL();
                    setShownRow(false);
                } else {
                    $insertTableColumn__EXPERIMENTAL();
                    setShownColumn(false);
                }
            }
        });
    };

    return (
        <>
            {/* <div> {`isShownRow: ${isShownRow}`}            </div>
            <div>   {`isShownColumn: ${isShownColumn}`}</div>
            <div>   {`position: ${position}`}</div> */}

            {isShownRow && (
                <button
                    title='tableAddColumns'
                    className={'editor-tableAddRows'}
                    // style={{ ...position }}
                    onClick={() => insertAction(true)}
                />
            )}
            {isShownColumn && (
                <button
                    title='tableAddColumns'
                    className={'editor-tableAddColumns'}
                    // style={{ ...position }}
                    onClick={() => insertAction(false)}
                />
            )}
        </>
    );
}

function getMouseInfo(event: MouseEvent): { tableDOMNode: HTMLElement | null; isOutside: boolean; } {

    const target = event.target;

    if (target && target instanceof HTMLElement) {
        const tableDOMNode = target.closest<HTMLElement>('td.editor-tableCell, th.editor-tableCell',);
        const isOutside = !(tableDOMNode || target.closest<HTMLElement>('button.editor__tableAddRows',) || target.closest<HTMLElement>('button.editor__tableAddColumns',) || target.closest<HTMLElement>('div.TableCellResizer__resizer'));
        return { isOutside, tableDOMNode };
    } else {
        return { isOutside: true, tableDOMNode: null };
    }
}
export default function TableHoverActionsPlugin({ anchorElem }: { anchorElem?: HTMLElement }): React.ReactPortal | null {
    const [isClient, setIsClient] = useState(false);
    React.useLayoutEffect(() => {
        setIsClient(true);
    }, []);
    if (!isClient) return null;

    return createPortal(<TableHoverActionsContainer anchorElem={anchorElem ?? document.body} />, anchorElem ?? document.body);
}

