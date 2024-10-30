import React from 'react'

const InsertYouTubeVideoModal = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event);
    };
    return (<div className="modal fade" id="insertYouTubeVideoModal" aria-hidden="true" aria-labelledby="insertInlineImageModalToggleLabel" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-4" id="insertInlineImageModalToggleLabel">유튜브 비디오 삽입</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body my-3">
                    <div className="container mt-5">
                        <form onSubmit={handleSubmit} id='insertImageFileForm'>
                            <div className="mb-3 d-flex">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className='modal-footer'>
            <div className='me-5'>
                <button type="submit" className="btn btn-outline-secondary border-0" form='insertYouTubeVideoModal' data-bs-dismiss="modal" >확인</button>
            </div>
        </div>
    </div>

    )
}
export default InsertYouTubeVideoModal