
Quick rundown:

script.js holds all the three.js

fileLoader.js is basically a big function, it takes the locally loaded file and returns an array of scenes that can be 
used in threejs

SceneContext holds all the UI brains, the state variable models inside of it holds all the scene data thats passed into threejs
and the UI

SceneTree takes models and creates a tree of the model structure using TreeNode.  
