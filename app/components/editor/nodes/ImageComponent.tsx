import { $getNodeByKey, $getSelection, $isNodeSelection, $isRangeSelection, $setSelection, BaseSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, createCommand, DRAGSTART_COMMAND, KEY_BACKSPACE_COMMAND, KEY_DELETE_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND, LexicalCommand, LexicalEditor, LineBreakNode, NodeKey, ParagraphNode, RootNode, SELECTION_CHANGE_COMMAND, TextNode } from 'lexical';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
// import { useSharedHistoryContext } from '../context/SharedHistoryContext';
import Image from 'next/image';
import { $isImageNode } from './ImageNode';
import { mergeRegister } from '@lexical/utils';
import { useSettings } from '../context/SettingsContext';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ImageResizer from './ImageResizer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import TreeViewPlugin from '../plugins/TreeViewPlugin';
import { LinkNode } from '@lexical/link';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import ContentEditable from './ContentEditable';
import BrokenImage from './BrokenImage';
import LazyImage from './LazyImage';
export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand('RIGHT_CLICK_IMAGE_COMMAND');


interface ImageComponentProps {
    altText: string;
    caption: LexicalEditor;
    height: 'inherit' | number;
    maxWidth: number;
    nodeKey: NodeKey;
    resizable: boolean;
    showCaption: boolean;
    src: string;
    width: 'inherit' | number;
    captionsEnabled: boolean;
}

const ImageComponent = ({ src, altText, nodeKey, width, height, maxWidth, resizable, showCaption, caption, captionsEnabled, }: ImageComponentProps) => {

    const imageRef = useRef<null | HTMLImageElement>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [editor] = useLexicalComposerContext();
    const [selection, setSelection] = useState<BaseSelection | null>(null);
    const activeEditorRef = useRef<LexicalEditor | null>(null);
    const [isLoadError, setIsLoadError] = useState<boolean>(false);

    const $onDelete = useCallback(
        (payload: KeyboardEvent) => {
            const deleteSelection = $getSelection();
            if (isSelected && $isNodeSelection(deleteSelection)) {
                const event: KeyboardEvent = payload;
                event.preventDefault();
                editor.update(() => {
                    deleteSelection.getNodes().forEach((node) => {
                        if ($isImageNode(node)) {
                            node.remove();
                        }
                    });
                });
            }
            return false;
        },
        [editor, isSelected],
    );

    const $onEnter = useCallback(
        (event: KeyboardEvent) => {
            const latestSelection = $getSelection();
            const buttonElem = buttonRef.current;
            if (
                isSelected &&
                $isNodeSelection(latestSelection) &&
                latestSelection.getNodes().length === 1
            ) {
                if (showCaption) {
                    // Move focus into nested editor
                    $setSelection(null);
                    event.preventDefault();
                    caption.focus();
                    return true;
                } else if (
                    buttonElem !== null &&
                    buttonElem !== document.activeElement
                ) {
                    event.preventDefault();
                    buttonElem.focus();
                    return true;
                }
            }
            return false;
        },
        [caption, isSelected, showCaption],
    );

    const $onEscape = useCallback(
        (event: KeyboardEvent) => {
            if (
                activeEditorRef.current === caption ||
                buttonRef.current === event.target
            ) {
                $setSelection(null);
                editor.update(() => {
                    setSelected(true);
                    const parentRootElement = editor.getRootElement();
                    if (parentRootElement !== null) {
                        parentRootElement.focus();
                    }
                });
                return true;
            }
            return false;
        },
        [caption, editor, setSelected],
    );

    const onClick = useCallback((payload: MouseEvent) => {
        console.log('onClick')
        const event = payload;

        if (isResizing) {
            return true;
        }
        if (event.target === imageRef.current) {
            if (event.shiftKey) {
                setSelected(!isSelected);
            } else {
                clearSelection();
                setSelected(true);
            }
            return true;
        }

        return false;
    },
        [isResizing, isSelected, setSelected, clearSelection],
    );

    const onRightClick = useCallback(
        (event: MouseEvent): void => {
            editor.getEditorState().read(() => {
                const latestSelection = $getSelection();
                const domElement = event.target as HTMLElement;
                if (
                    domElement.tagName === 'IMG' &&
                    $isRangeSelection(latestSelection) &&
                    latestSelection.getNodes().length === 1
                ) {
                    editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent,);
                }
            });
        },
        [editor],
    );

    useEffect(() => {
        let isMounted = true;
        const rootElement = editor.getRootElement();
        const unregister = mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                if (isMounted) {
                    setSelection(editorState.read(() => $getSelection()));
                }
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_, activeEditor) => {
                    activeEditorRef.current = activeEditor;
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand<MouseEvent>(
                CLICK_COMMAND,
                onClick,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand<MouseEvent>(
                RIGHT_CLICK_IMAGE_COMMAND,
                onClick,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                DRAGSTART_COMMAND,
                (event) => {
                    if (event.target === imageRef.current) {
                        // TODO This is just a temporary workaround for FF to behave like other browsers.
                        // Ideally, this handles drag & drop too (and all browsers).
                        event.preventDefault();
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                $onDelete,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                $onDelete,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                $onEscape,
                COMMAND_PRIORITY_LOW,
            ),
        );

        rootElement?.addEventListener('contextmenu', onRightClick);

        return () => {
            isMounted = false;
            unregister();
            rootElement?.removeEventListener('contextmenu', onRightClick);
        };
    }, [
        clearSelection,
        editor,
        isResizing,
        isSelected,
        nodeKey,
        $onDelete,
        $onEnter,
        $onEscape,
        onClick,
        onRightClick,
        setSelected,
    ]);

    const setShowCaption = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
                node.setShowCaption(true);
            }
        });
    };

    const onResizeEnd = (
        nextWidth: 'inherit' | number,
        nextHeight: 'inherit' | number,
    ) => {
        // Delay hiding the resize bars for click case
        setTimeout(() => {
            setIsResizing(false);
        }, 200);

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
                node.setWidthAndHeight(nextWidth, nextHeight);
            }
        });
    };

    const onResizeStart = () => {
        setIsResizing(true);
    };

    // const { historyState } = useSharedHistoryContext();
    const { settings: { showNestedEditorTreeView }, } = useSettings();

    const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
    const isFocused = isSelected || isResizing;
    const defaultWidth = width === 'inherit' ? 300 : width;  // Default width if "inherit"
    const defaultHeight = height === 'inherit' ? 200 : height;  // Default height if "inherit"
    return (
        <Suspense fallback={null}>
            <>
                <div>{`isSelected: ${isSelected}`}</div>
                <div>{`load error: ${isLoadError}`}</div>
                <div>{`showCaption: ${showCaption}`}</div>
                <div>{`resizable: ${resizable}`}</div>
                <div>{`className: ${isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}`}</div>

                <div className='image-container' draggable={draggable} onClick={() => onClick}>
                    <Image ref={imageRef}
                        src={src}
                        alt={altText}
                        width={maxWidth}
                        height={0}
                        layout="intrinsic"
                        loading="lazy"
                    />
                    {/* <LazyImage
                        className={isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}
                        src={src}
                        altText={altText}
                        imageRef={imageRef}
                        width={width}
                        height={height}
                        maxWidth={maxWidth}
                        onError={() => setIsLoadError(true)}
                    /> */}
                    {/* {isLoadError ? (
                        <BrokenImage />
                    ) : (
                        <LazyImage
                            className={isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}
                            src={src}
                            altText={altText}
                            imageRef={imageRef}
                            width={width}
                            height={height}
                            maxWidth={maxWidth}
                            onError={() => setIsLoadError(true)}
                        />
                    )} */}
                </div>

                {showCaption && (
                    <div className="image-caption-container">
                        <LexicalNestedComposer
                            initialEditor={caption}
                            initialNodes={[
                                RootNode,
                                TextNode,
                                LineBreakNode,
                                ParagraphNode,
                                LinkNode,
                                // EmojiNode,
                                // HashtagNode,
                                // KeywordNode,
                            ]}>
                            <AutoFocusPlugin />
                            {/* <MentionsPlugin />
                            <LinkPlugin />
                            <EmojisPlugin />
                            <HashtagPlugin />
                            <KeywordsPlugin /> */}
                            {/* {isCollabActive ? (
                                <CollaborationPlugin
                                    id={caption.getKey()}
                                    providerFactory={createWebsocketProvider}
                                    shouldBootstrap={true}
                                />
                            ) : (
                                <HistoryPlugin externalHistoryState={historyState} />
                            )} */}
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable
                                        placeholder="Enter a caption..."
                                        placeholderClassName="ImageNode__placeholder"
                                        className="ImageNode__contentEditable"
                                    />
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            {showNestedEditorTreeView === true ? <TreeViewPlugin /> : null}
                        </LexicalNestedComposer>
                    </div>
                )}
                {resizable && $isNodeSelection(selection) && isFocused && (
                    <ImageResizer
                        showCaption={showCaption}
                        setShowCaption={setShowCaption}
                        editor={editor}
                        buttonRef={buttonRef}
                        imageRef={imageRef}
                        maxWidth={maxWidth}
                        onResizeStart={onResizeStart}
                        onResizeEnd={onResizeEnd}
                        captionsEnabled={!isLoadError && captionsEnabled}
                    />
                )}
            </>
        </Suspense>
    )
}
export default ImageComponent