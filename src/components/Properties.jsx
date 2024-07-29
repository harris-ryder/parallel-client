import React, { useState, useEffect, useMemo } from 'react'
import { useScene } from '../context/SceneContext';
import * as THREE from 'three';

export function Properties() {


  const { selectedNode, commentMode } = useScene();
  const [color, setColor] = useState('#7b1288');
  const [sliderValue, setSliderValue] = useState(1)


  function handleSliderValue(e) {
    if (!commentMode) setSliderValue(e.target.value)
    if (selectedNode && !commentMode) selectedNode.scale.set(e.target.value, e.target.value, e.target.value)
  }

  useEffect(() => {
    if (selectedNode) setSliderValue(selectedNode.scale.x)
  }, [selectedNode])

  useEffect(() => {
    if (selectedNode && selectedNode.isMesh && !commentMode) selectedNode.material.color.set(color)
  }, [color])

  const nodePos = useMemo(() => {
    if (selectedNode) {
      console.log("in memeo: ", selectedNode)

      function cleanNumber(num) {
        let roundedNum = Math.round(num * 10) / 10
        if (roundedNum.toString().length > 4) return Math.floor(roundedNum)
        return roundedNum
      }

      return {
        x: cleanNumber(selectedNode.position.x),
        y: cleanNumber(selectedNode.position.y),
        z: cleanNumber(selectedNode.position.z),
      };
    }
    return { x: 0, y: 0, z: 0 };
  }, [selectedNode]);


  return (
    <>
      <h3 className='panel-header properties-header'>Properties</h3>
      <div className='properties-drag'>
        <div className='properties' >

          <div className='color-selector'>
            <select className='color-dropdown'>
              <option>MeshStandardMaterial</option>
            </select>
            <input type="color" value={color} id="color-picker" onChange={e => setColor(e.target.value)} />
          </div>

          <div className='position-selector'>
            <p>Position</p>
            <div className='pos-val pos-x'><p>x:</p><p>{nodePos.x}</p></div>
            <div className='pos-val pos-y'><p>y:</p><p>{nodePos.y}</p></div>
            <div className='pos-val pos-z'><p>z:</p><p>{nodePos.z}</p></div>

          </div>

          <div className='scale-selector'>
            <p>Scale</p>
            <input type="range" min="0" max="5" step="0.01" className="scale-slider" value={sliderValue} onChange={handleSliderValue} />
            <div className='pos-val scale-val'><p>{Math.round(sliderValue * 1000) / 1000}</p></div>
          </div>

        </div>
      </div>
    </>

  )
}

