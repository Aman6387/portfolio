import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { enhanceCharacterMaterials } from "./materialEnhancer";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  getAborted?: () => boolean
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      let blobUrl: string | null = null;
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        if (getAborted?.()) {
          resolve(null);
          return;
        }
        blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            if (getAborted?.()) {
              if (blobUrl) URL.revokeObjectURL(blobUrl);
              dracoLoader.dispose();
              resolve(null);
              return;
            }
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            enhanceCharacterMaterials(character);
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            if (getAborted?.()) {
              if (blobUrl) URL.revokeObjectURL(blobUrl);
              dracoLoader.dispose();
              resolve(null);
              return;
            }
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            blobUrl = null;
            dracoLoader.dispose();
            resolve(gltf);
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            dracoLoader.dispose();
            reject(error);
          }
        );
      } catch (err) {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
