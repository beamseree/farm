import { Canvas } from "@react-three/fiber";
import Farm from "./Farm";
import * as THREE from 'three'

const Scene = (props) => {
    return (
        <div className="scene">
            <Canvas
                shadows
                dpr={[1,2]}
                gl={{
                    antialias: false,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    // minFilter: THREE.LinearFilter,
                    // magFilter: THREE.NearestFilter,
                    // anisotropy: 0,
                    outputColorSpace: THREE.SRGBColorSpace
                }}
                orthographic
                camera={{
                    fov: 45,
                    zoom: 100,
                    near: 0.1,
                    far: 200,
                    position: [4, 3, 4],
                }}
            >
                <Farm farm={props.farm} ref={props.farmRef}/>

                
            </Canvas>
        </div>
    );
};

export default Scene;
