import "../src/scss/main.scss";

import { Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, AmbientLight, GammaEncoding, Clock, AnimationMixer, LoopOnce, LoopRepeat, PlaneGeometry, DoubleSide, Color, Vector2, Raycaster, DirectionalLight, HemisphereLight, MeshLambertMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create Renderer.
const renderer = new WebGLRenderer()

// Set render range size to renderer.
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new Scene()
scene.background = new Color(0x888888)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.2;
const loader = new GLTFLoader();

const light = new HemisphereLight(0x888888, 0xffffff, 1.0);
light.position.set(1, 1, 1)
light.castShadow = true
scene.add(light)

const planeGeomery = new PlaneGeometry(100, 100)
const planeMaterial = new MeshLambertMaterial({ color: 0xfafafa, side: DoubleSide })
const plane = new Mesh(planeGeomery, planeMaterial);
plane.name = "Plane"
plane.position.set(0, 0, 0)
console.log(plane)

const cubeGeometry = new BoxGeometry(5, 5, 5)
const cubeMaterial = new MeshLambertMaterial({ color: 0xadadad })
const cube = new Mesh(cubeGeometry, cubeMaterial);
const cube2Geometry = new BoxGeometry(5, 5, 5)
const cube2Material = new MeshLambertMaterial({ color: 0x0f0fff })
const cube2 = new Mesh(cube2Geometry, cube2Material)
cube2.name = "on"
cube2.castShadow = true
cube.name = "off"
cube.position.set(10, 0, 10)
cube.castShadow = true
cube2.position.set(-10, 0, 10)

scene.add(cube2)
scene.add(cube)

const clock = new Clock()
let mixer;
let action;

loader.load("models/animatedModel.glb", (gltf) => {
  const animations = gltf.animations;
  if (animations) {
    mixer = new AnimationMixer(gltf.scenes[0]);

    for (let i = 0; i < animations.length; i++) {
      let animation = animations[i]
      action = mixer.clipAction(animation)
      action.setLoop(LoopRepeat)
      action.clampWhenFinished = false
      action.play()
    }
  }
  console.log(gltf)
  gltf.scenes[0].scale.set(10.0, 10.0, 10.0)
  gltf.scenes[0].name = "human"
  scene.add(gltf.scenes[0])
}, undefined, (error) => {
  console.log(error)
})
renderer.render(scene, camera);

controls.update()

// Animation Loop
function animate() {
  requestAnimationFrame(animate)

  controls.update()
  if (mixer) {
    mixer.update(clock.getDelta())
  }

  renderer.render(scene, camera)
}

// クリック検知
function clickPosition(event) {
  const x = event.clientX
  const y = event.clientY

  let mouse = new Vector2();
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  const raycaster = new Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  console.log(intersects)
  if (intersects.length > 0) {
    if (intersects[0].object.name == "off") {
      intersects[0].object.material.color.set(0xff0f0f)
      action.paused = true
      cube2.material.color.set(0xadadad)
    }
    if (intersects[0].object.name == "on") {
      intersects[0].object.material.color.set(0x0f0fff)
      action.paused = false
      cube.material.color.set(0xadadad)
    }
  }
}

function onResize() {
  const width = window.innerWidth
  const height = window.innerHeight

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  console.log("resize")
}

onResize()
animate();
document.addEventListener('mousedown', clickPosition, false);
const timer = false
window.addEventListener('resize', ()=> {
  if(timer !== false) {
    clearTimeout(timer)
  }

  timer = setTimeout(() => {
    onResize()
  }, 100)
})
