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
import WaveShaderMaterial from "../component/shader";
extend({ WaveShaderMaterial });

import Ttext from "./Ttext"
import {TextureLoader,SRGBColorSpace} from "three";
import { lerp, damp } from "three/src/math/MathUtils";
import { Physics } from "@react-three/cannon";
export default function EnsembleImage({ position, camera_x }) {
  const ref = useRef();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const compteurCycle = useRef(1);
  const couche1 = useRef();
  const couche2 = useRef();
  const couche3 = useRef();
  const couche3_bis = useRef();
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
      listeRef[i].current.material.resolution =
        window.innerHeight / window.innerWidth;
    }
  });
  useFrame((state, delta) => {
    delayClock.current += delta;
    for (let i = 0; i < listeRef.length; i++) {
      listeRef[i].current.material.uTime = state.clock.getElapsedTime();
    }
    if (couche2.current.material.compteurCycle == 0) {
      for (let i = 0; i < listeRef.length; i++) {
        listeRef[i].current.material.compteurCycle = compteurCycle.current;
      }
    }
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
  const image = useLoader(TextureLoader, "/slide/concat9.avif");
  image.colorSpace = SRGBColorSpace;
  const image_size = [1024 / 10, 742 / 10];
  const mask = useLoader(TextureLoader, "/slide/mask5.avif");
  mask.colorSpace = SRGBColorSpace;
  return (
    <group position={position} ref={ref}>
      <Physics allowSleep={false} gravity={[0, 0, 0]}>
        <Ttext  />
      </Physics>
      <mesh ref={couche1} position={[0, 0, 4]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          uAlphaMap={image}
          uTexture={image}
          fond={true}
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          color="black"
          filigrane={false}
          _resolution={0.0}
        />
      </mesh>
      <mesh ref={couche2} position={[0, 0, 8]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          uAlphaMap={image}
          uTexture={image}
          transparent
          fond={false}
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          filigrane={false}
          color="black"
          _resolution={0.0}
        />
      </mesh>
      <mesh ref={couche3} position={[0, 0, 12]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          uAlphaMap={image}
          uTexture={image}
          transparent
          fond={false}
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          filigrane={false}
          color="black"
          _resolution={0.0}
        />
      </mesh>
      <mesh ref={couche3_bis} position={[0, 0, 12.1]}>
        <planeGeometry args={[image_size[0], image_size[1], 1, 1]} />
        <waveShaderMaterial
          uAlphaMap={image}
          uTexture={image}
          transparent
          fond={false}
          toneMapped={false}
          camera_x={camera_x}
          compteurCycle={compteurCycle.current}
          filigrane={true}
          color="black"
          _resolution={0.0}
        />
      </mesh>
    </group>
  );
}
