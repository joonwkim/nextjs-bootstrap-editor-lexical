import React, { useState } from 'react'
import { Layouts } from '../../data/toolbarData';

const InsertColumnsLayoutModal = ({ onClick }: { onClick: (payload: { value: string }) => void, }) => {
    const [selectedValue, setSelectedValue] = useState<string>('1fr 1fr')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // alert(selected);
        onClick({ value: selectedValue })
    };

    const onChange = (value: string) => {
        setSelectedValue(value)
    }

    return (<div className="modal fade" id="insertColumnsLayoutModal" aria-hidden="true" aria-labelledby="insertColumnLayoutModalToggleLabel" data-bs-backdrop="static" data-bs-target="#staticBackdrop" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-4" id="insertColumnLayoutModalToggleLabel">컬럼 레이아웃 삽입</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="container">
                        <form onSubmit={handleSubmit} id='insertColumnLayoutForm'>
                            <div className="mb-3 d-flex">
                                <select className="form-select" id="layoutSelect" value={selectedValue} onChange={(e) => onChange(e.target.value)}>
                                    {Layouts.map((layout) => (
                                        <option key={layout.value} value={layout.value}>
                                            {layout.label}
                                        </option>
                                    ))}
                                </select>
                                {/* <select id='positionSelect' className="form-select" aria-label="Insert Columns Layout" value={selected} onChange={(e) => setSelected(e.target.value)}>
                                    <option value="1">2 컬럼(동일한 폭)</option>
                                    <option value="2"></option>
                                    <option value="3"></option>
                                    <option value="4"></option>
                                    <option value="5"></option>
                                    <option value="6">4 컬럼(20% - 40% - 20% - 20%)</option>
                                </select> */}
                            </div>
                        </form>
                    </div>
                </div>
                <div className='modal-footer'>
                    <div className='me-5'>
                        <button type="submit" className="btn btn-outline-secondary border-0" form='insertColumnLayoutForm' data-bs-dismiss="modal" >확인</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    )
}
export default InsertColumnsLayoutModal