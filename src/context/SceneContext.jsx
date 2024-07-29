import React, { useState, useContext, useEffect, useMemo } from 'react'
import { returnArrayOfGeometries, loadPublicGLTFFile } from '../utils/fileLoader'
import { addToScene, returnScene, returnCurrentIntersect, highlight } from '../script'
const SceneContext = React.createContext()

export function useScene() {
  return useContext(SceneContext)
}

export function SceneProvider({ children }) {
  const [models, setModels] = useState([])
  const [scene, setScene] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [commentMode, setCommentMode] = useState(false)

  const sceneCopy = useMemo(() => {
    return { ...scene };
  }, [scene])

  const values = { handleFile, loadExampleModel, models, setModels, sceneCopy, setScene, selectedNode, changeSelectedNode, setCommentMode, commentMode }

  async function handleFile(e) {
    let newModels = await returnArrayOfGeometries(e)
    setModels((prevModels) => [...newModels, ...prevModels])
  }

  useEffect(() => {
    const handleMouseUp = (event) => {
      if (event.target.closest('div')) {
        return;
      }
      if (returnCurrentIntersect() && returnCurrentIntersect().isTransformControls) return;
      if (returnCurrentIntersect()) {
        let node = returnCurrentIntersect()
        changeSelectedNode(node)
      } else {
        changeSelectedNode(null)
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [changeSelectedNode]);

  async function loadExampleModel() {
    try {
      let newModels = await loadPublicGLTFFile('gameboy.glb');
      setModels((prevModels) => [...newModels, ...prevModels])
    } catch (error) {
      console.error('Error loading GLTF model:', error);
    }
  }

  function changeSelectedNode(node) {
    console.log("@changeSelectedNode commentMode:", commentMode)
    if (!commentMode) {
      console.log("not working")
      setSelectedNode(node)
    } else {
      console.log("commentMode is true, selection change not allowed")
    }
  }


  useEffect(() => {
    for (const model of models) {
      console.log("checking at ui", model)
      if (!model.inScene) addToScene(model)
      model.inScene = true
    }
    if (models.length > 0) setScene(returnScene())
  }, [models])

  useEffect(() => {
    console.log("new scene: ", scene)
  }, [scene])

  useEffect(() => {
    if (selectedNode) highlight(selectedNode)
    if (!selectedNode) highlight(null)
  }, [selectedNode])

  return (
    <SceneContext.Provider value={values}>
      {children}
    </SceneContext.Provider>
  )
}
