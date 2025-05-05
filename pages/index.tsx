import dynamic from "next/dynamic";
import Head from "next/head";
import { Vector3 } from "three";
import { Html } from "@react-three/drei";
import {
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useLayoutEffect,
  Suspense,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend, addEffect } from "@react-three/fiber";

import RoundedBoxGeometry from "./../boxgeo.js";

import { useMediaQuery } from "react-responsive";

import EnsembleImage from "../component/EnsembleImage";
extend({ RoundedBoxGeometry });

interface Props {
  rotation: THREE.Euler;
  length: number;
  position: THREE.Vector3;
}
type Ref = THREE.Mesh;

const Cyl = forwardRef<Ref, Props>(({ rotation, length, position }, ref) => (
  <mesh ref={ref} rotation={rotation} position={position}>
    <cylinderGeometry args={[0.03, 0.03, length, 16]} />
    <meshStandardMaterial color="white" />
  </mesh>
));

function Home() {
  const intensity = 0.1;
  const radius = 0.9;
  const luminanceThreshold = 1;
  const luminanceSmoothing = 1;
  const options = useMemo(() => {
    return {
      progress: { value: 0, min: 0, max: 1, step: 0.1 },
      z: { value: 10, min: 0, max: 20, step: 1 },
      maxpolarangle: { value: 0.85, min: 0, max: 1, step: 0.01 },
      x: { value: 0, min: 0, max: 50, step: 10 },
    };
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const start = Date.now();
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // useEffect(() => {
  //   // Fonction pour détecter si on est sur mobile
  //   // const isMobile = () => {
  //   //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //   //     navigator.userAgent
  //   //   );
  //   // };

  //   // Fonction pour forcer le mode paysage
  //   const forceLandscape = async () => {
  //     if (isMobile()) {
  //       // On applique uniquement sur mobile
  //       try {
  //         if (screen.orientation && "lock" in screen.orientation) {
  //           await (screen.orientation as any).lock("landscape");
  //           alert(screen.orientation.type);
  //         }
  //       } catch (err) {
  //         alert(err);
  //         console.log("Orientation lock failed:", err);
  //       }
  //     }
  //   };

  //   // Appliquer au chargement
  //   // forceLandscape();

  //   // Réappliquer lors des changements d'orientation
  //   // window.addEventListener('orientationchange', forceLandscape);

  //   return () => {
  //     // window.removeEventListener('orientationchange', forceLandscape);
  //   };
  // }, []);

  const handleLockOrientation = async () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      try {
        // Demander le mode plein écran d'abord
        await document.documentElement.requestFullscreen();

        // Puis verrouiller l'orientation
        if (screen.orientation && "lock" in screen.orientation) {
          await (screen.orientation as any).lock("landscape");
          // alert(screen.orientation.type);
        }
      } catch (err) {
        alert(err);
        console.log("Orientation lock failed:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <>
      {/* <CookieConsent /> */}
      <Head>
        <title>Exemple A.PICHAT</title>
        <link rel="shortcut icon" href="/slide/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="orientation" content="landscape" />
      </Head>

      {/* {!isMobile && ( */}
      <>
        <div
          id="menu"
          className="flex flex-col space-y-1 justify-center fixed top-2 right-2 bg-white rounded-full px-2 m-1 z-50 cursor-pointer"
          style={{
            height: "32px",
            width: "32px",
          }}
        >
          <div
            className="w-full bg-black"
            style={{
              height: "2px",
            }}
          ></div>
          <div
            style={{
              height: "2px",
            }}
            className="w-full bg-black"
          ></div>
          <div
            style={{
              height: "2px",
            }}
            className="w-full bg-black"
          ></div>
        </div>
        <div
          id="div_canvas"
          style={{
            background: "black",
            height: "100vh",
            width: "100vw",
            position: "fixed",
          }}
        >
          <Canvas
            gl={{ antialias: true }}
            camera={{
              near: 0.1,
              far: 20000,
              zoom: 1,
              position: [0, 0, 20],
              // @ts-expect-error TS(2322): Type '{ near: number; far: number; zoom: number; p... Remove this comment to see the full error message
              maxPolarAngle: 0.85,
              frameloop: isMobile() ? "demand" : "always",
            }}
          >
            <Suspense fallback={<Delayed />}>
              <TextureScene start={start} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>
        <div className="wrapGreybar">
          <div className="greybar"></div>
        </div>
        {isMobile() && (
          <button
            onClick={handleLockOrientation}
            className="fixed top-4 left-4 z-50 bg-white p-2 rounded text-black"
          >
            {isFullscreen
              ? "Quitter le mode paysage"
              : "Passer en mode paysage"}
          </button>
        )}
      </>
      {/* )} */}

      {/* {isMobile && (
        <div
          style={{
            backgroundColor: "white",
            height: "100vh",
            width: "100wh",
            color: "black",
            textAlign: "center",
            lineHeight: "100vh",
          }}
        >
          <span
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              lineHeight: "normal",
            }}
          >
            Site non optimisé pour Smartphone. Merci de revenir consulter cette
            page sur PC !
          </span>
        </div>
      )} */}
    </>
  );
}

const Delayed = ({ start }: any) => {
  return (
    <>
      <Html center className="loading" children="Chargement..." />
    </>
  );
};

export function TextureScene({ start, isMobile }: any) {
  var camera_x;
  var tt = null;
  const ref33 = useRef();

  useEffect(() => {
    // Limiter à 30 FPS
    if (isMobile()) {
      const interval = 1000 / 30; // 33.33ms par frame
      let then = performance.now();

      const unsubscribe = addEffect(() => {
        const now = performance.now();
        const delta = now - then;

        if (delta < interval) {
          return false; // Skip this frame
        }

        then = now - (delta % interval);
        return true; // Render this frame
      });

      return () => unsubscribe();
    }
  }, []);

  useFrame((state) => {
    camera_x = state.camera.position.x;
  });

  useEffect(() => {
    const millis = Date.now() - start;

    console.log(`seconds elapsed = ${millis / 1000}`);
  }, []);

  function gaussianRand() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
      rand += Math.random();
    }

    return rand / 6;
  }
  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={45} penumbra={0} />
      {/* <axesHelper args={[5]} /> */}
      <EnsembleImage
        position={new THREE.Vector3(0, 0, -20)}
        camera_x={camera_x}
      />

      {[...Array(3)].map((x, i) => {
        return (
          <>
            <TraitBlanc
              ref={ref33}
              key={Math.random()}
              isMobile={isMobile()}
              // @ts-expect-error TS(2740): Type 'number[]' is missing the following propertie... Remove this comment to see the full error message
              rotation={[Math.PI * gaussianRand(), Math.PI * gaussianRand(), 0]}
            />

            {/* <Ttext /> */}
          </>
        );
      })}
    </>
  );
}

interface Props2 {
  rotation: THREE.Euler;
  position: THREE.Vector3;
  isMobile: boolean;
}
type Ref2 = THREE.Mesh;
const TraitBlanc = forwardRef<Ref2, Props2>(
  ({ rotation, position, isMobile }, ref) => {
    const ref2 = useRef<THREE.Mesh>();
    let points = [];
    let direction: any;
    //vitesse de déplacement
    let speed = 0.1 * (1 + 2 * Math.random());
    //espace entre les deux points
    let llength;
    //espace entre les deux points
    let length = 1 + 5 * Math.random();
    let posCercle = (Math.PI * Math.random()) / 4;

    let centreSphere1 = [
      25 * Math.random(),
      25 * Math.random(),
      25 * Math.random(),
    ];
    // let centreSphere2=[];

    let point2;

    let point1;

    useLayoutEffect(() => {
      Inittt();
    }, []);

    function Inittt() {
      posCercle = (Math.PI * Math.random()) / 4;

      point2 = [
        centreSphere1[0] + 50 * Math.cos(posCercle),
        centreSphere1[1] + 50 * Math.sin(posCercle),
        0,
      ];
      point1 = [
        centreSphere1[0] + 100 * Math.cos(posCercle) * length,
        centreSphere1[1] + 100 * Math.sin(posCercle) * length,
        0,
      ];

      direction = [
        point2[0] - point1[0],
        point2[1] - point1[1],
        point2[2] - point1[2],
      ];

      llength = (direction[0] + direction[1] + direction[2]) / 3;

      direction[0] = speed * (direction[0] / llength);

      direction[1] = speed * (direction[1] / llength);

      direction[2] = speed * (direction[2] / llength);

      points = [
        new Vector3(point1[0], point1[1], point1[2]),
        new Vector3(point2[0], point2[1], point2[2]),
      ];
      if (ref2.current) {
        ref2.current.geometry.setFromPoints(points);

        // @ts-expect-error TS(2363): The right-hand side of an arithmetic operation mus... Remove this comment to see the full error message
        ref2.current.rotation.z = (Math.PI * [2 * Math.random() - 1]) / 4;
      }
    }

    useFrame(() => {
      if (ref2.current) {
        ref2.current.geometry.translate(
          -direction[0],
          -direction[1],
          -direction[2]
        );
      }
    });

    return (
      // @ts-expect-error TS(2322): Type 'MutableRefObject<Mesh<BufferGeometry<NormalB... Remove this comment to see the full error message
      <line key={Math.random()} ref={ref2}>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial linewidth={isMobile ? 1.0 : 10.0} color="white" />
      </line>
    );
  }
);

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
