import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import useGame from './stores/useGame.jsx'

export default function Player() {

    // Controls
    const bodyRef = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const  { rapier, world } = useRapier()
    const rapierWorld = world

    const [smoothCameraPosition]= useState(new THREE.Vector3(10, 10, 10))
    const [smoothCameraTarget]= useState(new THREE.Vector3())
    
    const start = useGame((state) => {return state.start})
    const end = useGame((state) => {return state.end})
    const restart = useGame((state) => {return state.restart})
    const blocksCount = useGame((state) => { return state.blocksCount })


    const jump = () => {        
        const origin = bodyRef.current.translation()
        origin.y -= 0.31
        const direction = {x:0, y: -1, z: 0}
        const ray = new rapier.Ray(origin, direction)
        const hit = rapierWorld.castRay(ray, 10, true)
        
        if (hit.timeOfImpact < 0.15) {
            bodyRef.current.applyImpulse({x:0, y: 0.5, z: 0})
        }
    }

    const reset = () => {
        bodyRef.current.setTranslation({x:0, y:1, z:0})        
        bodyRef.current.setLinvel({x:0, y:0, z:0})        
        bodyRef.current.setAngvel({x:0, y:0, z:0})        
    }

    useEffect(() => {
        const unsubscribeReset = useGame.subscribe(
            (state) =>  state.phase,
            (value) => {
                if (value === 'ready') {
                    reset()
                }
            }
        )
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) {
                    jump()
                }
            }
        )

        const unsubscribeAny = subscribeKeys(
            () => {
                start()
            }
        )
        return () => {
            unsubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
        }
    }, [])

    useFrame((state, delta) => {
        const {forward, backward, leftward, rightward} = getKeys()
        
        const impulse = { x: 0, y: 0, z: 0}        
        const torque = { x: 0, y: 0, z: 0}
        
        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        if (leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        if (rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        bodyRef.current.applyImpulse(impulse)
        bodyRef.current.applyTorqueImpulse(torque)

        // Camera
        const bodyPosition = bodyRef.current.translation()
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothCameraPosition)
        state.camera.lookAt(smoothCameraTarget)

        /**
         * Phases
         */
        if (bodyPosition.z < - (blocksCount * 4 + 2)) {
            end()
        }
        if (bodyPosition.y < -4) {
            restart()            
        }
    })

    return <RigidBody  ref={bodyRef}
        position={[0, 1, 0]} 
        colliders="ball" 
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={0.5} 
        friction={1}
        canSleep={ false }>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color={"mediumpurple"} />
            </mesh>
    </RigidBody>

}