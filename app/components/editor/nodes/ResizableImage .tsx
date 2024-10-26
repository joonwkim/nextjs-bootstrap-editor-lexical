import Image from 'next/image';
import { ResizableBox } from 'react-resizable';

const ResizableImage = ({ src, altText, width, height }: { src: string, altText: string, width: number | 'inherit', height: number | 'inherit' }) => {

    const defaultWidth = width === 'inherit' ? 300 : width;  // Default width if "inherit"
    const defaultHeight = height === 'inherit' ? 200 : height;  // Default height if "inherit"

    return (

        <ResizableBox lockAspectRatio resizeHandles={['se']} minConstraints={[50, 50]}>
            <Image
                src={src}
                alt={altText}
                width={typeof defaultWidth === 'number' ? defaultWidth : 300}
                height={typeof defaultHeight === 'number' ? defaultHeight : 200}
                layout="responsive"
                objectFit="contain"  
                loading="lazy"
                unoptimized={true}
            />

        </ResizableBox>
    );
};

export default ResizableImage;
