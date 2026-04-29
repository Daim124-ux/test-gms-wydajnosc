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

  useEffect(() => {
    if (!clonedScene || !materials || !colorId) return;

    let targetMatName = colorId === 'ocynk' ? "Ocynk" : `RAL${colorId.toString().replace('m', '')}`;
    if (isMat) targetMatName += " mat";

    const normalize = (name: string) => name.toLowerCase().replace(/_/g, ' ').trim();
    const availableMaterials = Object.keys(materials);
    const targetNormalized = normalize(targetMatName);
    const foundName = availableMaterials.find(m => normalize(m) === targetNormalized);
    const targetMaterial = foundName ? materials[foundName] : null;

    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        // TypeScript fix: material może być tablicą
        const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        const currentMatName = material?.name || "";
        
        const isColorable = 
          obj.name.toUpperCase().includes('KOLOR') || 
          currentMatName.toUpperCase().startsWith('RAL') || 
          currentMatName.toUpperCase() === 'OCYNK';

        if (isColorable) {
          if (targetMaterial) {
            mesh.material = targetMaterial;
            mesh.material.needsUpdate = true;
          } else {
            // Fallback
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

useGLTF.preload('/assets/modele_ar/wiata_rowerowa/wiata_rowerowa.glb');
