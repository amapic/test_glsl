import {
  useEffect,
  useRef,
} from "react";
import { lerp, damp } from "three/src/math/MathUtils";
import {
  
  useFrame

} from "@react-three/fiber";

import {Text} from "@react-three/drei";

export default function Ttext() {
    const y = useRef(0);
    const delayClock = useRef(0);
    
    const compteurCycle = useRef(1);
    let mouseTarget = useRef({ y: 0 });

    type TypeText = typeof Text;

    const reftext = useRef<TypeText>(null!);
  
    useFrame((state, delta) => {
      
      // @ts-expect-error TS(2339): Property 'position' does not exist on type 'Forwar... Remove this comment to see the full error message
      
      reftext.current.position.y = lerp(
        
        // @ts-expect-error TS(2339): Property 'position' does not exist on type 'Forwar... Remove this comment to see the full error message
        reftext.current.position.y,
        mouseTarget.current.y,
        0.3
      );
  
      delayClock.current += delta;
  
      if (
        Math.floor(delayClock.current / 10) !=
        Math.floor((delayClock.current - delta) / 10)
      ) {
        if (compteurCycle.current == 3) {
          compteurCycle.current = 1;
        } else {
          compteurCycle.current += 1;
        }
      }
  
      if (compteurCycle.current == 3) {
        // @ts-expect-error TS(2339): Property 'outlineColor' does not exist on type 'Fo... Remove this comment to see the full error message
        reftext.current.outlineColor = "black";
      } else {
        // @ts-expect-error TS(2339): Property 'outlineColor' does not exist on type 'Fo... Remove this comment to see the full error message
        reftext.current.outlineColor = "green";
      }
    });
  
    useEffect(() => {
      const setTargetMouse = (event: any) => {
        mouseTarget.current.y += event.deltaY / 100;
      };
  
      window.addEventListener("wheel", setTargetMouse);
    });
    return (
      <>
        <Text
          ref={reftext}
          scale={[3, 3, 3]}
          anchorX="center" // default
          anchorY="middle" // default
          color="white"

          // @ts-expect-error TS(2322): Type '{ children: string; ref: MutableRefObject<Fo... Remove this comment to see the full error message
          toneMapped={false}
          position={[0, 15, 13.2]}
          font={"/slide/Roboto-Regular.ttf"}
          outlineWidth="1%"
        >
          Site réalisé avec Three.js et WebGL
        </Text>
      </>
    );
  }