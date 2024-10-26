import React from 'react'
import Image from 'next/image';
interface LazyImageProps {
    altText: string;
    className: string | null;
    imageRef: { current: null | HTMLImageElement };
    maxWidth: number;
    src: string;
    onError: () => void;
}

export default function LazyImage({ altText, className, imageRef, src, maxWidth, onError }: LazyImageProps): JSX.Element {

    return (<>
        <Image
            className={className || undefined}
            ref={imageRef}
            src={src}
            alt={altText}
            style={{ maxWidth: maxWidth, height: 'auto', width: '100%' }}
            width={maxWidth}
            height={0}
            loading="lazy"
            onError={onError}
            draggable="false"
        />
    </>
    );
}