import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Model from './Model'
import { Suspense } from 'react'
import PlaceHolder from './PlaceHolder'
import Hamburger from './Hamburger'
import { Fox } from './Fox'

export default function Experience()
{    
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>
        <Suspense fallback={ <PlaceHolder position-y={ 0.5 } scale={ [2, 3, 2] } /> } >
            <Hamburger scale={0.35} />
            <Fox scale={0.02} position-x={-4} />
        </Suspense>
    </>
}