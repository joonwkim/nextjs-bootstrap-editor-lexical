'use client'
import Editor from "./components/editor/Editor";
import './globals.css'
import image from '@/public/images/image.webp'
import mountains from '@/public/images/mountains.jpg'
import Image from 'next/image';
import StyleComponent from "./components/temp/StyleComponent";

export interface MyData {
  height: number;
  left: number;
  top: number;
  width: number;
}


export default function Home() {


  // const handleClick = () => {
  //   const root = document.documentElement;
  //   root.style.setProperty('--table-resizer-background', 'blue')
  // }

  return (
    <div className="container">
      {/* <StyleComponent /> */}
      {/* <button onClick={handleClick}>Test</button>
      <div className="test" ></div> */}

      {/* <div className="test"></div> */}
      {/* <div className="container">
        <h1>Toolbar Component</h1>
        <Toolbar />
      </div>
      <TypingAnimation /> */}


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

      {/* <div>
        <Image
          alt="altText"
          src={image}
          fill
          width={100}
          height={30}
        />
      </div> */}

      <Editor />

    </div>
  );
}