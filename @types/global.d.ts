import { extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customMaterial: ReactThreeFiber.Object3DNode<
        CustomMaterial,
        typeof CustomMaterial
      >;
    }
  }
}

extend({ customMaterial });
