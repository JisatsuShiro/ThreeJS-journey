import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()

// Floor textures
const floorAlphaTexture = textureLoader.load('./floor/alpha.webp')
const floorColorTexture = textureLoader.load('./floor/mud_forest_1k/mud_forest_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/mud_forest_1k/mud_forest_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/mud_forest_1k/mud_forest_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/mud_forest_1k/mud_forest_disp_1k.webp')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

// Walls Textures
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_diff_1k.webp')
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof textures
'./roof/thatch_roof_angled_1k/thatch_roof_angled_arm_1k.webp'
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace
roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bushes texture
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_nor_gl_1k.webp')
bushColorTexture.colorSpace = THREE.SRGBColorSpace
bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Graves textures
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace
graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door textures
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorAOTexture = textureLoader.load('./door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./door/height.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
// doorColorTexture.repeat.set(0.3, 0.4)
// doorARMTexture.repeat.set(0.3, 0.4)
// doorNormalTexture.repeat.set(0.3, 0.4)
/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
)
walls.position.y = 1.25 
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
)
roof.position.y = 3.25
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAOTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// BUSHES
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh( bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75
const bush2 = new THREE.Mesh( bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75
const bush3 = new THREE.Mesh( bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75
const bush4 = new THREE.Mesh( bushGeometry, bushMaterial);
bush4.scale.setScalar(0.15)
bush4.position.set(-1, 0.052, 2.62)
bush4.rotation.x = -0.75
house.add(bush1,bush2,bush3,bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial= new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
})

const graves = new THREE.Group()
scene.add(graves)

for (let index = 0; index < 30; index++) {
    const angle  = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4         
    const x = Math.cos(angle) * radius       
    const z = Math.sin(angle) * radius
    
    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    ) 

    // grave.position    
    grave.position.x = x     
    grave.position.z = z
    grave.position.y = Math.random() * 0.4 
    
    // grave.rotation
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    graves.add(grave)
}

// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 150, 150),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.4322,
        displacementBias: -0.2606
    })
)
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.0001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.0001).name('floorDisplacementBias')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// doorLight
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

// Ghost
const ghost = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// cast & receive
directionalLight.castShadow = true
ghost.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping Shadows
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost.shadow.mapSize.width = 256
ghost.shadow.mapSize.height = 256
ghost.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

// Sky
const sky = new Sky()
sky.scale.setScalar(100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1 
sky.material.uniforms['mieDirectionalG'].value = 0.95 
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

// Fog
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#04343f',0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghosts
    const ghost1angle = elapsedTime * 0.5
    ghost.position.x = Math.cos(ghost1angle) * 4
    ghost.position.z = Math.sin(ghost1angle) * 4
    ghost.position.y = Math.sin(ghost1angle) * Math.sin(ghost1angle * 2.34) * Math.sin(ghost1angle * 3.45)
    
    const ghost2angle = - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2angle) * 5
    ghost2.position.z = Math.sin(ghost2angle) * 5
    ghost2.position.y = (Math.sin(ghost2angle) * Math.sin(ghost2angle * 2.34) * Math.sin(ghost2angle * 3.45))
    
    const ghost3angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3angle) * 6
    ghost3.position.z = Math.sin(ghost3angle) * 6
    ghost3.position.y = (Math.sin(ghost3angle) * Math.sin(ghost3angle * 2.34) * Math.sin(ghost3angle * 3.45))
    
    // Making doorlight blinking
    let blinkSpeed = Math.random() -0.5 /2; // Vitesse de clignotement
    let isBlinking = Math.random() >= 0.5;

    if (isBlinking) {
        // On alterne l'intensité entre 0 et 1 pour créer un effet de clignotement
        doorLight.intensity = Math.abs(Math.sin(Date.now() * blinkSpeed));
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()