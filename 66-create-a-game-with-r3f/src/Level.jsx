import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'


const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floorMaterial = new THREE.MeshStandardMaterial({color: 'limegreen'})
const floorMaterial2 = new THREE.MeshStandardMaterial({color: 'greenyellow'})
const obstacleMaterial = new THREE.MeshStandardMaterial({color: 'red'})
const wallMaterial = new THREE.MeshStandardMaterial({color: 'slategrey'})

function BlockStart({ position = [0, 0, 0]}) {
    return <group position={position}>
        <Float floatIntensity={ 0.25 } rotationIntensity={ 0.25 }>
            <Text 
                font="./bebas-neue-v9-latin-regular.woff"
                scale={ 0.5 }
                maxWidth={ 0.25 }
                lineHeight={ 0.75 }
                textAlign="right"
                position={ [ 0.75, 0.65, 0 ] }
                rotation-y={ - 0.25 }
            >
                Marble Race
                <meshBasicMaterial toneMapped={ false } />
            </Text>
        </Float>
        <mesh geometry={boxGeometry} 
            position-y={-0.1} 
            scale={[4, 0.2, 4]} 
            material={floorMaterial}
            receiveShadow>
        </mesh>
    </group>
}

function BlockEnd({ position = [0, 0, 0]}) {

    const burger = useGLTF('./hamburger.glb')
    burger.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    return <group position={position}>
        <Text
            font="./bebas-neue-v9-latin-regular.woff"
            scale={ 1 }
            position={ [ 0, 2.25, 2 ] }
        >
            FINISH
            <meshBasicMaterial toneMapped={ false } />
        </Text>
        <mesh geometry={boxGeometry} 
            position-y={0} 
            scale={[4, 0.2, 4]} 
            material={floorMaterial}
            receiveShadow>
        </mesh>
        <RigidBody type='fixed' colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
            <primitive object={burger.scene} scale={0.2} />
        </RigidBody>
    </group>
}

export function SpinnerTrap({ position = [0, 0, 0]}) {
    const obstacleRef = useRef()
    const [speed]= useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1) )
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacleRef.current.setNextKinematicRotation(rotation)
    })

    return <group position={position}>
        <mesh geometry={boxGeometry} 
            position-y={-0.1} 
            scale={[4, 0.2, 4]} 
            material={floorMaterial2}
            receiveShadow>
        </mesh>
        <RigidBody ref={obstacleRef} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} 
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow
                castShadow>
            </mesh>
        </RigidBody>
    </group>
}

export function LimboTrap({ position = [0, 0, 0]}) {
    const obstacleRef = useRef()
    const [timeOffset]= useState(() => Math.random() * Math.PI * 2)
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime

        const y = Math.sin(time + timeOffset) + 1.15
        obstacleRef.current.setNextKinematicTranslation({x:position[0], y:position[1]+y, z:position[2]})
    })

    return <group position={position}>
        <mesh geometry={boxGeometry} 
            position-y={-0.1} 
            scale={[4, 0.2, 4]} 
            material={floorMaterial2}
            receiveShadow>
        </mesh>
        <RigidBody ref={obstacleRef} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} 
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow
                castShadow>
            </mesh>
        </RigidBody>
    </group>
}

export function AxeTrap({ position = [0, 0, 0]}) {
    const obstacleRef = useRef()
    const [timeOffset]= useState(() => Math.random() * Math.PI * 2)
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime

        const x = Math.sin(time + timeOffset) * 1.25
        obstacleRef.current.setNextKinematicTranslation({x:position[0]+x, y:position[1] + 0.75, z:position[2]})
    })

    return <group position={position}>
        <mesh geometry={boxGeometry} 
            position-y={-0.1} 
            scale={[4, 0.2, 4]} 
            material={floorMaterial2}
            receiveShadow>
        </mesh>
        <RigidBody ref={obstacleRef} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} 
                material={obstacleMaterial}
                scale={[1.5, 1.5, 0.3]}
                receiveShadow
                castShadow>
            </mesh>
        </RigidBody>
    </group>
}

function Bounds({ length = 1 }) {
    return <>
        <RigidBody type='fixed' restitution={0.2} friction={0}>
            <mesh geometry={boxGeometry} 
                material={wallMaterial}
                position={[2.15, 0.75, - (length *2)+2]}
                scale={[0.3, 1.5, length * 4]} 
                castShadow>
            </mesh>
            <mesh geometry={boxGeometry} 
                material={wallMaterial}
                position={[-2.15, 0.75, - (length *2)+2]}
                scale={[0.3, 1.5, length * 4]} 
                receiveShadow>
            </mesh>
            <mesh geometry={boxGeometry} 
                material={wallMaterial}
                position={[0, 0.75, - (length*4)+2]}
                scale={[4, 1.5, 0.3]} 
                receiveShadow>
            </mesh>
            <CuboidCollider args={[2, 0.1, 2 * length]}
                position={[0, -0.1, -(length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>
}

export function Level({count = 5, types = [SpinnerTrap, AxeTrap, LimboTrap], seed = 0 }) {

    const blocks = useMemo(() => {
        const blocks = []
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)            
        }
        return blocks
    }, [count, types, seed])
    return <>
        <BlockStart position={[0, 0, 0]}/>
        {blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]}/>)}
        <BlockEnd position={[0, 0, - (count + 1) *4]} />
        <Bounds length={count + 2} />
    </>
}