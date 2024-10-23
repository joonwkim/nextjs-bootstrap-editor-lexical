import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createNodeSelection, $getRoot, $getSelection, $insertNodes, $setSelection } from 'lexical';
import React, { useState } from 'react'
import CustomImageNode from '../nodes/CustomImageNode';


const InsertImageFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [altText, setAltText] = useState<string>('');
    const [fileError, setFileError] = useState<string>('');
    const [editor] = useLexicalComposerContext();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            // Check file size (1 MB = 1 * 1024 * 1024 bytes)
            if (selectedFile.size > 1 * 1024 * 1024) {
                setFileError('File size must be 1 MB or less.');
                setFile(null); // Reset file state
            } else {
                setFileError(''); // Clear any previous error
                setFile(selectedFile);
            }

        }
    };

    const handleAltTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAltText(event.target.value);
    };



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle file upload and alt text submission here
        if (file) {
            const src = URL.createObjectURL(file);
            editor.update(() => {
                const imageNode = new CustomImageNode(src, altText);

                // Insert the image node into the editor's root or at the current selection point
                const selection = $getSelection();
                if (selection) {
                    $insertNodes([imageNode]);

                    // Select the new node
                    const nodeSelection = $createNodeSelection();
                    nodeSelection.add(imageNode.getKey());
                    $setSelection(nodeSelection);
                } else {
                    // If no selection, append it to the root
                    const root = $getRoot();
                    root.append(imageNode);
                }
            });
        }

        setFile(null)
        setAltText('');
    };


    const isButtonDisabled = !file || !altText;

    return (
        <div className="modal fade" id="insertImageFileModal" aria-hidden="true" aria-labelledby="insertImageUrlTitle" data-bs-backdrop="static" data-bs-target="#staticBackdrop" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="insertImageUrlTitle">그림파일 삽입</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container mt-5">
                            <form onSubmit={handleSubmit} id='insertImageFileForm'>
                                <div className="mb-3 d-flex">
                                    <label htmlFor="url" className="form-label mt-1 col-3">파일 올리기: </label>
                                    <div className='col-9'>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="fileInput"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        {fileError && <div className="text-danger mt-2">{fileError}</div>}
                                    </div>
                                </div>
                                <div className="mb-3 d-flex">
                                    <label htmlFor="referrer" className="form-label mt-1 col-3">이미지 설명: </label>
                                    <div className='col-9'>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="altTextInput"
                                            value={altText}
                                            placeholder='그림 설명'
                                            onChange={handleAltTextChange}
                                            required
                                        />
                                        <div className="form-text ms-2">그림 설명을 입력하세요.</div>
                                    </div>

                                </div>
                            </form>
                        </div>

                    </div>
                    <div className='modal-footer'>
                        <div className='me-5'>
                            <button type="submit" className="btn btn-outline-secondary border-0" form='insertImageFileForm' data-bs-dismiss="modal" disabled={isButtonDisabled} >확인</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default InsertImageFile