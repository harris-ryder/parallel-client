import { useState } from 'react';
import { SceneProvider } from './context/SceneContext';
import { Modal } from './components/Modal';
import { SceneTree } from './components/SceneTree';
import { Editor } from './components/Editor'
import './styles/style.scss'

function App() {
  return (
    <>
      <SceneProvider>
        <Modal />
        <Editor />
      </SceneProvider>
    </>
  );
}

export default App;

