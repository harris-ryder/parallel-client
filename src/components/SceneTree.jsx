import { useRef, useEffect, Suspense, useState, useContext } from 'react';
import { useScene } from '../context/SceneContext';
import { TreeNode } from './TreeNode';
import { TreeNodeSetting } from './TreeNodeSetting';

export function SceneTree() {
  const { handleFile, loadExampleModel, models, sceneCopy } = useScene();
  return (
    <>
      <h3 className='panel-header scene-header'>Scene</h3>
      <div className='scene-tree-drag'>      <div className='scene-tree'>
        <div className='scene-tree-scroll'>
          <div className='scene-tree-names'>
            {sceneCopy && Array.isArray(sceneCopy.children) && sceneCopy.children.map((node, index) => {
              if (node.isMesh) {
                return <div className='tree-mesh'>node.name</div>;
              } else if (node.type === "Group" || node.type === "Object3D") {
                return <TreeNode scene={node} />
              }
            })}
          </div>

          <div className='scene-tree-settings'>

            {sceneCopy && Array.isArray(sceneCopy.children) && sceneCopy.children.map((node, index) => {
              if (node.isMesh) {
                return <div className='vis-btn'>node.name</div>;
              } else if (node.type === "Group" || node.type === "Object3D") {
                return <TreeNodeSetting scene={node} />
              }
            })}
          </div>
        </div>
      </div>

      </div>
    </>
  );
}
