
import * as THREE from 'three'



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


function addGroup(object, parent) {
  let group = new THREE.Group()
  object.children.forEach((child) => {
    if (child.isMesh) {
      addMesh(child, group);
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


function setCanvasTexture(selectedNode) {

  selectedNode.traverse(function(object) {
    if (object.isMesh) {
      console.log("handlePainting: ", object);

      // Make Canvas
      let drawCanvas = document.createElement('canvas');
      drawCanvas.width = 300;
      drawCanvas.height = 300;
      let ctx = drawCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

      // Save original color and canvas ref
      let mat = object.material;
      object.userData.originalColor = mat.color.clone();
      object.userData.canvas = ctx
      // Apply Canvas
      let texture = new THREE.Texture(drawCanvas);
      texture.needsUpdate = true;
      let newMaterial = new THREE.MeshStandardMaterial({ map: texture });

      object.material = newMaterial;
    }
  });

}

export function clearCanvasTextures(selectNode) {
  selectNode.traverse(function(object) {
    if (object.isMesh && object.userData.canvas) {
      object.userData.canvas.clearRect(0, 0, object.userData.canvas.width, object.userData.canvas.height);
      delete object.userData.canvas
      object.material = new THREE.MeshStandardMaterial({ color: object.userData.originalColor })
      object.userData.originalColor = null
    }
  })
}


export { mixColors, addGroup, setCanvasTexture };
