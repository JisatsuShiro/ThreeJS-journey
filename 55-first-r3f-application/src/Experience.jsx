import { extend, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CustomObject from "./CustomObject";

extend({ OrbitControls })

export default function Experience() {
    
    const { camera, gl } = useThree()

    const cubeRef = useRef()
    const sphereRef = useRef()
    const groupRef = useRef()

    

    useFrame((state, delta) => {
        cubeRef.current.rotation.y += delta        
        // groupRef.current.rotation.y += delta
        // const angle = state.clock.elapsedTime
        // state.camera.position.x = Math.sin(angle) * 8
        // state.camera.position.z = Math.cos(angle) * 8
        // state.camera.lookAt(0, 0, 0)
        // camera.position.y += 0.01
    })

    return <>
        <orbitControls args= { [camera, gl.domElement ]} />
        <directionalLight position={[1, 2, 3]} intensity={4.5}/>
        <ambientLight intensity={1.5} />

        <group ref={groupRef}>
            <mesh position={ [2, 0, 0] } ref={cubeRef} >
                <boxGeometry scale={1.5} />
                <meshStandardMaterial color='mediumpurple' />
            </mesh>
            <mesh position={ [-2, 0, 0] } ref={sphereRef}>
                <sphereGeometry />
                <meshStandardMaterial color='orange' />
            </mesh>
        </group>
        <mesh scale={10} rotation-x={ -(Math.PI * 0.5) } position-y={-3}>
            <planeGeometry />
            <meshStandardMaterial color='greenyellow' />
        </mesh>

        {/* Custom geometry */}
        <CustomObject />
    </>
}