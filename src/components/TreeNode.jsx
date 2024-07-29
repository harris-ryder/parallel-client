import React from 'react';
import { useScene } from '../context/SceneContext';
import { highlight } from '../script.js'

export function TreeNode({ scene }) {
  const { setModels, sceneCopy, setScene, changeSelectedNode, selectedNode } = useScene();

  function toggleVisible(node) {
    changeSelectedNode(node)

  }

  //<h3 className={scene === selectedNode ? "active-node" : ""} onClick={() => toggleVisible(scene)}>{scene.name || 'Group'} </h3>
  // <h3>{name || 'Group'}</h3>
  return (
    <div className={`tree-node ${scene === selectedNode ? "active-node" : ""}`}
    >

      <h3 className={scene === selectedNode ? "active-node" : ""} onClick={() => toggleVisible(scene)}>{scene.name || 'Group'}</h3>

      {Array.isArray(scene.children) && scene.children.map((node, index) => {
        if (node.isMesh) {
          return (
            <div
              key={index}
              onClick={() => toggleVisible(node)}
              className={`tree-mesh ${node === selectedNode ? "active-node" : ""}`}
            >
              {node.name === "" ? "no_name" : node.name}
            </div>
          );
        } else if (node.type === "Group" || node.type === "Object3D") {
          return (
            <TreeNode
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
