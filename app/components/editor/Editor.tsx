'use client'
import React, { useState } from 'react'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import './styles.css'

import EditorTheme from './themes/editorTheme';
import LexicalToolbar from './plugins/lexicalToolbar';
import { toolbarData } from '../data/toolbarData';
import { HeadingNode } from '@lexical/rich-text';
import ReadOnlyPlugin from './plugins/readOnlyPlugin';


const Editor = () => {
    const [isReadOnly, setIsReadOnly] = useState(false); 
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    console.log('isLinkEditMode',isLinkEditMode)

    const placeholder = '내용을 기술하세요...';

    const editorConfig = {
        namespace: 'React.js Lexical',
        nodes: [HeadingNode],
        editorState:null,
        onError(error: Error) {
            console.log('error: ', error)
            throw error;
        },
        theme: EditorTheme,
    };

    const toggleEditMode = () => {
        setIsReadOnly((prev) => !prev);
    };

    return (
        <div>
            
            <button onClick={toggleEditMode}>
                {isReadOnly ? 'Switch to Edit Mode' : 'Switch to Read-Only'}
            </button>
            <LexicalComposer initialConfig={editorConfig}>
                <div className="container">

                    {/* Conditionally render the toolbar based on read-only state */}
                    {!isReadOnly && <LexicalToolbar lexicalToolbarData={toolbarData} isReadOnly={isReadOnly} setIsLinkEditMode={setIsLinkEditMode} />}  {/* Only show toolbar in edit mode */}                    
                    <div>
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="editor-input"
                                    aria-placeholder={placeholder}
                                    placeholder={
                                        <div className="editor-placeholder">{placeholder}</div>
                                    }
                                />
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ReadOnlyPlugin isReadOnly={isReadOnly} /> {/* Plugin to toggle read-only */}
                    </div>
                </div>
            </LexicalComposer>
        </div>
       
    );
}

export default Editor