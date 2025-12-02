// @ts-nocheck
"use client";
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AccumulativeShadows, Environment, Float, OrbitControls, RandomizedLight, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import styles from '@/app/page.module.css';

function Ornaments() {
  const count = 160;
  const positions = useMemo(() => {
    const pts: Array<[number, number, number, number]> = [];
    // Distribute ornaments around a conical tree surface
    for (let i = 0; i < count; i++) {
      const h = Math.random(); // 0..1 height
      const radius = (1 - Math.pow(h, 0.8)) * 1.3 + 0.05;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = h * 2.4 - 1.0;
      const scale = 0.03 + Math.random() * 0.03;
      pts.push([x, y, z, scale]);
    }
    return pts;
  }, []);
  const colors = ['#d4af37', '#f5f2e8', '#a6b1ff', '#ff6b6b', '#7bd389', '#ffd166'];
  return (
    <group>
      {positions.map(([x, y, z, s], idx) => (
        <mesh position={[x, y, z]} scale={s} key={idx} castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color={colors[idx % colors.length]}
            metalness={0.85}
            roughness={0.15}
            clearcoat={0.6}
            clearcoatRoughness={0.25}
            reflectivity={0.9}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function Garland() {
  // Spiral garland around the tree
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 8;
    const samples = 700;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const angle = t * Math.PI * 2 * turns;
      const h = t * 2.3 - 0.95;
      const r = (1 - t) * 1.2 + 0.08;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, h, Math.sin(angle) * r));
    }
    return pts;
  }, []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tube = useMemo(() => curve.getPoints(1500), [curve]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 700, 0.012, 8, false]} />
        <meshStandardMaterial emissive={'#ffd966'} emissiveIntensity={1.8} color={'#3a2a00'} />
      </mesh>
      <PointsAlongCurve points={tube} />
    </group>
  );
}

function PointsAlongCurve({ points }: { points: THREE.Vector3[] }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      arr[i * 3] = points[i].x;
      arr[i * 3 + 1] = points[i].y;
      arr[i * 3 + 2] = points[i].z;
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, [points]);
  const colors = ['#fff0a6', '#ffe6c0', '#fff6d6'];
  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.025} sizeAttenuation color={colors[0]} transparent opacity={0.95} />
    </points>
  );
}

function PineNeedles() {
  // Instanced cones as needles covering a conical volume
  const instances = 4000;
  const geometry = useMemo(() => new THREE.ConeGeometry(0.006, 0.04, 6), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0c3b2e',
        roughness: 0.8,
        metalness: 0.05
      }),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const matrix = new THREE.Matrix4();
  const positions = useMemo(() => {
    const data: Array<[number, number, number, number, number]> = [];
    for (let i = 0; i < instances; i++) {
      const h = Math.random();
      const r = (1 - Math.pow(h, 0.85)) * 1.3 * (0.95 + Math.random() * 0.1);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = h * 2.5 - 1.1;
      const ry = Math.random() * Math.PI * 2;
      const rx = Math.random() * 0.6 - 0.3;
      data.push([x, y, z, rx, ry]);
    }
    return data;
  }, []);
  return (
    <instancedMesh args={[geometry, material, instances]}>
      {positions.map(([x, y, z, rx, ry], i) => {
        dummy.position.set(x, y, z);
        dummy.rotation.set(rx, ry, 0);
        dummy.updateMatrix();
        return <primitive key={i} object={dummy} matrix={dummy.matrix.clone()} />;
      })}
    </instancedMesh>
  );
}

function StarTopper() {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh position={[0, 1.45, 0]} scale={0.16} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={'#ffd700'}
          metalness={1}
          roughness={0.2}
          emissive={'#ffdb70'}
          emissiveIntensity={0.8}
          clearcoat={0.8}
        />
      </mesh>
      <Sparkles position={[0, 1.45, 0]} count={30} scale={0.6} size={3} speed={0.6} color={'#fff3b0'} />
    </Float>
  );
}

function Tree() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Trunk */}
      <mesh position={[0, -1.05, 0]} scale={[0.12, 0.35, 0.12]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 2, 12]} />
        <meshStandardMaterial color={'#4e2e19'} roughness={0.9} />
      </mesh>
      {/* Conical body shadow receiver */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.55, 64]} />
        <meshBasicMaterial color={'#000'} transparent opacity={0.35} />
      </mesh>
      <PineNeedles />
      <Garland />
      <Ornaments />
      <StarTopper />
    </group>
  );
}

export default function TreeCanvas() {
  return (
    <div className={styles.canvasWrap}>
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        camera={{ position: [0, 0.8, 3.6], fov: 40 }}
      >
        <color attach="background" args={[0x000000]} />
        <fog attach="fog" args={[0x000000, 6, 10]} />

        {/* Soft ambient */}
        <ambientLight intensity={0.25} />

        {/* Lux key lights */}
        <directionalLight
          position={[2.5, 3.5, 2.5]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-3, 2.5, 1]} intensity={0.8} color={'#7cc8ff'} />
        <pointLight position={[0, 1.2, 0]} intensity={1.4} color={'#ffd27f'} distance={6} />

        {/* Subtle moving rim lights */}
        <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.2}>
          <pointLight position={[0.8, 1.6, -1.2]} intensity={0.8} color={'#8ab6ff'} distance={5} />
        </Float>
        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
          <pointLight position={[-1.1, 1.2, 1.1]} intensity={0.9} color={'#ffb3a3'} distance={5} />
        </Float>

        {/* Shadows accumulation under tree */}
        <AccumulativeShadows temporal frames={60} alphaTest={0.85} scale={8} color={'#0a0a0a'} opacity={0.8}>
          <RandomizedLight amount={8} radius={6} ambient={0.2} intensity={0.6} position={[2, 3, 2]} bias={0.001} />
        </AccumulativeShadows>

        <Tree />

        {/* Stars subtle background */}
        <Stars radius={60} depth={40} count={6000} factor={2} saturation={0} fade speed={0.6} />

        {/* Realistic environment reflections */}
        <Environment preset="city" background={false} />

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(Math.PI / 2) + 0.15}
        />
      </Canvas>
      <div className={styles.vignette} />
    </div>
  );
}

