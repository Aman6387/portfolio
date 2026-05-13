import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import {
  isLikelyMobileViewport,
  prefersReducedMotion,
} from "../utils/performanceHelpers";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/Unity.webp",
  "/images/GIT.webp",
  "/images/csharp.webp",
  "/images/VSCode.webp",
  "/images/Dev.webp",
  "/images/debug.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const scalesCycle = [0.7, 1, 0.8, 1, 1] as const;

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  position: [number, number, number];
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
  geometry: THREE.SphereGeometry;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  position,
  material,
  isActive,
  geometry,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    const body = api.current;
    if (!body) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(body.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    body.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={position}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={geometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

function seededPosition(i: number): [number, number, number] {
  const x = ((((i * 73) % 100) / 100) * 2 - 1) * 18;
  const y = ((((i * 41) % 100) / 100) * 2 - 1) * 18 - 12;
  const z = ((((i * 59) % 100) / 100) * 2 - 1) * 14;
  return [x, y, z];
}

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [qualityTier, setQualityTier] = useState<"high" | "low">(() =>
    prefersReducedMotion() || isLikelyMobileViewport() ? "low" : "high"
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setQualityTier(
        mq.matches || mqMotion.matches ? "low" : "high"
      );
    };
    sync();
    mq.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsActive(Boolean(entry?.isIntersecting)),
      { threshold: 0.06, rootMargin: "32px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sphereCount = qualityTier === "low" ? 8 : 16;
  const segments = qualityTier === "low" ? 14 : 22;
  const enableShadows = qualityTier === "high";
  const enableAo = qualityTier === "high";

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(1, segments, segments),
    [segments]
  );

  useEffect(() => {
    return () => sphereGeometry.dispose();
  }, [sphereGeometry]);

  const sphereConfigs = useMemo(
    () =>
      Array.from({ length: sphereCount }, (_, i) => ({
        scale: scalesCycle[i % scalesCycle.length],
        position: seededPosition(i),
      })),
    [sphereCount]
  );

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  const frameLoop = isActive ? ("always" as const) : ("never" as const);

  return (
    <div ref={sectionRef} className="techstack">
      <h2> Tools & stack</h2>

      <Canvas
        shadows={enableShadows}
        frameloop={frameLoop}
        gl={{
          alpha: true,
          stencil: false,
          depth: false,
          antialias: qualityTier === "high",
          powerPreference: "high-performance",
        }}
        dpr={qualityTier === "low" ? [1, 1.35] : [1, 2]}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => {
          state.gl.toneMappingExposure = 1.5;
        }}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow={enableShadows}
          shadow-mapSize={enableShadows ? [512, 512] : [256, 256]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {sphereConfigs.map((cfg, i) => (
            <SphereGeo
              key={`${qualityTier}-${i}`}
              scale={cfg.scale}
              position={cfg.position}
              material={materials[i % materials.length]}
              isActive={isActive}
              geometry={sphereGeometry}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        {enableAo ? (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        ) : null}
      </Canvas>
    </div>
  );
};

export default TechStack;
