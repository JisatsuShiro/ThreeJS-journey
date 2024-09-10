import * as THREE from 'three'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import sources from './sources'
import Debug from './Utils/Debug'

let instance = null

export default class Experience {

    constructor(canvas) {
        window.experience = this
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        this.canvas = canvas

        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Resize Event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick Event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()        
        this.world.update()
        this.renderer.update()
    }

    destroy() {
        // BETTER TO CREATE destroy() ON EACH CLASS
        this.sizes.off('resize')
        this.time.off('tick')
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const element of child.material) {
                    const value = child.material[element]

                    if (element && typeof element.dispose === 'function') {
                        element.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active) {
            this.debug.ui.destroy()
        }
    }
}