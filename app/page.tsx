'use client'
// import { TypingAnimation } from "./components/animation/typing";
// import Toolbar from "./components/dropdownControl/toolbar";
// import Toolbar from "./components/dropdownControl/toolbar";
// import { ToolbarItem } from "./components/dropdownControl/types/toolbar";
import Editor from "./components/editor/Editor";
import './globals.css'



export default function Home() {

  return (
    <div className="container">
      {/* <div className="container">
        <h1>Toolbar Component</h1>
        <Toolbar />
      </div>
      <TypingAnimation /> */}

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