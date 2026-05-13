import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import "./HeroScene.css";

const MODEL_PATH = "/models/hoodie-character.glb";
const WALK_CLIP = "CharacterArmature|Walk";
const WAVE_CLIP = "CharacterArmature|Wave";
const IDLE_CLIP = "CharacterArmature|Idle";

const START_X = 5.5;
const WALK_SPEED = 2.2;
const GROUND_Y = -1.05;
const MODEL_SCALE = 1.1;
const WALK_ROTATION = -Math.PI / 2;
const FACE_ROTATION = 0;

type Phase = "waiting" | "walk" | "wave" | "idle";

type HoodieCharacterProps = {
  start: boolean;
};

function HoodieCharacter({ start }: HoodieCharacterProps) {
  const rootRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const phase = useRef<Phase>("waiting");
  const started = useRef(false);

  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions, mixer } = useAnimations(animations, modelRef);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    phase.current = "walk";

    const walk = actions[WALK_CLIP];
    walk?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();

    const onFinished = (event: { action: THREE.AnimationAction }) => {
      if (event.action === actions[WAVE_CLIP]) {
        phase.current = "idle";
        actions[WAVE_CLIP]?.fadeOut(0.25);
        actions[IDLE_CLIP]
          ?.reset()
          .setLoop(THREE.LoopRepeat, Infinity)
          .fadeIn(0.35)
          .play();
      }
    };

    mixer?.addEventListener("finished", onFinished);
    return () => mixer?.removeEventListener("finished", onFinished);
  }, [start, actions, mixer]);

  useFrame((_, delta) => {
    const root = rootRef.current;
    const model = modelRef.current;

    if (model) {
      const faceTarget =
        phase.current === "walk" ? WALK_ROTATION : FACE_ROTATION;
      model.rotation.y = THREE.MathUtils.lerp(
        model.rotation.y,
        faceTarget,
        delta * 5
      );
    }

    if (!root || phase.current !== "walk") return;

    root.position.x = Math.max(0, root.position.x - WALK_SPEED * delta);

    if (root.position.x <= 0.02) {
      root.position.x = 0;
      phase.current = "wave";

      actions[WALK_CLIP]?.fadeOut(0.2);
      const wave = actions[WAVE_CLIP];
      wave?.reset().setLoop(THREE.LoopOnce, 1);
      if (wave) wave.clampWhenFinished = true;
      wave?.fadeIn(0.25).play();
    }
  });

  return (
    <group ref={rootRef} position={[START_X, GROUND_Y, 0]}>
      <primitive
        ref={modelRef}
        object={scene}
        rotation={[0, WALK_ROTATION, 0]}
        scale={MODEL_SCALE}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

type HeroSceneProps = {
  start?: boolean;
};

const HeroScene = ({ start = true }: HeroSceneProps) => {
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  return (
    <div className="hero-scene">
      <Canvas
        camera={{ position: [0, 0.5, isMobile ? 6 : 5.5], fov: isMobile ? 42 : 38 }}
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, 2, 3]} intensity={0.8} color="#c2a4ff" />
        <pointLight position={[3, 1, 2]} intensity={0.4} color="#2ee8c0" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <HoodieCharacter start={start} />
          <ContactShadows
            position={[0, GROUND_Y, 0]}
            opacity={0.55}
            scale={12}
            blur={2.5}
            far={5}
          />
        </Suspense>
      </Canvas>
      <div className="hero-scene-glow" aria-hidden="true" />
    </div>
  );
};

export default HeroScene;
