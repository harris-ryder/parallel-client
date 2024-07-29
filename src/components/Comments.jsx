import React, { useState, useEffect } from 'react'
import { useScene } from '../context/SceneContext';
import * as utils from '../threeUtils.js';
import { disableControlTransform, checkIntersectsAndPaint, activeControlTransform } from '../script.js';
import { Comment } from './Comment';

const MySVG = () => (
  <svg
    style={{ enableBackground: 'new 0 0 48 48' }}
    width="24" // Added width
    height="24" // Added height
    version="1.1"
    viewBox="0 0 48 48"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g id="Padding__x26__Artboard" />
    <g id="Icons">
      <g>
        <path
          d="M35.08842,12.56618c-0.53369,0.01221-1.05469,0.20508-1.44336,0.58789 c-0.38916,0.38379-0.60547,0.89551-0.60889,1.44092c-0.00684,1.16748,0.88672,2.08838,2.03418,2.09619 c0.00439,0,0.00879,0,0.01367,0c1.09131,0,2.03418-0.92432,2.06201-2.0249c0.01318-0.52588-0.20117-1.05615-0.58789-1.45508 C36.16508,12.80495,35.62894,12.57009,35.08842,12.56618z"
          style={{ fill: 'none' }}
        />
        <path
          d="M39.31351,12.53493l-0.05566-0.13232c-0.00781-0.01758-0.01758-0.03418-0.02832-0.0498 c-0.46484-1.02246-1.32959-1.76611-2.38184-2.04541c-1.70654-0.45215-3.29932-0.33447-4.73486,0.35303 c-1.97656,0.94629-3.44385,2.48633-4.61865,3.86816c-2.38086,2.80029-4.4751,6.09326-6.79053,10.67578 c-0.25977,0.51367,0.06006,0.83008,0.21191,0.97998c0.87109,0.85986,1.74219,1.72021,2.59375,2.6001 c0.19531,0.20166,0.39502,0.30078,0.61719,0.30078c0.14746,0,0.3042-0.04395,0.47607-0.13037 c2.73291-1.37646,5.07617-2.73682,7.16406-4.15869c1.94531-1.32422,3.97852-2.82275,5.67188-4.80371 c0.67871-0.79395,1.15674-1.47656,1.49805-2.13672c0.01611-0.02539,0.03418-0.06348,0.04443-0.09424 c0.01367-0.02686,0.02539-0.0498,0.03125-0.06104c0.07812-0.1582,0.15039-0.31543,0.21338-0.47119l0.05029-0.13721 c0.06641-0.17676,0.12451-0.34961,0.18555-0.56348C40.00932,14.57253,39.49027,12.9861,39.31351,12.53493z M35.08402,16.69118 c-0.00488,0-0.00928,0-0.01367,0c-1.14746-0.00781-2.04102-0.92871-2.03418-2.09619 c0.00342-0.54541,0.21973-1.05713,0.60889-1.44092c0.38867-0.38281,0.90967-0.57568,1.44336-0.58789 c0.54053,0.00391,1.07666,0.23877,1.46973,0.64502c0.38672,0.39893,0.60107,0.9292,0.58789,1.45508 C37.1182,15.76686,36.17533,16.69118,35.08402,16.69118z"
          style={{ fill: '#007bff' }}
        />
        <path
          d="M22.21079,29.25545c-0.02118,0.2605-0.06384,0.56171-0.15216,0.83832 c-0.38239,1.33691-1.55457,4.37891-4.43018,4.98267c-0.02393,0.00488-0.04834,0.00732-0.07227,0.00732 c-0.16211,0-0.30762-0.11328-0.34229-0.27832c-0.03955-0.18896,0.08154-0.37451,0.271-0.41455 c2.80054-0.58734,3.79822-4.03375,4.00085-4.87067c0,0,0.10968-0.37177,0.13965-0.85083 c-0.76825-0.77399-1.53577-1.54877-2.31189-2.31415c-0.15527-0.15332-0.42383-0.32812-0.7124-0.35938 c-0.6792-0.07471-1.20361-0.10205-1.68555-0.09668c-2.01123,0.03125-3.61084,1.15332-4.2793,3.00195 c-0.2666,0.73584-0.41504,1.51221-0.55908,2.26318l-0.04639,0.24072c-0.37109,1.9165-1.0166,3.08887-2.15771,3.91992 c-0.34326,0.24951-0.6543,0.53027-0.9834,0.82666c-0.15234,0.13721-0.30859,0.27832-0.47461,0.42188 c-0.10107,0.0874-0.14355,0.2251-0.10938,0.35498c0.03467,0.12939,0.14014,0.22754,0.27148,0.25342l0.5708,0.10938 c0.38574,0.07324,0.74023,0.14111,1.09326,0.21582c1.42725,0.30322,2.76318,0.45459,4.03271,0.45459 c0.92578,0,1.81689-0.08057,2.68115-0.24121c3.7168-0.69141,5.9707-2.99561,6.51855-6.66406 c0.04004-0.26807-0.07422-0.60791-0.271-0.80811C22.87492,29.91445,22.54063,29.58718,22.21079,29.25545z"
          style={{ fill: '#007bff' }}
        />
      </g>
    </g>
  </svg>
);




export function Comments() {

  const { selectedNode, setCommentMode, commentMode } = useScene();

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [paintTool, setPaintTool] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false);

  function handleChange(e) {
    setNewComment(e.target.value)
  }


  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {

    if (!paintTool) return
    if (isMouseDown) document.addEventListener('mousemove', checkIntersectsAndPaint);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', checkIntersectsAndPaint);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMouseDown, paintTool]);

  function handlePainting() {
    disableControlTransform()
    utils.setCanvasTexture(selectedNode)
    setPaintTool(true)
  }

  function handleCancel() {
    if (selectedNode) {
      activeControlTransform(selectedNode)
      if (paintTool) utils.clearCanvasTextures(selectedNode)
    }
    setPaintTool(false)
    setNewComment("")
    setCommentMode(false)
  }



  function handleSubmit() {
    let blankComment = {
      maps: {},
      description: newComment,
      date: new Date().toISOString(),
      name: "Harris"
    };

    selectedNode.traverse(function(object) {
      if (object.isMesh && object.userData.canvas) {
        const key = object.uuid;
        const value = object.userData.canvas;
        blankComment.maps[key] = value;
      }
    });

    console.log(blankComment);
    setComments(prev => [...prev, blankComment])

    handleCancel()

  }

  return (
    <>
      <h3 className='panel-header comments-header'>Comments</h3>
      <div className='comments'>

        <div className='comments-list'>
          {comments.map((comment, index) => {
            return (
              <Comment comment={comment} key={index} />
            )
          })}
        </div>

      </div>
      {!commentMode && <button className='create-btn' onClick={() => setCommentMode(true)}>Add Comment</button>}
      {commentMode && <div className='comment-form'>
        <textarea
          id='comment-input-text'
          value={newComment}
          onChange={handleChange}
        />
        <div className='btn-area'>
          <button onClick={handlePainting} style={{ pointerEvents: selectedNode === null ? 'none' : 'auto' }} className="paint-btn"><MySVG /></button>
          <button onClick={handleCancel} className="cancel-btn">cancel</button>
          <button onClick={handleSubmit} className="submit-btn">comment</button>
        </div>
      </div>}

    </>
  )
}



