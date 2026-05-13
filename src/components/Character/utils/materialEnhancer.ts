import * as THREE from "three";

/** Tune GLTF materials so HDR lighting and reflections read more naturally. */
export function enhanceCharacterMaterials(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const mats = Array.isArray(mesh.material)
      ? [...mesh.material]
      : [mesh.material];

    const next = mats.map((mat) => processMaterial(mesh.name, mat));

    mesh.material = Array.isArray(mesh.material) ? next : next[0];
  });
}

function processMaterial(meshName: string, mat: THREE.Material): THREE.Material {
  if (
    mat instanceof THREE.MeshPhysicalMaterial ||
    mat instanceof THREE.MeshStandardMaterial
  ) {
    tuneStandardBased(meshName, mat);
    return mat;
  }

  if (mat instanceof THREE.MeshLambertMaterial) {
    const next = lambertToPhysical(mat);
    tuneStandardBased(meshName, next);
    return next;
  }

  if (mat instanceof THREE.MeshPhongMaterial) {
    const next = phongToPhysical(mat);
    tuneStandardBased(meshName, next);
    return next;
  }

  if (mat instanceof THREE.MeshBasicMaterial) {
    const next = basicToPhysical(mat);
    tuneStandardBased(meshName, next);
    return next;
  }

  return mat;
}

function setTextureColorSpaces(mat: THREE.MeshStandardMaterial): void {
  if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
  if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
}

function tuneStandardBased(
  meshName: string,
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
): void {
  const name = meshName.toLowerCase();
  const fabricLike =
    /cloth|fabric|cotton|shirt|pant|denim|hoodie|jacket|skirt|dress|sleeve|sock|shoe|canvas|leather|boot/i.test(
      name
    );
  const skinLike =
    /skin|body|face|hand|finger|arm|leg|head|lip|brow|cheek|neck/i.test(name);
  const metalLike =
    /metal|steel|chrome|zip|buckle|chain|watch|stud|ring|foil|silver|gold/i.test(
      name
    );

  setTextureColorSpaces(mat);

  let envBoost = 1.14;
  let roughMul = 1;

  if (meshName === "screenlight") {
    envBoost = 1.25;
    roughMul = 0.92;
    mat.metalness = THREE.MathUtils.clamp(mat.metalness, 0, 0.18);
  } else if (metalLike) {
    envBoost = 1.38;
    roughMul = 0.82;
    mat.metalness = Math.max(mat.metalness, 0.28);
  } else if (fabricLike || skinLike) {
    envBoost = 1.1;
    roughMul = 1.06;
    mat.metalness = THREE.MathUtils.clamp(mat.metalness * 0.92, 0, 0.22);
  } else {
    mat.metalness = THREE.MathUtils.clamp(mat.metalness, 0, 0.45);
  }

  mat.envMapIntensity =
    (mat.envMapIntensity ?? 1) * envBoost * (fabricLike ? 0.98 : 1);
  mat.roughness = THREE.MathUtils.clamp(
    (mat.roughness ?? 0.55) * roughMul,
    metalLike ? 0.15 : 0.34,
    metalLike ? 0.72 : 0.93
  );

  if (mat instanceof THREE.MeshPhysicalMaterial) {
    if (!metalLike && meshName !== "screenlight") {
      mat.clearcoat = THREE.MathUtils.clamp(mat.clearcoat + 0.07, 0, 0.22);
      mat.clearcoatRoughness = THREE.MathUtils.clamp(
        mat.clearcoatRoughness ?? 0.42,
        0.28,
        0.62
      );
    }

    if (fabricLike && !metalLike) {
      mat.sheen = Math.max(mat.sheen, 0.22);
      mat.sheenRoughness = THREE.MathUtils.clamp(
        Math.max(mat.sheenRoughness ?? 0.55, 0.72),
        0.55,
        1
      );
      const sheenCol = mat.sheenColor ?? new THREE.Color();
      sheenCol.copy(mat.color).lerp(new THREE.Color(0xffffff), 0.12);
      mat.sheenColor = sheenCol;
    }

    if (skinLike && !metalLike && !fabricLike) {
      mat.roughness = THREE.MathUtils.clamp(mat.roughness * 0.94, 0.38, 0.78);
      mat.envMapIntensity *= 1.06;
    }
  }

  mat.needsUpdate = true;
}

function lambertToPhysical(
  mat: THREE.MeshLambertMaterial
): THREE.MeshPhysicalMaterial {
  const next = new THREE.MeshPhysicalMaterial({
    map: mat.map,
    lightMap: mat.lightMap,
    lightMapIntensity: mat.lightMapIntensity,
    aoMap: mat.aoMap,
    aoMapIntensity: mat.aoMapIntensity,
    emissive: mat.emissive.clone(),
    emissiveMap: mat.emissiveMap,
    emissiveIntensity: mat.emissiveIntensity,
    alphaMap: mat.alphaMap,
    color: mat.color.clone(),
    transparent: mat.transparent,
    opacity: mat.opacity,
    side: mat.side,
    roughness: 0.58,
    metalness: 0.04,
    envMapIntensity: 1.12,
    clearcoat: 0.06,
    clearcoatRoughness: 0.42,
  });
  mat.dispose();
  return next;
}

function phongToPhysical(
  mat: THREE.MeshPhongMaterial
): THREE.MeshPhysicalMaterial {
  const next = new THREE.MeshPhysicalMaterial({
    map: mat.map,
    lightMap: mat.lightMap,
    lightMapIntensity: mat.lightMapIntensity,
    aoMap: mat.aoMap,
    aoMapIntensity: mat.aoMapIntensity,
    emissive: mat.emissive.clone(),
    emissiveMap: mat.emissiveMap,
    emissiveIntensity: mat.emissiveIntensity,
    bumpMap: mat.bumpMap,
    bumpScale: mat.bumpScale,
    normalMap: mat.normalMap,
    normalScale: mat.normalScale?.clone?.() ?? mat.normalScale,
    displacementMap: mat.displacementMap,
    displacementScale: mat.displacementScale,
    displacementBias: mat.displacementBias,
    alphaMap: mat.alphaMap,
    color: mat.color.clone(),
    transparent: mat.transparent,
    opacity: mat.opacity,
    side: mat.side,
    roughness: THREE.MathUtils.clamp(1 - mat.shininess / 120, 0.35, 0.88),
    metalness: 0.06,
    envMapIntensity: 1.14,
    clearcoat: 0.07,
    clearcoatRoughness: 0.38,
  });
  mat.dispose();
  return next;
}

function basicToPhysical(
  mat: THREE.MeshBasicMaterial
): THREE.MeshPhysicalMaterial {
  const next = new THREE.MeshPhysicalMaterial({
    map: mat.map,
    alphaMap: mat.alphaMap,
    aoMap: mat.aoMap,
    aoMapIntensity: mat.aoMapIntensity,
    lightMap: mat.lightMap,
    lightMapIntensity: mat.lightMapIntensity,
    color: mat.color.clone(),
    transparent: mat.transparent,
    opacity: mat.opacity,
    side: mat.side,
    roughness: 0.64,
    metalness: 0.02,
    envMapIntensity: 1.08,
    clearcoat: 0.05,
    clearcoatRoughness: 0.48,
  });
  mat.dispose();
  return next;
}
