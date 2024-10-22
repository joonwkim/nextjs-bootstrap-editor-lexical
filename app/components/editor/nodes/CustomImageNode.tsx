import { DecoratorNode, EditorConfig } from 'lexical';
import Image from 'next/image';

type SerializedCustomImageNode = {
    src: string;
    altText: string;
    type: 'image';
    version: 1;
};

class CustomImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;

    constructor(src: string, altText: string) {
        super();
        this.__src = src;
        this.__altText = altText;
    }

    static getType(): string {
        return 'image';
    }

    static clone(node: CustomImageNode): CustomImageNode {
        return new CustomImageNode(node.__src, node.__altText);
    }

    exportJSON(): SerializedCustomImageNode {
        return {
            src: this.__src,
            altText: this.__altText,
            type: 'image',
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedCustomImageNode): CustomImageNode {
        const { src, altText } = serializedNode;
        return new CustomImageNode(src, altText);
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

    updateDOM(): boolean {
        return false;
    }

    // Render the Next.js Image component inside the decorate() method
    decorate(): JSX.Element {
        // Return the JSX element with the attributes here
        return (
            <Image
                src={this.__src} // Use the src and altText inside the decorate method
                alt={this.__altText}
                width={500}
                height={300}
                unoptimized={true} // Disable optimization, allow any image source
            //layout="responsive" // for Next.js's optimized layout
            />
        );
    }
}

export default CustomImageNode;
