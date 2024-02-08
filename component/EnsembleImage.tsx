import {
  useEffect,
  useRef,
  useMemo,
  useState,
  forwardRef,
  useLayoutEffect,
} from "react";

import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import WaveShaderMaterial from "./shader";
// extend({ WaveShaderMaterial });
import { Text } from "@react-three/drei";

import Ttext from "./Ttext";
import { TextureLoader, SRGBColorSpace } from "three";
import { lerp, damp } from "three/src/math/MathUtils";
import { Physics } from "@react-three/cannon";
export default function EnsembleImage({
  position,
  camera_x,
}: {
  position: THREE.Vector3;
  camera_x: number;
}): THREE.Mesh {
  const ref = useRef<THREE.Group>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  const compteurCycle = useRef(1);

  const couche1 = useRef<THREE.Mesh>(null!);

  const couche2 = useRef<THREE.Mesh>(null!);

  const couche3 = useRef<THREE.Mesh>(null!);

  const couche3_bis = useRef<THREE.Mesh>(null!);

  const listeRef = [couche1, couche2, couche3, couche3_bis];

  var viewport = useThree((state) => state.viewport);

  const delayClock = useRef(0);

  useFrame(({ clock, camera }) => {
    mouseTarget.current.x = -lerp(mouse.current.y, 0, 0.3);
    mouseTarget.current.y = -lerp(mouse.current.x, 0, 0.3);
    ref.current.rotation.x = -mouseTarget.current.x * 0.1;
    ref.current.rotation.y = -mouseTarget.current.y * 0.1;
  });

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      mouse.current.x = lerp(
        mouse.current.x,
        event.clientX / window.screen.width,
        0.3
      );
      mouse.current.y = lerp(
        mouse.current.y,
        event.clientY / window.screen.height,
        0.3
      );
    });

    for (let i = 0; i < listeRef.length; i++) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      listeRef[i].current.material.resolution =
        window.innerHeight / window.innerWidth;
    }
  });

  useFrame((state, delta) => {
    delayClock.current += delta;

    for (let i = 0; i < listeRef.length; i++) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      listeRef[i].current.material.uTime = state.clock.getElapsedTime();
    }

    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (couche2.current.material.compteurCycle == 0) {
      for (let i = 0; i < listeRef.length; i++) {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        listeRef[i].current.material.compteurCycle = compteurCycle.current;
      }
    }

    // if (couche2.current.material.compteurCycle == 3) {
    //   for (let i = 0; i < listeRef.length; i++) {
    //     // listeRef[i].current.material.uAlphaMap = maskDesert;
    //   }
    // }

    // if (
    //   Math.floor(state.clock.getElapsedTime() / 10) !=
    //   Math.floor((state.clock.getElapsedTime() - delta) / 10)
    // ) {
    //   if (compteurCycle.current == 3) {
    //     compteurCycle.current = 1;
    //   } else {
    //     compteurCycle.current += 1;
    //   }

    //   for (let i = 0; i < listeRef.length; i++) {
    //     listeRef[i].current.material.compteurCycle = compteurCycle.current;
    //   }
    // }

    couche2.current.position.z =
      8 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche3.current.position.z =
      12 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    couche3_bis.current.position.z =
      12.1 + 1 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 10);

    state.camera.position.y =
      5 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 20);

    state.camera.lookAt(
      0,
      5 * Math.sin((2 * Math.PI * state.clock.getElapsedTime()) / 20),
      0
    );
  });

  // @ts-expect-error TS(2345): Argument of type 'typeof TextureLoader' is not ass... Remove this comment to see the full error message
  const image = useLoader(TextureLoader, "/slide/concat9.avif");
  image.colorSpace = SRGBColorSpace;

  const image_size = [1024 / 10, 742 / 10];

  // @ts-expect-error TS(2345): Argument of type 'typeof TextureLoader' is not ass... Remove this comment to see the full error message
  const mask = useLoader(TextureLoader, "/slide/mask5.avif");
  mask.colorSpace = SRGBColorSpace;

  // const maskDesert = useLoader(THREE.TextureLoader, "/slide/maskDesert.png");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // const transition_shape = useLoader(THREE.TextureLoader, "/slide/spiral.png");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // const image2 = useLoader(THREE.TextureLoader, "/slide/ds.jpg");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // const map = useLoader(THREE.TextureLoader, "/slide/terrasse.jpg");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // const image3 = useLoader(THREE.TextureLoader, "/slide/ds.jpg");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // const image1 = useLoader(THREE.TextureLoader, "/slide/nature_morte.jpg");
  // mask.colorSpace = THREE.SRGBColorSpace;

  // @ts-expect-error TS(2740): Type 'ReactElement<any, any>' is missing the follo... Remove this comment to see the full error message
  return (
    <>
      <group position={position} ref={ref}>
        <Physics allowSleep={false} gravity={[0, 0, 0]}>
          <Ttext />
        </Physics>
      </group>
    </>
  );
}
