import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
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
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.frustumCulled = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            m.needsUpdate = false;
          });
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    phase.current = "walk";
    actions[WALK_CLIP]?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();

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
    if (!model || !root) return;

    const faceTarget = phase.current === "walk" ? WALK_ROTATION : FACE_ROTATION;
    model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, faceTarget, delta * 5);

    if (phase.current !== "walk") return;

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "50px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  return (
    <div className="hero-scene" ref={wrapRef}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0.5, isMobile ? 6.2 : 5.5], fov: isMobile ? 42 : 38 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.25)}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.75 }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 8, 4]} intensity={1.1} />
        <directionalLight position={[-3, 4, -2]} intensity={0.35} color="#c2a4ff" />
        <Suspense fallback={null}>
          {!reducedMotion.current && <HoodieCharacter start={start} />}
        </Suspense>
      </Canvas>
      <div className="hero-scene-glow" aria-hidden="true" />
    </div>
  );
};

export default HeroScene;
