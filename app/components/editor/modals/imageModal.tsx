'use client'

import InsertImageFile from "./insertImageFile";
import InsertImageModal from "./insertImageModal";
import InsertImageUrl from "./insertImageUrl";
import InsertSampleImage from "./insertSampleImage";

const ImageModal = () => {

    return (
        <div>
            <button className="btn btn-outline-light border-0 mb-3" data-bs-target="#insertImageModal" data-bs-toggle="modal">그림 삽입</button>
            <InsertImageModal />
            {/* <InsertSampleImage /> */}
            <InsertImageUrl />
            <InsertImageFile />

        </div>
    );
};

export default ImageModal;
