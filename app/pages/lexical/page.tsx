import React from 'react'

const LexicalPage = () => {
    return (
        <div>
            <div aria-placeholder="내용을 기술하세요..." className="editor-input" data-lexical-editor="true" role="textbox" title='lexical editor'>
                <h1 className="editor-heading-h1 ltr" dir="ltr">
                    <span data-lexical-text="true">h1 건강한 민주주의 네트워크</span>
                </h1>
                <h2 className="editor-heading-h2 ltr" dir="ltr">
                    <span data-lexical-text="true">h2 공지사항 </span>
                </h2>
                <h3 className="editor-heading-h3 ltr" dir="ltr">
                    <span data-lexical-text="true">h3 소제목</span>
                </h3>
                <p className="editor-paragraph">
                    <br />
                </p>
                <p className="editor-paragraph ltr" dir="ltr">
                    <span data-lexical-text="true">글머리 기호</span>
                </p>
                <p className="editor-paragraph ltr" dir="ltr">
                    <span data-lexical-text="true">글머리 번호</span>
                </p>
                <p className="editor-paragraph ltr" dir="ltr">
                    <span data-lexical-text="true">글머리 체크</span>
                </p>
                <p className="editor-paragraph">
                    <br />
                </p>
                <p className="editor-paragraph">
                    <br />
                </p>
            </div>
            <div className="editor-scroller">
                <div className="editor">
                    <div aria-placeholder="Enter some rich text..." className="ContentEditable__root" role="textbox" data-lexical-editor="true" title='lexical'>
                        <h1 className="PlaygroundEditorTheme__h1 PlaygroundEditorTheme__ltr" dir="ltr">
                            <span data-lexical-text="true">h1 건강한 민주주의 네트워크</span>
                        </h1>
                        <h2 className="PlaygroundEditorTheme__h2 PlaygroundEditorTheme__ltr" dir="ltr">
                            <span data-lexical-text="true">h2 공지사항</span>
                        </h2>
                        <h3 className="PlaygroundEditorTheme__h3 PlaygroundEditorTheme__ltr" dir="ltr">
                            <span data-lexical-text="true">h3 소제목</span>
                        </h3>
                        <ul className="PlaygroundEditorTheme__ul">
                            <li value="1" className="PlaygroundEditorTheme__listItem PlaygroundEditorTheme__ltr" dir="ltr">
                                <span data-lexical-text="true">글머리 기호</span>
                            </li>
                        </ul>
                        <p className="PlaygroundEditorTheme__paragraph">
                            <br />
                        </p>
                        <ol className="PlaygroundEditorTheme__ol1">
                            <li value="1" className="PlaygroundEditorTheme__listItem PlaygroundEditorTheme__ltr" dir="ltr">
                                <span data-lexical-text="true">글머리 번호</span>
                            </li>
                        </ol>
                        <p className="PlaygroundEditorTheme__paragraph">
                            <br />
                        </p>
                        {/* <ul className="PlaygroundEditorTheme__ul editor__checklist">
                            <li role="checkbox" aria-checked="false" value="1" className="PlaygroundEditorTheme__listItem PlaygroundEditorTheme__listItemUnchecked PlaygroundEditorTheme__ltr" dir="ltr">
                                <span data-lexical-text="true">글머리 체크</span>
                            </li>
                        </ul> */}
                        <p className="PlaygroundEditorTheme__paragraph">
                            <br /></p>
                        <blockquote className="PlaygroundEditorTheme__quote PlaygroundEditorTheme__ltr" dir="ltr">
                            <span data-lexical-text="true">인용기호</span></blockquote><p className="PlaygroundEditorTheme__paragraph">
                            <br />
                        </p>
                    </div>
                    <div draggable="true">
                        <div className="icon draggable-block-menu">
                            <div className="icon">
                            </div>
                        </div>
                    </div>
                    <div className="draggable-block-target-line">
                    </div>
                    <div className="link-editor">
                    </div>
                    <div className="table-cell-action-button-container">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LexicalPage