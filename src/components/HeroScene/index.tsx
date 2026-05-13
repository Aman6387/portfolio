import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group, PerspectiveCamera } from "three";
import { getHeroSceneLayout, type HeroSceneLayout } from "./heroSceneLayout";
import "./HeroScene.css";

const MODEL_PATH = `${import.meta.env.BASE_URL}models/hoodie-character.glb`;
const WALK_CLIP = "CharacterArmature|Walk";
const WAVE_CLIP = "CharacterArmature|Wave";
const IDLE_CLIP = "CharacterArmature|Idle";

const WALK_ROTATION = -Math.PI / 2;
const FACE_ROTATION = 0;

type Phase = "waiting" | "walk" | "wave" | "idle";

function ResponsiveCamera({ layout }: { layout: HeroSceneLayout }) {
  const { camera } = useThree();

  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.fov = layout.fov;
    cam.position.set(0, layout.cameraY, layout.cameraZ);
    cam.updateProjectionMatrix();
  }, [camera, layout]);

  return null;
}

type HoodieCharacterProps = {
  start: boolean;
  layout: HeroSceneLayout;
};

function HoodieCharacter({ start, layout }: HoodieCharacterProps) {
  const rootRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const phase = useRef<Phase>("waiting");
  const started = useRef(false);
  const layoutRef = useRef(layout);
  const scaleRef = useRef(layout.modelScale);
  const startXRef = useRef(layout.startX);

  layoutRef.current = layout;

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

    const { modelScale, groundY, walkSpeed } = layoutRef.current;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, modelScale, delta * 5);
    model.scale.setScalar(scaleRef.current);
    root.position.y = THREE.MathUtils.lerp(root.position.y, groundY, delta * 5);

    const faceTarget = phase.current === "walk" ? WALK_ROTATION : FACE_ROTATION;
    model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, faceTarget, delta * 5);

    if (phase.current !== "walk") return;

    root.position.x = Math.max(0, root.position.x - walkSpeed * delta);

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
    <group ref={rootRef} position={[startXRef.current, layout.groundY, 0]}>
      <primitive
        ref={modelRef}
        object={scene}
        rotation={[0, WALK_ROTATION, 0]}
        scale={layout.modelScale}
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
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setViewport({ width, height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
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

  const layout = getHeroSceneLayout(viewport.width, viewport.height);
  const isCompact = viewport.width < 768;

  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  return (
    <div className="hero-scene" ref={wrapRef}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{
          position: [0, layout.cameraY, layout.cameraZ],
          fov: layout.fov,
        }}
        dpr={isCompact ? 1 : Math.min(window.devicePixelRatio, 1.25)}
        gl={{
          antialias: !isCompact,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.75 }}
      >
        <ResponsiveCamera layout={layout} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 8, 4]} intensity={1.1} />
        <directionalLight position={[-3, 4, -2]} intensity={0.35} color="#c2a4ff" />
        <Suspense fallback={null}>
          {!reducedMotion.current && <HoodieCharacter start={start} layout={layout} />}
        </Suspense>
      </Canvas>
      <div className="hero-scene-glow" aria-hidden="true" />
    </div>
  );
};

export default HeroScene;
