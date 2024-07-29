import React from 'react';
import { useScene } from '../context/SceneContext';

export function TreeNodeSetting({ scene, name }) {
  const { setModels, sceneCopy, setScene } = useScene();

  function toggleVisible(node) {
    node.visible = !node.visible;  // Toggle visibility
    setScene(sceneCopy)
  }

  return (
    <div className='tree-setting'>
      <div onClick={() => toggleVisible(scene)} className={`vis-btn ${!scene.visible ? 'hide' : ''}`}></div>
      {Array.isArray(scene.children) && scene.children.map((node, index) => {

        if (node.isMesh) {
          return (
            <div
              key={index}
              onClick={() => toggleVisible(node)}
              className={`vis-btn ${!node.visible ? 'hide' : ''}`}
            >
            </div>
          );
        } else if (node.type === "Group" || node.type === "Object3D") {
          return (
            <TreeNodeSetting
              key={index}
              scene={node}
            />
          );
        } else {
          return null;  // Handle other types if necessary
        }
      })}
    </div>
  );
}
