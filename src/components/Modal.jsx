import { useRef, useEffect, Suspense, useState, useContext } from 'react';
import { useScene } from '../context/SceneContext';

export function Modal(props) {


  const fileInput = useRef(null)
  const modalRef = useRef(null)
  const { handleFile, loadExampleModel } = useScene()

  async function fileUpload(e) {
    handleFile(e)
    modalRef.current.style.display = "none"
  }

  async function loadExample() {
    loadExampleModel()
    modalRef.current.style.display = "none"
  }


  return (
    <div className='modal' ref={modalRef}>

      <input
        type='file'
        ref={fileInput}
        onChange={fileUpload}
        style={{ display: 'none' }}
        multiple={true}
      />

      <button
        className='upload-btn'
        onClick={() => fileInput.current.click()}
      >Upload Models</button>


      <p>or try <a onClick={loadExample} >example</a></p>
    </div>
  );
}
