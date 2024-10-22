import React, { useEffect, useRef } from 'react';

interface ParentModalProps {
    closeParent: () => void;
    openGrandChild: () => void;
}

const ParentModal: React.FC<ParentModalProps> = ({ closeParent, openGrandChild }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (modalRef.current) {
            import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
                const modal = new window.bootstrap.Modal(modalRef.current!);
                modal.show();
            });
        }
    }, []);
    return (
        <div ref={modalRef} className="modal fade" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Parent Modal</h5>
                        <button type="button" className="btn-close" onClick={closeParent}>x</button>
                    </div>
                    <div className="modal-body">
                        <p>This is the Parent Modal content.</p>
                        <button className="btn btn-primary" onClick={openGrandChild}>
                            Open Grandchild Modal 1
                        </button>
                        <button className="btn btn-success" onClick={openGrandChild}>
                            Open Grandchild Modal 2
                        </button>
                        <button className="btn btn-warning" onClick={openGrandChild}>
                            Open Grandchild Modal 3
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentModal;
