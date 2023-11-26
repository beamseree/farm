import { useEffect, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Text, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Cell = (props) => {
    const seed = useGLTF("seed.glb");
    const sunflower1 = useGLTF("sunflower01.glb");
    const sunflower2 = useGLTF("sunflower02.glb");
    const sunflower3 = useGLTF("sunflower03.glb");

    const [plant, setPlant] = useState();

    const { camera } = useThree();

    const labelRef = useRef();
    const labelRef2 = useRef();

    const [label, setLabel] = useState("");
    const [label2, setLabel2] = useState("");
    const [labelSide, setLabelSide] = useState(0);

    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        checkEdge(props.item.position);
    }, [props.item]);

    useFrame(() => {
        if (props.item.type === "empty") {
            setPlant(null);
        }
        else if (props.item.type === "sunflower") {
            if (props.item.stage === 1)
                setPlant(seed.scene)
            if (props.item.stage === 2)
                setPlant(sunflower1.scene)
            if (props.item.stage === 3)
                setPlant(sunflower2.scene)
            if (props.item.stage === 4)
                setPlant(sunflower3.scene)
        }

        if (labelSide > 0) {
            labelRef.current.lookAt(camera.position);
        }
        if (labelSide === 3) {
            labelRef2.current.lookAt(camera.position);
        }

        setRerender(!rerender);
    });

    const checkEdge = (position) => {
        if (position[0] === 0 && position[1] !== 0) {
            setLabel(`${position[1]}`);
            setLabelSide(1);
        }
        if (position[0] === 0 && position[1] === 0) {
            setLabel2(`${position[1]}`);
            setLabel(`${String.fromCharCode(97 + position[0]).toUpperCase()}`);
            setLabelSide(3);
        }
        if (position[0] !== 0 && position[1] === 0) {
            setLabel(`${String.fromCharCode(97 + position[0]).toUpperCase()}`);
            setLabelSide(2);
        }
    };

    const waterLevelColor = (water) => {
        var w1 = water / 100;
        var w2 = 1 - w1;
        var rgb = [
            Math.round(74 * w1 + 133 * w2),
            Math.round(49 * w1 + 106 * w2),
            Math.round(42 * w1 + 88 * w2),
        ];
        return (
            "#" +
            ((1 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2])
                .toString(16)
                .slice(1)
        );
    };

    const cube = new THREE.BoxBufferGeometry(1, 1, 1);
    return (
        <>
            {/* {plant != null && props.item.type !== "empty" && ( */}
            {plant != null && (
                <Clone
                    object={plant}
                    rotate={[2, 0, 0]}
                    position={[props.item.position[0], 0.5, props.item.position[1]]}
                    scale={[1.25, 1.25, 1.25]}
                />
            )}
            <mesh
                position={[props.item.position[0], 0, props.item.position[1]]}
                castShadow
            >
                <boxGeometry args={[1, 1, 1]} />
                {/* <meshStandardMaterial wireframe color="mediumpurple" /> */}
                <meshStandardMaterial
                    color={waterLevelColor(props.item.water)}
                />
                {/* <meshStandardMaterial color={"#4a312a"} /> */}
                {/* <meshWireframeMaterial color="black" /> */}
                <lineSegments>
                    <edgesGeometry args={[cube]} />
                    <meshBasicMaterial color="#2e241d" />
                </lineSegments>

            </mesh>
            {labelSide === 1 && (
                <mesh
                    ref={labelRef}
                    position={[
                        props.item.position[0] - 0.55,
                        0.75,
                        props.item.position[1],
                    ]}
                >
                    <Text fontSize={0.3} font="./Retro.ttf">
                        {label}
                    </Text>
                </mesh>
            )}
            {labelSide === 2 && (
                <mesh
                    ref={labelRef}
                    position={[
                        props.item.position[0],
                        0.75,
                        props.item.position[1] - 0.55,
                    ]}
                >
                    <Text fontSize={0.3} font="./Retro.ttf">
                        {label}
                    </Text>
                </mesh>
            )}
            {labelSide === 3 && (
                <>
                    <mesh
                        ref={labelRef}
                        position={[
                            props.item.position[0],
                            0.75,
                            props.item.position[1] - 0.55,
                        ]}
                    >
                        <Text fontSize={0.3} font="./Retro.ttf">
                            {label}
                        </Text>
                    </mesh>
                    <mesh
                        ref={labelRef2}
                        position={[
                            props.item.position[0] - 0.55,
                            0.75,
                            props.item.position[1],
                        ]}
                    >
                        <Text fontSize={0.3} font="./Retro.ttf">
                            {label2}
                        </Text>
                    </mesh>
                </>
            )}
        </>
    );
};

export default Cell;
