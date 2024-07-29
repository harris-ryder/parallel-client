import React from 'react'
import { useRef, useEffect, Suspense, useState, useContext } from 'react';
import { useScene } from '../context/SceneContext';
import { TreeNode } from './TreeNode';
import { SceneTree } from './SceneTree';
import { Properties } from './Properties';
import { ShareBar } from './ShareBar'
import { Comments } from './Comments';

export function Editor() {
  return (
    <div className='editor'>
      <ShareBar />
      <SceneTree />
      <Properties />
      <Comments />
    </div>
  )
}

