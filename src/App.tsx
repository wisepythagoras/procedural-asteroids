import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

type AsteroidPropsT = {
    position: [number, number, number];
};

const Asteroid = (props: AsteroidPropsT) => {
    const { position } = props;
    const [setUp, setSetUp] = useState(false);
    const dRef = useRef<THREE.DodecahedronGeometry | null>(null);
    const meshRef = useRef<THREE.Mesh<
        THREE.BufferGeometry,
        THREE.Material
    > | null>(null);
    const speedsRef = useRef([Math.random(), Math.random(), Math.random()]);

    useFrame(() => {
        if (!meshRef.current) {
            return;
        }

        meshRef.current.rotation.x += 0.002 * speedsRef.current[0];
        meshRef.current.rotation.y += 0.002 * speedsRef.current[1];
        meshRef.current.rotation.z -= 0.002 * speedsRef.current[2];

        if (setUp) {
            return;
        }

        const pos = meshRef.current?.geometry.attributes.position;

        if (!pos) {
            return;
        }

        const vertices = pos.array;
        const bypass: number[] = [];

        for (let i = 0; i < vertices.length / pos.itemSize; i++) {
            if (bypass.indexOf(i) > -1) {
                continue;
            }

            const currX = pos.getX(i);
            const currY = pos.getY(i);
            const currZ = pos.getZ(i);
            const x = currX + (0 - Math.random() * (1 / 3));
            const y = currY + (0 - Math.random() * (1 / 3));
            const z = currZ + (0 - Math.random() * (1 / 3));

            pos.setX(i, x);
            pos.setY(i, y);
            pos.setZ(i, z);

            for (let j = 0; j < vertices.length; j += 3) {
                if (
                    vertices[j] === currX &&
                    vertices[j + 1] === currY &&
                    vertices[j + 2] === currZ
                ) {
                    // @ts-ignore
                    meshRef.current.geometry.attributes.position.array[
                        j
                    ] = x;
                    // @ts-ignore
                    meshRef.current.geometry.attributes.position.array[
                        j + 1
                    ] = y;
                    // @ts-ignore
                    meshRef.current.geometry.attributes.position.array[
                        j + 2
                    ] = z;
                    bypass.push(j / 3);
                }
            }
        }

        setSetUp(true);
    });

    return (
        <mesh
            rotation={[-1, 0, -10]}
            ref={meshRef}
            position={position}
            onPointerOver={() => {
                if (meshRef.current) {
                    // @ts-ignore
                    meshRef.current.material.color = new THREE.Color(0xfff000);
                    // @ts-ignore
                    meshRef.current.material.emissive = new THREE.Color(
                        0xff0000,
                    );
                    // @ts-ignore
                    meshRef.current.material.emissiveIntensity = 0.5;
                }
            }}
            onPointerLeave={() => {
                if (meshRef.current) {
                    // @ts-ignore
                    meshRef.current.material.color = new THREE.Color(0xffffff);
                    // @ts-ignore
                    meshRef.current.material.emissiveIntensity = 0;
                }
            }}
            castShadow
            receiveShadow
        >
            <dodecahedronGeometry ref={dRef} />
            <meshStandardMaterial />
        </mesh>
    );
};

export default function App() {
    return (
        <div className="canvas-container">
            <Canvas
                camera={{
                    position: [0, 0, 6],
                    fov: 70,
                    aspect: window.innerWidth / window.innerHeight,
                }}
            >
                <color attach="background" args={['#fff3e5']} />
                <perspectiveCamera />
                <ambientLight intensity={0.05} />
                <directionalLight
                    color="white"
                    position={[3, 0, 5]}
                    intensity={0.5}
                    castShadow
                />
                <Asteroid position={[0, 0, 0]} />
                <Asteroid position={[3, 0, 0]} />
                <Asteroid position={[-3, 0, 0]} />
                <OrbitControls />
            </Canvas>
        </div>
    );
}
