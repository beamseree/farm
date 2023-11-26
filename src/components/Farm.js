import { useThree, extend, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import {
    EffectComposer,
    Pixelation,
    Outline,
    Selection,
    Select,
} from "@react-three/postprocessing";
import { useHelper, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";
import Cell from "./Cell";

extend({ OrbitControls });

const Farm = (props) => {
    const directionalLight = useRef();
    const focus = useRef();
    const orbitPosition = useRef();
    const orbitControls = useRef();

    // useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

    useFrame(() => {
        const temp = new THREE.Box3().setFromObject(focus.current);
        orbitPosition.current = new Vector3(
            (temp.max.x + temp.min.x) * 0.5,
            0,
            (temp.max.z + temp.min.z) * 0.5
        );
        orbitControls.current.target = orbitPosition.current;
    });

    // const gltf = useLoader(GLTFLoader, "grass_block.glb");

    return (
        <>
            <OrbitControls
                ref={orbitControls}
                enableZoom={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 3}
                enablePan={false}
            // target={focus.current.position}
            />

            <directionalLight
                ref={directionalLight}
                position={[2, 10, 1]}
                intensity={0.5}
                castShadow
            />
            <ambientLight intensity={1} />

            <EffectComposer autoClear={false}>
                <Pixelation granularity={6} />
            </EffectComposer>
            <group ref={focus}>
                {props.farm && props.farm.map((rows, x) => {
                    return rows.map((cell, y) => {
                        // Using a composite key for each cell
                        const key = `cell-${x}-${y}`;
                        return <Cell key={key} item={cell} />;
                    });
                })}
            </group>
            {/* <primitive
                        ref={mesh}
                        object={gltf.scene}
                        position={[0, 0, 0]}
                    /> */}

            <mesh receiveShadow position-y={-0.75} rotation-x={-Math.PI * 0.5}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#748E63" />
            </mesh>
        </>
    );
};

export default Farm;
