import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { planets } from './solarSystemData';
import './App.css';

// Komponent dla pojedynczej planety
function Planet({ name, radius, distance, speed, color, ring }) {
  const meshRef = useRef();
  const ringRef = useRef();

  // useFrame to hook do animacji, uruchamia się co klatkę
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // Uproszczony ruch orbitalny
    const angle = (elapsedTime * speed) / 1000; // Dzielimy, żeby spowolnić
    meshRef.current.position.x = distance * Math.cos(angle);
    meshRef.current.position.z = distance * Math.sin(angle);
    // Rotacja własna planety
    meshRef.current.rotation.y += 0.005;

    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position);
      ringRef.current.rotation.x = -0.5 * Math.PI; // Nachylenie pierścienia
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius * 2, 32, 32]} /> {/* Mnożymy promień dla lepszej widoczności */}
        <meshStandardMaterial color={color} />
      </mesh>
      {ring && (
        <mesh ref={ringRef}>
          <ringGeometry args={[radius * 3, radius * 4, 64]} />
          <meshBasicMaterial color="#7f7f7f" side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Orbita jako linia */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
         <ringGeometry args={[distance, distance + 0.5, 128]} />
         <meshBasicMaterial color="#333" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// Główny komponent aplikacji
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 200, 600], fov: 75 }}>
        {/* Oświetlenie */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={100000} color="white" />

        {/* Gwiazdy w tle */}
        <Stars radius={3000} depth={50} count={10000} factor={10} />

        {/* Słońce */}
        <mesh>
          <sphereGeometry args={[20, 32, 32]} />
          <meshBasicMaterial color="yellow" />
        </mesh>

        {/* Planety */}
        {planets.map((planet) => (
          <Planet key={planet.name} {...planet} />
        ))}
      </Canvas>
    </div>
  );
}

export default App;