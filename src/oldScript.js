import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { MeshStandardMaterial } from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js';
/**
 * Debug
 */


const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff);

// AXIS HELPER
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// Light

const light = new THREE.AmbientLight(0x404040, 5);
scene.add(light);

// Environment

const environmentMap = cubeTextureLoader.load([
  '/environmentMaps/0/px.png',
  '/environmentMaps/0/nx.png',
  '/environmentMaps/0/py.png',
  '/environmentMaps/0/ny.png',
  '/environmentMaps/0/pz.png',
  '/environmentMaps/0/nz.png'
])

scene.environment = environmentMap
scene.environmentIntensity = 3
scene.backgroundBlurriness = 0.5;
console.log("scen env: ", scene.environment)


// Materials
function mixColors(hex1, hex2, weight = 0.5) {
  // Create THREE.Color objects from hex values
  const color1 = new THREE.Color(hex1);
  const color2 = new THREE.Color(hex2);

  // Create a new color to store the result
  const mixedColor = new THREE.Color();

  // Mix the colors
  mixedColor.lerpColors(color1, color2, weight);

  // Return the mixed color in hex format
  return mixedColor.getHexString();
}



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  composer.setSize(sizes.width, sizes.height)
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 5000)
camera.position.x = 20
camera.position.y = 1
camera.position.z = 0
scene.add(camera)

// Controls
const orbit = new OrbitControls(camera, canvas)
orbit.enableDamping = true



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})

document.body.appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2

renderer.outputEncoding = THREE.sRGBEncoding


const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeThickness = 0.5;
outlinePass.edgeStrength = 100.0;
outlinePass.edgeGlow = 0.0;
outlinePass.visibleEdgeColor.set(0xff2200);
outlinePass.hiddenEdgeColor.set(0xff2200);

outlinePass.overlayMaterial.blending = THREE.SubtractiveBlending
//outlinePass.overlayMaterial.blending = THREE.CustomBlending
composer.addPass(outlinePass);

//shader
let effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);


const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaCorrectionPass)

// XYZ Controls

let control = new TransformControls(camera, renderer.domElement);
//control.addEventListener('change');

control.addEventListener('dragging-changed', function(event) {

  orbit.enabled = !event.value;

});


control.traverse((obj) => {
  obj.isTransformControls = true
});

scene.add(control)

// Raycaster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX / sizes.width * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})






/**
 * Animate
 */
const clock = new THREE.Clock()

export function updateNode(node) {
  node.updateMatrixWorld
  console.log("at script")
}


// REACT INTERACTIONS

export function returnScene() {
  return scene
}

let objects = []

export function addToScene(object) {
  addGroup(object.scene, scene);

  scene.traverse(function(object) {
    if (object.isMesh && object.type !== "TransformControlsPlane") objects.push(object)
  });

  console.log("objects", objects)
}


function addGroup(object, parent) {
  let group = new THREE.Group()
  object.children.forEach((child) => {
    if (child.isMesh) {
      addMesh(child, group);
      outlinePass.selectedObjects.push(child)
    } else {
      addGroup(child, group);
    }
  });

  parent.add(group)

}


function addMesh(object, group) {


  if (object && object.isMesh) {
    const worldPosition = new THREE.Vector3();
    const worldRotation = new THREE.Quaternion();
    const worldScale = new THREE.Vector3();

    object.updateMatrixWorld(true);
    object.getWorldPosition(worldPosition);
    object.getWorldQuaternion(worldRotation);
    object.getWorldScale(worldScale);

    const newMesh = new THREE.Mesh(object.geometry, object.material);
    newMesh.position.copy(worldPosition);
    newMesh.quaternion.copy(worldRotation);
    newMesh.scale.copy(worldScale);

    newMesh.name = "no name"
    if (object.name !== "") newMesh.name = object.name

    group.add(newMesh);
  }
}

export function highlight(node) {

  control.detach()
  if (node) {
    outlinePass.selectedObjects = [node]

    control.attach(node)
    control.setMode('translate');

  }
  if (!node) {
    outlinePass.selectedObjects = []
  }

}

export function returnCurrentIntersect() {
  return currentIntersect
}

let currentIntersect = null

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  orbit.update()
  // Render
  //renderer.render(scene, camera)
  composer.render();

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(objects)


  for (const object of objects) {
    if (object.material.userData.originalColor) {
      object.material.color.copy(object.material.userData.originalColor)
      object.material.userData.originalColor = null
    }

  }

  if (intersects.length > 0) {
    let originalColor = intersects[0].object.material.color.clone()
    currentIntersect = intersects[0].object
    if (!intersects[0].object.material.userData.originalColor) {
      intersects[0].object.material.userData.originalColor = originalColor
    }
    const mixedHexColor = mixColors(0x0000ff, originalColor, 0.7);
    intersects[0].object.material.color.set(`#${mixedHexColor}`);
  } else {
    currentIntersect = null
  }






  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('keydown', function(event) {

  switch (event.key) {

    case 'q':
      control.setSpace(control.space === 'local' ? 'world' : 'local');
      break;

    case 'Shift':
      control.setTranslationSnap(1);
      control.setRotationSnap(THREE.MathUtils.degToRad(15));
      control.setScaleSnap(0.25);
      break;

    case 'g':
      control.setMode('translate');
      break;

    case 'r':
      control.setMode('rotate');
      break;

    case 's':
      control.setMode('scale');
      break;

    case 'h':
      control.traverse((obj) => {
        obj.visible = !obj.visible
      });
      break;
  }
})
