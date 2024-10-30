import React from 'react'
import { InsertImagePayload } from '../plugins/ToolbarPlugin org'
import InsertImageUrlModal from './InsertImageUrlModal'
import InsertImageFileModal from './InsertImageFileModal'

const InsertImageModal = ({ onClick }: { onClick: (payload: InsertImagePayload) => void, }) => {

    return (<>
        <div className="modal fade" id="insertImageModal" aria-hidden="true" aria-labelledby="insertImageModalToggleLabel" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-4" id="insertImageModalToggleLabel">이미지 삽입</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body my-3">
                        <div className="row g-3">
                            {/* <button className="btn btn-outline-secondary border-0" data-bs-target="#" data-bs-toggle="modal">샘플이미지 삽입</button> */}
                            <button className="btn btn-outline-secondary border-0" data-bs-target="#insertImageUrlModal" data-bs-toggle="modal">URL 입력</button>
                            <button className="btn btn-outline-secondary border-0" data-bs-target="#insertImageFileModal" data-bs-toggle="modal">파일 입력</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <InsertSampleImage /> */}
        <InsertImageUrlModal onClick={onClick} />
        <InsertImageFileModal onClick={onClick} />
    </>

    )
}
export default InsertImageModal