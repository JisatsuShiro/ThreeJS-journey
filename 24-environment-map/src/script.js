import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader.js'
import {GroundedSkybox} from 'three/addons/objects/GroundedSkybox.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Loader
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const exrLoader = new EXRLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// EnvironmentMap
// scene.environmentIntensity = 4
// scene.backgroundBlurriness = 0
// scene.backgroundIntensity= 5
// scene.backgroundRotation.x = 1
// scene.environmentRotation.x = 1

gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)
gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('backgroundRotationY')
gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('environmentRotationY')

// const envMap = cubeTextureLoader.load([
//     './environmentMaps/2/px.png',
//     './environmentMaps/2/nx.png',
//     './environmentMaps/2/py.png',
//     './environmentMaps/2/ny.png',
//     './environmentMaps/2/pz.png',
//     './environmentMaps/2/nz.png'
// ])
// scene.environment = envMap
// scene.background = envMap

RGBELoader
const rgbeMap = rgbeLoader.load(
    './environmentMaps/1/2k.hdr',
    (envMap) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping
        scene.background = envMap
        scene.environment = envMap

        const skybox = new GroundedSkybox(envMap, 15, 70, 32)
        skybox.position.y = 15
        scene.add(skybox)
    }
)

// EXR LOADER
// exrLoader.load(
//     './environmentMaps/nvidiaCanvas-4k.exr',
//     (env) => {
//         env.mapping = THREE.EquirectangularReflectionMapping
//         scene.background = env
//         scene.environment = env
//     }
// )

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 1,
        color: 0xaaaaaa
    })
)
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)


gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.setScalar(10)
        scene.add(gltf.scene)
    }
)
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

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
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()