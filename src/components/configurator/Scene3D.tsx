'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import type { ComponentRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  colorHex: string;
  isAnimating?: boolean;
  modelUrl?: string;
  highlightedTarget?: string;
}

const DEFAULT_MODEL_URL = '/apps/verge-model/wiata_makieta.glb';

const normalizeName = (name: string) => name.toLowerCase().replace(/[_-]/g, ' ').trim();

const targetMatches = (mesh: THREE.Mesh, target: string) => {
  const tokens = target
    .split(/[,\n/|]+/)
    .map((item) => normalizeName(item))
    .filter(Boolean);

  if (!tokens.length) return false;

  const meshName = normalizeName(mesh.name);
  const materialNames = (Array.isArray(mesh.material) ? mesh.material : [mesh.material])
    .map((material) => normalizeName(material?.name ?? ''))
    .join(' ');
  const combinedName = `${meshName} ${materialNames}`;

  return tokens.some((token) => combinedName.includes(token));
};

function Model({ colorHex, modelUrl, highlightedTarget }: { colorHex: string; modelUrl: string; highlightedTarget?: string }) {
  const { scene } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const hasMaterialArray = Array.isArray(mesh.material);
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        const nextMaterials = materials.map((material) => {
          const mat = material.clone() as THREE.MeshStandardMaterial;
          const materialName = normalizeName(mat.name);
          const meshName = normalizeName(mesh.name);
          const isFrameMaterial = materialName.includes('ral6020')
            || materialName.includes('kolor')
            || meshName.includes('kolor')
            || meshName.includes('konstrukcja')
            || meshName.includes('frame')
            || meshName.includes('steel');
          const isHighlighted = highlightedTarget ? targetMatches(mesh, highlightedTarget) : false;

          if (isFrameMaterial && mat.color) {
            mat.color.set(colorHex);
            mat.metalness = 0.48;
            mat.roughness = 0.34;
          }

          if (isHighlighted && mat.color) {
            mat.emissive = new THREE.Color('#1765e8');
            mat.emissiveIntensity = 0.78;
            mat.color.lerp(new THREE.Color('#6ea1ff'), 0.32);
            mat.metalness = Math.min(1, (mat.metalness ?? 0) + 0.12);
            mat.roughness = Math.max(0.18, (mat.roughness ?? 0.34) - 0.12);
          } else if ('emissive' in mat) {
            mat.emissive = new THREE.Color('#000000');
            mat.emissiveIntensity = 0;
          }

          mat.needsUpdate = true;
          return mat;
        });

        mesh.material = hasMaterialArray ? nextMaterials : nextMaterials[0];
      }
    });
  }, [clonedScene, colorHex, highlightedTarget]);

  return <primitive object={clonedScene} />;
}

// A component that handles dynamic camera rotation for the "cinematic presentation"
function CinematicCamera({ isAnimating }: { isAnimating: boolean }) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  useFrame(() => {
    if (controlsRef.current) {
      if (isAnimating) {
        // Fast, smooth rotation for presentation
        controlsRef.current.autoRotateSpeed = THREE.MathUtils.lerp(controlsRef.current.autoRotateSpeed, 5.0, 0.05);
        // Slightly zoom in/out or move polar angle for dramatic effect
        controlsRef.current.maxPolarAngle = THREE.MathUtils.lerp(controlsRef.current.maxPolarAngle, Math.PI / 2.2, 0.01);
        controlsRef.current.minPolarAngle = THREE.MathUtils.lerp(controlsRef.current.minPolarAngle, Math.PI / 3, 0.01);
      } else {
        // Normal slow rotation
        controlsRef.current.autoRotateSpeed = THREE.MathUtils.lerp(controlsRef.current.autoRotateSpeed, 0.5, 0.05);
        controlsRef.current.maxPolarAngle = THREE.MathUtils.lerp(controlsRef.current.maxPolarAngle, Math.PI / 2.05, 0.01);
        controlsRef.current.minPolarAngle = THREE.MathUtils.lerp(controlsRef.current.minPolarAngle, Math.PI / 4, 0.01);
      }
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault 
      minPolarAngle={Math.PI / 4} 
      maxPolarAngle={Math.PI / 2.05} 
      enableZoom={true} 
      minDistance={3} 
      maxDistance={12}
      autoRotate
      autoRotateSpeed={0.5}
      enablePan={false}
      dampingFactor={0.05}
    />
  );
}

export function Scene3D({ colorHex, isAnimating = false, modelUrl = DEFAULT_MODEL_URL, highlightedTarget }: Scene3DProps) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows camera={{ position: [5, 2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <ambientLight intensity={0.85} color="#ffffff" />
          <spotLight position={[10, 15, 10]} angle={0.38} penumbra={1} intensity={2.2} castShadow shadow-bias={-0.0001} color="#fffdf8" />
          <spotLight position={[-10, 7, -8]} angle={0.5} penumbra={1} intensity={1.1} color="#dce8ff" />
          <pointLight position={[0, 4, 7]} intensity={0.8} color="#ffffff" />

          <Center position={[0, -0.8, 0]}>
            <Model colorHex={colorHex} modelUrl={modelUrl} highlightedTarget={highlightedTarget} />
          </Center>

          <ContactShadows position={[0, -0.8, 0]} opacity={0.32} scale={15} blur={2.8} far={4} color="#25282b" />
          
          <CinematicCamera isAnimating={isAnimating} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(DEFAULT_MODEL_URL);
