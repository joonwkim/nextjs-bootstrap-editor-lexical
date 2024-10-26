import { DecoratorNode,  } from 'lexical';
import ResizableImage from './ResizableImage ';

type SerializedCustomImageNode = {
    src: string;
    altText: string;
    width: number;
    height: number;
    type: 'image';
    version: 1;
};

export class CustomImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: number;
    __height: number;

    constructor(src: string, altText: string, width: number, height: number, key?: string) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width;
        this.__height = height;
    }

    static getType(): string {
        return 'image';
    }

    static clone(node: CustomImageNode): CustomImageNode {
        return new CustomImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
    }

    exportJSON(): SerializedCustomImageNode {
        return {
            src: this.__src,
            altText: this.__altText,
            width: this.__width,
            height: this.__height,
            type: 'image',
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedCustomImageNode): CustomImageNode {
        const { src, altText, width,height } = serializedNode;
        return new CustomImageNode(src, altText,width,height);
    }

    createDOM(): HTMLElement {
        const dom = document.createElement('div');
        // dom.style.display = 'inline-block';
        // dom.contentEditable = 'false';
        return dom;
    }
    // createDOM(config: EditorConfig): HTMLElement {
    //     const span = document.createElement('span');  
    //     const theme = config.theme;
    //     const className = theme.image;
    //     if (className !== undefined) {
    //         span.className = className;
    //     }
    //     return dom;
    // }

    updateDOM(): boolean {
        return false;
    }

   
    // Render the Next.js Image component inside the decorate() method
    decorate(): JSX.Element {
       
      

        // Return the JSX element with the attributes here
        return (
            // <Image
            //     src={this.__src} // Use the src and altText inside the decorate method
            //     alt={this.__altText}
            //     width={500}
            //     height={this.__height}
            //     style={{ cursor: 'pointer' }}
            //     unoptimized={true} // Disable optimization, allow any image source
            // //layout="responsive" // for Next.js's optimized layout
            // />
            (<ResizableImage
                src={this.__src}
                altText={this.__altText}
                width={this.__width}
                height={this.__height}
            />)
        );
    }
}

// export default CustomImageNode;

export function $createCustomImageNode(src: string, altText:string, width: number, height: number): CustomImageNode {
    return new CustomImageNode(src,altText, width, height);
}
