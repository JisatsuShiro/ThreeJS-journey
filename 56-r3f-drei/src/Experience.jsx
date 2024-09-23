import { Html, OrbitControls, PivotControls, TransformControls } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience()
{

    const cubeRef = useRef()
    const sphereRef = useRef()

    return <>
        <OrbitControls makeDefault />
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />
        
        <PivotControls anchor={[ 0, 0, 0]} depthTest={false}>
            <mesh position-x={ - 2 } ref={sphereRef}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                
                <Html 
                    position={[1, 1, 0]} 
                    wrapperClass='label' 
                    center 
                    distanceFactor={6}
                    occlude={[sphereRef, cubeRef]}
                >
                    That's a texte on a sphere
                </Html>
            </mesh>
        </PivotControls>

        <mesh ref={cubeRef} scale={ 1.5 } position-x={ 2 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <TransformControls object={cubeRef} mode='translate'/>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}