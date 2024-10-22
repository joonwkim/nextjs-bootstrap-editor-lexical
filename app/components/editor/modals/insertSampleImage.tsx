import React from 'react'

const InsertSampleImage = () => {
    return (
        <div className="modal fade" id="exampleModalToggle1" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Modal 1</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Hide this modal and show the first with the button below.
                    </div>

                </div>
            </div>
        </div>
    )
}

export default InsertSampleImage