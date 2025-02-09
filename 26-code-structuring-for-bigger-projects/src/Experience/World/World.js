import Experience from '../Experience'
import Environment from './Environment'
import Floor from './Floor'
import Fox from './Fox'

export default class World {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // const testMest = new THREE.Mesh(
        //     new THREE.BoxGeometry(1, 1, 1),
        //     new THREE.MeshStandardMaterial({wireframe: false})
        // )
        // this.scene.add(testMest)

        // Listen ready Event from Resources
        this.resources.on('ready', () => {
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update() {
        if(this.fox) {   
            this.fox.update()
        }   
            
    }

}