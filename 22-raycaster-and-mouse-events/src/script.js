import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// GLTFLoader
const gltfLoader = new GLTFLoader()
let model = null
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        model = gltf.scene
        model.position.y = - 1.5
        scene.add(model)
    }
)

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object3)

// Raycaster
const rayCaster = new THREE.Raycaster()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Cursor
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1    
})

window.addEventListener('click', (event) => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log(object1);
                break;
            case object2:
                console.log(object2);
                break;
            case object3:
                console.log(object3);
                break;
        
            default:
                break;
        }
    }
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Light
const light = new THREE.AmbientLight('#ffffff', 3)
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
scene.add(light, directionalLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.6) * 1.5
    object3.position.y = Math.sin(elapsedTime * 0.9) * 1.5

    // const origin = new THREE.Vector3(-3, 0, 0)
    // const direction = new THREE.Vector3(1, 0, 0)
    // direction.normalize()
    // rayCaster.set(origin, direction)
    const objectToTest = [object1, object2, object3]
    const intersects = rayCaster.intersectObjects(objectToTest)
    for(const obj of objectToTest) {
        obj.material.color.set('#ff0000')
    }
    // for(const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff')
    // }

    // Raycast & Mouse
    rayCaster.setFromCamera(mouse, camera)
    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    // testing intersect
    if (intersects.length) {
        if (currentIntersect !== null) {
            console.log('mouse enter');
        }
        currentIntersect = intersects[0]       

    } else {
        if (currentIntersect) {
            console.log('mouse leave');
        }
        currentIntersect = null        
    }

    // Raycast & imported models        
    if (model !== null) {
        const intersectModel = rayCaster.intersectObject(model)
        if (intersectModel.length) {
            model.scale.setScalar(2)
        } else {
            model.scale.setScalar(1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()