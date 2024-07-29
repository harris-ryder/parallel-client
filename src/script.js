import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import * as utils from './threeUtils.js';

let composer, outlinePass, currentIntersect, effectFXAA, control
let camera, scene, raycaster, renderer, environmentMap, orbit, mouse, clock, canvas
let paintMode = false
let sceneMeshes = []

init()

function init() {

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff);

  clock = new THREE.Clock()

  canvas = document.querySelector('canvas.webgl')

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
  camera.position.x = 20
  camera.position.y = 1
  camera.position.z = 0
  scene.add(camera)

  const light = new THREE.AmbientLight(0x404040, 5);
  scene.add(light);

  const cubeTextureLoader = new THREE.CubeTextureLoader()
  environmentMap = cubeTextureLoader.load([
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


  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  })

  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 2
  renderer.outputEncoding = THREE.sRGBEncoding

  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  outlinePass.edgeThickness = 0.5;
  outlinePass.edgeStrength = 100.0;
  outlinePass.edgeGlow = 0.0;
  outlinePass.visibleEdgeColor.set(0xff2200);
  outlinePass.hiddenEdgeColor.set(0xff2200);
  outlinePass.overlayMaterial.blending = THREE.SubtractiveBlending
  composer.addPass(outlinePass);

  effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
  effectFXAA.renderToScreen = true;
  composer.addPass(effectFXAA);

  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
  composer.addPass(gammaCorrectionPass)

  control = new TransformControls(camera, renderer.domElement);
  control.addEventListener('dragging-changed', toggleOrbit)
  control.traverse((obj) => {
    obj.isTransformControls = true
  });
  scene.add(control)

  orbit = new OrbitControls(camera, canvas)
  orbit.enableDamping = true

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  let axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  document.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  composer.setSize(window.innerWidth, window.innerHeight)
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
}


function toggleOrbit(event) {
  orbit.enabled = !event.value;
}


function checkIntersectsAndHighlight() {

  if (paintMode) return
  raycaster.setFromCamera(mouse, camera)
  let intersects
  if (sceneMeshes) intersects = raycaster.intersectObjects(sceneMeshes)


  for (const object of sceneMeshes) {
    if (object.material.userData.originalColor) {
      object.material.color.copy(object.material.userData.originalColor)
      object.material.userData.originalColor = null
    }
  }

  if (intersects.length > 0) {
    let originalColor = intersects[0].object.material.color.clone()
    currentIntersect = intersects[0].object

    if (!currentIntersect.material.userData.originalColor) {
      currentIntersect.material.userData.originalColor = originalColor
    }
    const mixedHexColor = utils.mixColors(0x0000ff, originalColor, 0.7);
    currentIntersect.material.color.set(`#${mixedHexColor}`);
  } else {
    currentIntersect = null
  }
}


const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  orbit.update()
  composer.render();
  checkIntersectsAndHighlight()
  window.requestAnimationFrame(tick)
}
tick()


// EXPORTS
export function activeControlTransform(node) {
  orbit.enabled = true
  control.attach(node)
  paintMode = false
}
export function disableControlTransform() {
  orbit.enabled = false
  control.detach()
  paintMode = true
}

export function updateNode(node) {
  node.updateMatrixWorld
}


export function returnScene() {
  return scene
}


export function highlight(node) {

  control.detach()
  if (node) {
    outlinePass.selectedObjects = [node]
    control.attach(node)
    control.setMode('translate');

  } else if (!node) {
    outlinePass.selectedObjects = []
  }

}

export function addToScene(object) {

  utils.addGroup(object.scene, scene)

  scene.traverse(function(mesh) {
    if (mesh.isMesh && mesh.type !== "TransformControlsPlane") sceneMeshes.push(mesh)
  });
}

export function returnCurrentIntersect() {
  return currentIntersect
}


export function checkIntersectsAndPaint() {

  raycaster.setFromCamera(mouse, camera)
  let intersects
  if (sceneMeshes) intersects = raycaster.intersectObjects(outlinePass.selectedObjects)
  console.log("checking intersects", intersects)
  if (intersects.length < 1) return
  currentIntersect = intersects[0].object
  let ctx = currentIntersect.userData.canvas

  ctx.beginPath();
  ctx.arc(intersects[0].uv.x * 300, (1 - intersects[0].uv.y) * 300, 1, 0, Math.PI * 2);  // Center (4, 4), radius 2
  ctx.fillStyle = '#0000ff';
  ctx.fill();
  ctx.closePath();

  currentIntersect.material.map.needsUpdate = true;
}



// OTHER


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
