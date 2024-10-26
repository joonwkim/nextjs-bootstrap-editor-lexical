import { $applyNodeReplacement, createEditor, DecoratorNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, LexicalEditor, LexicalNode, NodeKey, SerializedEditor, SerializedLexicalNode, Spread } from "lexical";
import * as React from 'react';
import { Suspense } from "react";
// import ResizableImage from "./ResizableImage ";

const ImageComponent = React.lazy(() => import('./ImageComponent'));

export interface ImagePayload {
    altText: string;
    caption?: LexicalEditor;
    height?: number;
    key?: NodeKey;
    maxWidth?: number;
    showCaption?: boolean;
    src: string;
    width?: number;
    captionsEnabled?: boolean;
}
function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
    return (
        img.parentElement != null &&
        img.parentElement.tagName === 'LI' &&
        img.previousSibling === null &&
        img.getAttribute('aria-roledescription') === 'checkbox'
    );
}
function $convertImageElement(domNode: Node): null | DOMConversionOutput {
    const img = domNode as HTMLImageElement;
    if (img.src.startsWith('file:///') || isGoogleDocCheckboxImg(img)) {
        return null;
    }
    const { alt: altText, src, width, height } = img;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
}
export type SerializedImageNode = Spread<
    {
        altText: string;
        caption: SerializedEditor;
        height?: number;
        maxWidth: number;
        showCaption: boolean;
        src: string;
        width?: number;
    },
    SerializedLexicalNode
>;


export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __maxWidth: number;
    __showCaption: boolean;
    __caption: LexicalEditor;
    // Captions cannot yet be used within editor cells
    __captionsEnabled: boolean;

    constructor(src: string, altText: string, maxWidth: number, width?: 'inherit' | number, height?: 'inherit' | number, showCaption?: boolean, caption?: LexicalEditor, captionsEnabled?: boolean, key?: NodeKey,) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
        this.__showCaption = showCaption || false;
        this.__caption = caption || createEditor({ nodes: [], });
        this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
    }

    static getType(): string {
        return 'image';
    }
    getAltText(): string {
        return this.__altText;
    }
    getSrc(): string {
        return this.__src;
    }
    setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number,): void {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }
    setShowCaption(showCaption: boolean): void {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(node.__src, node.__altText, node.__maxWidth, node.__width, node.__height, node.__showCaption, node.__caption, node.__captionsEnabled, node.__key,);
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { altText, height, width, maxWidth, caption, src, showCaption } = serializedNode;
        const node = $createImageNode({ altText, height, maxWidth, showCaption, src, width, });
        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }

    exportJSON(): SerializedImageNode {
        return {
            altText: this.getAltText(),
            caption: this.__caption.toJSON(),
            height: this.__height === 'inherit' ? 0 : this.__height,
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            type: 'image',
            version: 1,
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span');
        const theme = config.theme;
        const className = theme.image;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }
    updateDOM(): false {
        return false;
    }
    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: $convertImageElement,
                priority: 0,
            }),
            // img: (node: Node) => ({
            //     conversion: $convertImageElement,
            //     priority: 0,
            // }),
        };
    }
    exportDOM(): DOMExportOutput {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }

    decorate(): JSX.Element {
        return (
            <>
                {/* <div>{`__src: ${this.__src}`}</div>
                <div>{`this.__altText: ${this.__altText}`}</div>
                <div>{`altText: ${this.__altText}`}</div>
                <div>{`this.__maxWidth: ${this.__maxWidth}`}</div>
                <div>{`this.__width: ${this.__width}`}</div>
                <div>{`this.__height: ${this.__height}`}</div>
                <div>{`this.getKey(): ${this.getKey()}`}</div>
                <div>{`this.__showCaption: ${this.__showCaption}`}</div>
                <div>{`this.__caption: ${this.__caption}`}</div>
                <div>{`this.__captionsEnabled: ${this.__captionsEnabled}`}</div> */}

                <Suspense fallback={<div>Loading...</div>}>
                    <ImageComponent
                        src={this.__src}
                        altText={this.__altText}
                        width={this.__width}
                        height={this.__height}
                        maxWidth={this.__maxWidth}
                        nodeKey={this.getKey()}
                        showCaption={this.__showCaption}
                        caption={this.__caption}
                        captionsEnabled={this.__captionsEnabled}
                        resizable={true}
                    />
                </Suspense>
            </>

            // <ResizableImage
            //     src={this.__src}
            //     altText={this.__altText}
            //     width={this.__width}
            //     height={this.__height}
            // />

            // <Suspense fallback={<div>Loading...</div>}>
            //     <ResizableImage
            //         src={this.__src}
            //         altText={this.__altText}
            //         width={this.__width}
            //         height={this.__height}
            //     />
            // </Suspense>
        );
    }
}


export function $createImageNode({ altText, height, maxWidth = 500, captionsEnabled, src, width, showCaption, caption, key, }: ImagePayload): ImageNode {
    return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, showCaption, caption, captionsEnabled, key,),);
}

export function $isImageNode(node: LexicalNode | null | undefined,): node is ImageNode {
    return node instanceof ImageNode;
}