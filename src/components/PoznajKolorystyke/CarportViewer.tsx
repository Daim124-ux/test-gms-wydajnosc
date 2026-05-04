'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, color, isMat, colorId }: { url: string; color: string; isMat: boolean; colorId: string }) {
  // useGLTF ładuje model i materiały
  const { scene, materials } = useGLTF(url);

  // KLONOWANIE SCENY: Kluczowy krok, aby React/Three zauważył zmiany materiałów
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  const baseMatNameRef = React.useRef<string | null>(null);

  // Wzorujemy się na Twojej liście z Verge3D
  const COLORABLE_MESHES = [
    'Klapa góra',
    'Klapa front',
    'Sciana tyl',
    'Sciana lewa',
    'Sciana prawa',
    'Ramka klapy',
    'Ramka klapy1',
    'Ramka klapy2',
    'Ramka klapy3',
    'Logo pokaza',
    'Wiata_ar'
  ];

  useEffect(() => {
    if (!clonedScene || !materials || !colorId) return;

    // Funkcja normalizująca nazwy (usuwa wielkość liter i zamienia _ na spacje, by uniknąć literówek)
    const normalize = (name: string) => name.toLowerCase().replace(/_/g, ' ').trim();
    const normalizedColorableMeshes = COLORABLE_MESHES.map(normalize);

    // Krok 1: Ustalenie nazwy docelowego materiału
    let targetMatName = colorId === 'ocynk' ? "Ocynk" : `RAL${colorId.toString().replace('m', '')}`;
    if (isMat) targetMatName += " mat";

    const targetNormalized = normalize(targetMatName);
    const availableMaterials = Object.keys(materials);
    const foundName = availableMaterials.find(m => normalize(m) === targetNormalized);
    const targetMaterial = foundName ? materials[foundName] : null;

    // Krok 2: Przechodzimy przez wszystkie obiekty i nakładamy CAŁE MATERIAŁY
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const meshName = normalize(mesh.name);

        // Czy ten obiekt jest na Twojej liście do pokolorowania?
        const isColorable = normalizedColorableMeshes.includes(meshName);

        if (isColorable) {
          if (targetMaterial) {
            // Podmieniamy cały materiał (razem z jego Normal Mapami itp.)
            mesh.material = targetMaterial;
            mesh.material.needsUpdate = true;
          } else {
            // Fallback: jeśli GLB nie zawiera gotowego materiału np. "RAL3005",
            // po prostu modyfikujemy jego kolor
            const materialsList = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materialsList.forEach((mat) => {
              if ('color' in mat) {
                const standardMat = mat as THREE.MeshStandardMaterial;
                standardMat.color.set(color);
                standardMat.roughness = isMat ? 0.9 : 0.25;
                standardMat.needsUpdate = true;
              }
            });
          }
        }
      }
    });
  }, [clonedScene, materials, colorId, isMat, color]);

  return <primitive object={clonedScene} />;
}

export default function CarportViewer({ url, color, isMat, colorId }: { url: string; color: string; isMat: boolean; colorId: string }) {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={35} />

        {/* Dodatkowe światło otoczenia dla ogólnej jasności */}
        <ambientLight intensity={1.5} />

        <Suspense fallback={null}>
          <Stage
            intensity={1.5}
            preset="rembrandt"
            environment="apartment"
            shadows={{ type: 'contact', opacity: 0.2, blur: 3 }}
            adjustCamera={true}
          >
            <Model key={colorId} url={url} color={color} isMat={isMat} colorId={colorId} />
          </Stage>
        </Suspense>

        <OrbitControls
          makeDefault
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.75}
          enableZoom={true}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/cdn-assets/assets/modele_ar/wiata_rowerowa/wiata_rowerowa_ar_v19.glb');
