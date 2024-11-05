import React, { useState } from 'react'

const InsertTableModal = () => {
    const [tableRow, setTableRow] = useState<number>(5);
    const [tableColumn, setTableColumn] = useState<number>(5);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log(event);
    };
    const isButtonDisabled = tableRow === 0 || tableColumn === 0;
    return (<div className="modal fade" id="insertTableModal" aria-hidden="true" aria-labelledby="insertinsertTableModalToggleLabel" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-4" id="insertinsertTableModalToggleLabel">테이블 삽입</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="container">
                        <form onSubmit={handleSubmit} id='insertImageFileForm'>
                            <div className="mb-3 d-flex">
                                <label htmlFor="tableRow" className="form-label mt-1 col-3">열(Row): </label>
                                <div className='col-9'>
                                    <input
                                        id="tableRow"
                                        type="number"
                                        className="form-control"
                                        value={tableRow}
                                        placeholder=' '
                                        onChange={(e) => setTableRow(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex">
                                <label htmlFor="tableColumn" className="form-label mt-1 col-3">행(Column): </label>
                                <div className='col-9'>
                                    <input
                                        id="tableColumn"
                                        type="number"
                                        className="form-control"
                                        value={tableColumn}
                                        placeholder=' '
                                        onChange={(e) => setTableColumn(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='modal-footer'>
                    <div className='me-5'>
                        <button type="submit" className="btn btn-outline-secondary border-0" disabled={isButtonDisabled} form='insertImageFileForm' data-bs-dismiss="modal" >확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    )
}
export default InsertTableModal