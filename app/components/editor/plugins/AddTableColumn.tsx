import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertTableColumn__EXPERIMENTAL, $insertTableRow__EXPERIMENTAL, TableNode } from '@lexical/table';
import { $getNearestNodeFromDOMNode, NodeKey } from 'lexical';
import React, { useEffect, useRef, useState } from 'react'
import { useDebounce } from './CodeActionMenuPlugin/utils';

function getMouseInfo(event: MouseEvent): { tableDOMNode: HTMLElement | null; isOutside: boolean; } {
    const target = event.target;

    if (target && target instanceof HTMLElement) {
        const tableDOMNode = target.closest<HTMLElement>(
            'td.editor-tableCell, th.editor-tableCell',
        );
        const isOutside = !(
            tableDOMNode ||
            target.closest<HTMLElement>(
                'button.PlaygroundEditorTheme__tableAddRows',
            ) ||
            target.closest<HTMLElement>(
                'button.PlaygroundEditorTheme__tableAddColumns',
            ) ||
            target.closest<HTMLElement>('div.TableCellResizer__resizer')
        );
        return { isOutside, tableDOMNode };
    } else {
        return { isOutside: true, tableDOMNode: null };
    }
}

const AddTableColumn = () => {
    const [editor] = useLexicalComposerContext();
    // const [isShownRow, setShownRow] = useState<boolean>(true);
    // const [isShownColumn, setShownColumn] = useState<boolean>(true);
    // const [shouldListenMouseMove, setShouldListenMouseMove] = useState<boolean>(false);
    // const [position, setPosition] = useState<{ height: number, left: number, top: number, width: number }>({});
    // const codeSetRef = useRef<Set<NodeKey>>(new Set());
    const tableDOMNodeRef = useRef<HTMLElement | null>(null);




    const insertAction = (insertRow: boolean) => {
        editor.update(() => {
            if (tableDOMNodeRef.current) {
                const maybeTableNode = $getNearestNodeFromDOMNode(
                    tableDOMNodeRef.current,
                );
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
            <div>AddTableColumn</div>
            <button onClick={() => insertAction(false)}>
                Add Column
            </button>
            {/* <button
                title="tableAddColumns"
                className='editor-tableAddColumns'
                style={{
                    '--button-height': position.height,
                    '--button-width': position.width,
                    '--button-left': position.left,
                    '--button-top': position.top,
                } as React.CSSProperties} // Cast to satisfy TypeScript
                onClick={() => insertAction(false)}
            ></button> */}
        </>

    )
}

export default AddTableColumn