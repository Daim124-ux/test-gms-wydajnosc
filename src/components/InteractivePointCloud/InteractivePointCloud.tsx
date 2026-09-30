'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

class TouchTexture {
  size: number;
  maxAge: number;
  radius: number;
  trail: any[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;

  constructor() {
    this.size = 64;
    this.maxAge = 120;
    this.radius = 0.15;
    this.trail = [];

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.trail.forEach((point, i) => {
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      }
    });

    this.trail.forEach((point) => {
      this.drawTouch(point);
    });

    this.texture.needsUpdate = true;
  }

  addTouch(point: THREE.Vector2) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(dd * 10000, 1);
    }
    this.trail.push({ x: point.x, y: point.y, age: 0, force });
  }

  drawTouch(point: any) {
    const pos = {
      x: point.x * this.size,
      y: (1 - point.y) * this.size
    };

    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      intensity = Math.sin((1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) * (Math.PI / 2));
    }
    intensity *= point.force;

    const radius = this.size * this.radius * intensity;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

const vertexShader = `
  precision highp float;

  uniform float uTime;
  uniform float uSize;
  uniform float uDepth;
  uniform float uRandom;
  uniform sampler2D uTouch;
  
  // Instanced Attributes
  attribute vec3 offset;
  attribute float pindex;
  attribute float angle;
  attribute vec3 color; 
  attribute vec2 puv;

  varying vec3 vColor;
  varying vec2 vUv;
  
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float random(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    vUv = uv;
    
    // Docelowy kolor firmowy (żółty GMS: #ffcc33 -> RGB: 1.0, 0.8, 0.2)
    vec3 brandYellow = vec3(1.0, 0.8, 0.2);
    
    // Sprawdzamy jak bardzo piksel z oryginalnego obrazka różni się od naszego żółtego
    float distToYellow = distance(color, brandYellow);
    
    // Convert original color to grayscale (Luminosity method)
    float grey = color.r * 0.21 + color.g * 0.71 + color.b * 0.07;
    vec3 bwColor = vec3(grey + 0.15); 

    // === OBECNE ROZWIĄZANIE (Szarości + uwydatniony żółty) - zakomentowane na czas testu ===
    // if (distToYellow < 0.4) {
    //   vColor = brandYellow;
    // } else {
    //   vColor = bwColor;
    // }

    // === WERSJA TESTOWA (Pełny oryginalny kolor z obrazka) ===
    vColor = color;

    vec3 displaced = offset;

    // Randomize initial position slightly
    displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
    
    // Very subtle noise-based floating in Z
    float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.05)));
    displaced.z += rndz * (random(pindex) * 1.0 * uDepth);

    // Touch interaction from the TouchTexture
    float t = texture2D(uTouch, puv).r;
    
    // Dużo słabsze oddziaływanie (zmniejszone mnożniki)
    // Głównie delikatnie unoszą się w górę (Y) i lekko wybrzuszają do przodu (Z)
    displaced.y += t * 1.5;
    displaced.z += t * 1.0;
    
    // Bardzo minimalny, organiczny chaos (rozproszenie na boki) zamiast mocnej eksplozji
    displaced.x += cos(angle) * t * 0.5 * rndz;
    displaced.y += sin(angle) * t * 0.3 * rndz;

    // Particle size depends on noise, time, and original pixel brightness
    float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
    psize *= max(grey, 0.2); // darker pixels = smaller particles
    psize *= uSize;

    // Scale the base plane vertex by size and add offset
    vec3 finalPos = displaced + position * psize;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec3 vColor;
  varying vec2 vUv;
  
  void main() {
    // Make circular particles
    float border = 0.3;
    float radius = 0.5;
    float dist = radius - distance(vUv, vec2(0.5));
    float t = smoothstep(0.0, border, dist);
    
    if (t < 0.01) discard;
    
    gl_FragColor = vec4(vColor, t * 1.0);
  }
`;

function Particles({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [geometryData, setGeometryData] = useState<{
    offsets: Float32Array;
    colors: Float32Array;
    pindices: Float32Array;
    angles: Float32Array;
    puvs: Float32Array;
    hitAreaWidth: number;
    hitAreaHeight: number;
  } | null>(null);

  const touchTexture = useMemo(() => new TouchTexture(), []);

  const [imgTexture, setImgTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    new THREE.TextureLoader().load(imageUrl, (tex) => {
      // Zapobiega odwróceniu obrazka, jeśli to konieczne, ale domyślnie jest OK
      setImgTexture(tex);
    });

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = 180; // Grid density
      const height = Math.floor((img.height / img.width) * width);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height).data;

      const offsets = [];
      const colors = [];
      const pindices = [];
      const angles = [];
      const puvs = [];

      let pindex = 0;
      const scale = 0.12;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          const grey = r * 0.21 + g * 0.71 + b * 0.07;

          if (grey < 34) continue;

          const px = (x - width / 2) * scale;
          const py = -(y - height / 2) * scale - 1.5;
          const pz = 0;

          offsets.push(px, py, pz);
          colors.push(r / 255, g / 255, b / 255);
          pindices.push(pindex);
          angles.push(Math.random() * Math.PI * 2);

          puvs.push(x / width, 1.0 - (y / height));

          pindex++;
        }
      }

      setGeometryData({
        offsets: new Float32Array(offsets),
        colors: new Float32Array(colors),
        pindices: new Float32Array(pindices),
        angles: new Float32Array(angles),
        puvs: new Float32Array(puvs),
        hitAreaWidth: width * scale,
        hitAreaHeight: height * scale
      });
    };
  }, [imageUrl]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTouch: { value: touchTexture.texture },
    uSize: { value: 0.1 },
    uDepth: { value: 0.2 },
    uRandom: { value: 0.3 }
  }), [touchTexture.texture]);

  // Uniformy dla warstwy obrazka pod spodem
  const underlayUniforms = useMemo(() => ({
    uImage: { value: imgTexture },
    uTouch: { value: touchTexture.texture }
  }), [imgTexture, touchTexture.texture]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
    touchTexture.update();
  });

  const geometry = useMemo(() => {
    if (!geometryData) return null;
    const geo = new THREE.InstancedBufferGeometry();
    const baseGeo = new THREE.PlaneGeometry(1, 1);

    geo.setAttribute('position', baseGeo.attributes.position);
    geo.setAttribute('uv', baseGeo.attributes.uv);
    geo.setIndex(baseGeo.index);

    geo.setAttribute('offset', new THREE.InstancedBufferAttribute(geometryData.offsets, 3));
    geo.setAttribute('color', new THREE.InstancedBufferAttribute(geometryData.colors, 3));
    geo.setAttribute('pindex', new THREE.InstancedBufferAttribute(geometryData.pindices, 1));
    geo.setAttribute('angle', new THREE.InstancedBufferAttribute(geometryData.angles, 1));
    geo.setAttribute('puv', new THREE.InstancedBufferAttribute(geometryData.puvs, 2));

    geo.instanceCount = geometryData.pindices.length;

    return geo;
  }, [geometryData]);

  if (!geometryData || !geometry || !imgTexture) return null;

  return (
    <group>
      {/* Płaszczyzna tła, która odczytuje uTouch i wyświetla oryginalny obrazek! */}
      <mesh
        position={[0, -1.5, -0.5]} // Lekko z tyłu za cząsteczkami
        onPointerMove={(e) => {
          if (e.uv) touchTexture.addTouch(e.uv);
        }}
      >
        <planeGeometry args={[geometryData.hitAreaWidth, geometryData.hitAreaHeight]} />
        <shaderMaterial
          uniforms={underlayUniforms}
          transparent={true}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform sampler2D uImage;
            uniform sampler2D uTouch;
            
            void main() {
              // Obrazek oryginalny
              vec4 color = texture2D(uImage, vUv);
              // Siła dotyku w tym punkcie
              float touch = texture2D(uTouch, vUv).r;
              
              // Kolor obrazka przenika w zależności od siły dotyku (0.0 = niewidoczny, 1.0 = pełny kolor)
              // Zwiększamy nieco touch, żeby łatwiej odkrywało się tło
              float alpha = clamp(touch * 1.5, 0.0, 1.0) * color.a;
              
              gl_FragColor = vec4(color.rgb, alpha * 0.7); // 0.7 to max opacity żeby nie waliło po oczach
            }
          `}
        />
      </mesh>

      <instancedMesh ref={meshRef} args={[geometry, undefined, geometryData.pindices.length]}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
  );
}

export default function InteractivePointCloud({ imageUrl }: { imageUrl: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="w-full h-full absolute inset-0 bg-[#050505]" />;

  return (
    <div className="w-full h-full absolute inset-0 bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Particles imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
