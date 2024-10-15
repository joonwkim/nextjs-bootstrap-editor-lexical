'use client'
import { TypingAnimation } from "./components/animation/typing";
// import Toolbar from "./components/dropdownControl/toolbar";
// import { ToolbarItem } from "./components/dropdownControl/types/toolbar";
import Editor from "./components/editor/Editor";
import './globals.css'

// const toolbarItems: ToolbarItem[] = [
//   { id: 1, name: 'Bold', active: true, dropdowns: [{ id: 1, label: 'Option 1', active: null }] },
//   { id: 2, name: 'Italic', active: false, dropdowns: [{ id: 2, label: 'Option A', active: null }] },
//   { id: 3, name: 'Underline', active: true, dropdowns: [{ id: 3, label: 'Option X', active: null }] },
// ];

export default function Home() {

  return (
    <div className="container">
      {/* <div className="container">
        <h1>Toolbar Component</h1>
        <Toolbar items={toolbarItems} />
      </div> */}
      <TypingAnimation />

      <Editor />
      {/* <LexicalEditor /> */}

      {/* <Basic /> */}
     
      {/* <div className="toolbar">
        <button type="button" className="btn btn-outline-light" disabled>
          Disabled Button
        </button>
        <button type="button" className="btn btn-outline-light" >
        Not  Disabled Button
        </button>
      </div>

      <ParentComponent /> */}

    
    </div>
  );
}