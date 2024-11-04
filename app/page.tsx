'use client'
import Editor from "./components/editor/Editor";
import './globals.css'
import image from '@/public/images/image.webp'
import mountains from '@/public/images/mountains.jpg'
import Image from 'next/image';



export default function Home() {

  return (
    <div className="container">

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