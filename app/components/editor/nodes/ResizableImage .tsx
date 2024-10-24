import Image from 'next/image';
import { ResizableBox } from 'react-resizable';

const ResizableImage = ({ src, altText, width, height }: { src: string, altText: string, width: number | 'inherit', height: number | 'inherit' }) => {

    const defaultWidth = width === 'inherit' ? 300 : width;  // Default width if "inherit"
    const defaultHeight = height === 'inherit' ? 200 : height;  // Default height if "inherit"

    return (

        <ResizableBox
            width={typeof defaultWidth === 'number' ? defaultWidth : 300}
            height={typeof defaultHeight === 'number' ? defaultHeight : 200}
            lockAspectRatio
            resizeHandles={['se']}  // Handles resizing from the bottom-right corner
            minConstraints={[50, 50]}  // Minimum size
            maxConstraints={[1000, 1000]}  // Maximum size
        >
            <Image
                src={src}
                alt={altText}
                width={typeof defaultWidth === 'number' ? defaultWidth : 300}
                height={typeof defaultHeight === 'number' ? defaultHeight : 200}
                layout="responsive"  // Ensures responsive behavior
                objectFit="contain"  // Contains within bounds
                loading="lazy"
            />
        </ResizableBox>
    );
};

export default ResizableImage;
