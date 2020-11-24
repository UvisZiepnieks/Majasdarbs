import * as THREE from "./three.js-dev/build/three.module.js";
import { VRButton } from "./three.js-dev/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "./three.js-dev/examples/jsm/webxr/XRControllerModelFactory.js";
import { OBJLoader } from "./three.js-dev/examples/jsm/loaders/OBJLoader.js";

export function Majasdarbs() {
  const loader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  const ControllerModelFactory = new XRControllerModelFactory();

  let object;
  let object2;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;

   const grip = renderer.xr.getControllerGrip(0);
   const model = ControllerModelFactory.createControllerModel(grip);
   scene.add(grip);

  const ambientLight = new THREE.AmbientLight(0xfcf3cf, 1);
  scene.add(ambientLight);


  const manager = new THREE.LoadingManager(loadModel);
  const texture_loader = new THREE.TextureLoader(manager);
  const texture = texture_loader.load('./model.jpg');
  const texture2 = texture_loader.load('./porsche.png');

  const object_loader = new OBJLoader(manager);
  object_loader.load('./Porsche_911_GT2.obj', function (obj) {
    object = obj;
  }, onProgress, onError);
  object_loader.load('./porsche.obj', function (obj2) {
    object2 = obj2;
  }, onProgress, onError);


  let uniform = {
    time: {value: 1}
};

const material = new THREE.ShaderMaterial({
    uniforms: uniform,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});

  const geometry = new THREE.CylinderGeometry( 5, 5, 0.5, 32 );
  const cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.z = -7;
  cylinder.position.y = 1.1;
  scene.add( cylinder );

  camera.position.z = 5;

  let mesh;
  let mesh_arr = [];

  let positionM = 0;
  let positionP = 0;
  const material2 = new THREE.MeshPhongMaterial({
    //map: loader.load("./texture.jpg"),
    color: 0x48c9b0,
});
const cube = new THREE.Mesh(geometry, material2);
for (let this_y = -2; this_y < 2; this_y++) {
 
      mesh = cube.clone();
      

  mesh.position.set(1 - this_y * 20, 5, -20);
  scene.add(mesh);
  mesh_arr.push(mesh);
}
   



  //Animation loop
  renderer.setAnimationLoop(function () {
    if ( object ) object.rotation.y += Math.PI / 720;
    
    cylinder.rotation.y += Math.PI / 720;
    renderer.render(scene, camera);
  });

  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  function loadModel() {
    object.traverse(function (child) {
      //traverse
      if (child.isMesh) {
        child.material.map = texture;
      }
    });
    object2.traverse(function (child) {
      //traverse
      if (child.isMesh) {
        child.material.map = texture2;
      }
    });

    object.position.z = -5;
    object.position.y = 2;
    object2.position.z = -5;
    object2.position.y = 4;
    
    object.rotation.y = 90;
    object2.rotation.x = 90;
    // object.scale.set(0.05,0.05,0.05);
    scene.add(object);
    scene.add(object2);
  }

  //On progress
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const loading_completed = xhr.loaded / xhr.total / 100;
      console.log('Model ' + Math.round(loading_completed, 2) + '% loaded.');
    }
  }

  //On error
  function onError(err) {
    console.log(err);
  }
}
