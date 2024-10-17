'use client'
import React, { useState } from 'react'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import EditorTheme from './themes/editorTheme';
import LexicalToolbar from './plugins/lexicalToolbar';
import { toolbarData } from '../data/toolbarData';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import ReadOnlyPlugin from './plugins/readOnlyPlugin';
import { ListItemNode, ListNode, } from '@lexical/list';
import './styles.css'


const Editor = () => {
    const [isReadOnly, setIsReadOnly] = useState(false); 
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    console.log('isLinkEditMode',isLinkEditMode)

    const placeholder = '내용을 기술하세요...';

    const editorConfig = {
        namespace: 'React.js Lexical',
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
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
                    {!isReadOnly && <LexicalToolbar lexicalToolbarData={toolbarData} isReadOnly={isReadOnly} setIsLinkEditMode={setIsLinkEditMode} />}        
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
                        <ListPlugin />
                        <CheckListPlugin />
                        <ReadOnlyPlugin isReadOnly={isReadOnly} /> 
                    </div>
                </div>
            </LexicalComposer>
        </div>
       
    );
}

export default Editor