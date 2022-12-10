import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { Vector3 } from 'three'


let model, arno, mini_arno
let view_scale


const scene = new THREE.Scene()
scene.name = "main_scene"

// 🎥-camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.y = 5
camera.position.z = 5
camera.lookAt(0,5,5)

// renderer
const renderer = new THREE.WebGLRenderer( { 
    alpha: true,
    antialias: true,
} )
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor( 0x000000, 0 );
document.body.appendChild(renderer.domElement)

// 🎮-Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)


// ----------- Objects -----------------
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
view_scale = 5
const index = new THREE.Mesh(geometry, material)
index.name = "index"
index.position.add(new Vector3(1,0,1)).multiplyScalar(view_scale)
const thumb = new THREE.Mesh(geometry, material)
thumb.name = "thumb"
thumb.position.add(new Vector3(-1,0,1)).multiplyScalar(view_scale)
const pinky = new THREE.Mesh(geometry, material)
pinky.name = "pinky"
pinky.position.add(new Vector3(1,0,-1)).multiplyScalar(view_scale)
scene.add(index)
scene.add(thumb)
scene.add(pinky)

// little helper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

// GUI
const gui = new GUI()
const modelFolder = gui.addFolder('models')
modelFolder.open()


// 💡-lightning
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);


// resizing
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
// Stats
const stats = Stats()
document.body.appendChild(stats.dom)


// animation
function animate() {
    requestAnimationFrame(animate)

    index.rotation.x += 0.01
    index.rotation.y += 0.01

    stats.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()

// ToDo:
function myUpdate() {

}


// loaders
const loader = new GLTFLoader()
loader.load(
    'models/mini-Arno.gltf',
    // called when the resource is loaded
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                m.receiveShadow = true
                m.castShadow = true
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })
        mini_arno = gltf.scene
        mini_arno.name = "mini_Arno"
        scene.add(mini_arno)
        // GUI
        modelFolder.add(mini_arno, 'visible').name("mini-Arno")
        const miniArnoFolder = gui.addFolder('miniArnoFolder')
        const miniArnoPosition = miniArnoFolder.addFolder('Positon')
        miniArnoPosition.add(mini_arno.position, 'x', -2, 2)
        miniArnoPosition.add(mini_arno.position, 'y', -2, 2)
        miniArnoPosition.add(mini_arno.position, 'z', -2, 2)
        const miniArnoRotation = miniArnoFolder.addFolder('Rotation')
        miniArnoRotation.add(mini_arno.rotation, 'x', 0, 2*Math.PI)
        miniArnoRotation.add(mini_arno.rotation, 'y', 0, 2*Math.PI)
        miniArnoRotation.add(mini_arno.rotation, 'z', 0, 2*Math.PI)
    },
    // called while loading is progressing
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // called when loading has errors
    (error) => {
        console.log(error)
    }
)
loader.load(
    'models/arno-rigged-neos-withBrain.gltf',
    // called when the resource is loaded
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                m.receiveShadow = true
                m.castShadow = true
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })
        arno = gltf.scene
        arno.name = "mini_Arno"
        arno.visible = false
        arno.scale.multiplyScalar(0.3)
        scene.add(arno)
        modelFolder.add(arno, 'visible').name("Arno")
        console.log(arno);
        
    },
    // called while loading is progressing
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // called when loading has errors
    (error) => {
        console.log(error)
    }
)