import React from 'react'
import Image from 'next/image';

// const imageCache = new Set();

// export function useSuspenseImage(src: string) {
//     if (!imageCache.has(src)) {
//         throw new Promise((resolve) => {
//             const img = new Image();
//             img.src = src;
//             img.onload = () => {
//                 imageCache.add(src);
//                 resolve(null);
//             };
//             img.onerror = () => {
//                 imageCache.add(src);
//             };
//         });
//     }
// }

interface LazyImageProps {
    altText: string;
    className: string | null;
    height: 'inherit' | number;
    imageRef: { current: null | HTMLImageElement };
    maxWidth: number;
    src: string;
    width: 'inherit' | number;
    onError: () => void;
}

export default function LazyImage({ altText, className, imageRef, src, width, height, maxWidth, onError, }: LazyImageProps): JSX.Element {

    // useSuspenseImage(src);
    const defaultWidth = width === 'inherit' ? 300 : width;  // Default width if "inherit"
    const defaultHeight = height === 'inherit' ? 200 : height;  // Default height if "inherit"
    onError();
    return (<>
        <div>{`width: ${width}`}</div>
        <div>{`height: ${height}`}</div>
        <div>{`altText: ${altText}`}</div>
        <div>{`className: ${className}`}</div>
        <div>{`src: ${src}`}</div>
        <div>{`maxWidth: ${maxWidth}`}</div>
        <div>{`defaultWidth: ${defaultWidth}`}</div>
        <div>{`defaultHeight: ${defaultHeight}`}</div>


        <Image ref={imageRef}
            src={src}
            alt={altText}
            width={typeof defaultWidth === 'number' ? defaultWidth : 300}
            height={typeof defaultHeight === 'number' ? defaultHeight : 200}
            layout="responsive"
            objectFit="contain"
            loading="lazy"
            onError={onError}
        />
    </>
    );
}