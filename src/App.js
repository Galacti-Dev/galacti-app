import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { planets } from './solarSystemData';
import './App.css';

// Komponent dla pojedynczej planety
function Planet({ setSelectedPlanet, ...planetProps }) {
  const { name, radius, distance, speed, color, ring } = planetProps;
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = (elapsedTime * speed) / 1000;
    meshRef.current.position.x = distance * Math.cos(angle);
    meshRef.current.position.z = distance * Math.sin(angle);
    meshRef.current.rotation.y += 0.005;

    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position);
      ringRef.current.rotation.x = -0.5 * Math.PI;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation(); // Zapobiega "przeklikiwaniu" się do tła
          setSelectedPlanet(planetProps);
        }}
      >
        <sphereGeometry args={[radius * 2, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {ring && (
        <mesh ref={ringRef}>
          <ringGeometry args={[radius * 3, radius * 4, 64]} />
          <meshBasicMaterial color="#7f7f7f" side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
         <ringGeometry args={[distance, distance + 0.5, 128]} />
         <meshBasicMaterial color="#333" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// Komponent wyświetlający informacje o planecie
function PlanetInfo({ selectedPlanet }) {
  if (!selectedPlanet) return null;

  return (
    <div className="planet-info">
      <h2>{selectedPlanet.name}</h2>
      <p>Promień: {selectedPlanet.radius} x Ziemia</p>
      <p>Odległość od Słońca: {selectedPlanet.distance} mln km</p>
    </div>
  );
}


// Główny komponent aplikacji
function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
    <div 
      className="App"
      onClick={(e) => {
        // Sprawdza czy kliknięcie było na tło (canvas)
        if (e.target.tagName === 'CANVAS') {
          setSelectedPlanet(null);
        }
      }}
    >
      <PlanetInfo selectedPlanet={selectedPlanet} />
      <Canvas camera={{ position: [0, 200, 600], fov: 75 }}>
        {/* Kontrolery kamery */}
        <OrbitControls />

        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={100000} color="white" />

        <Stars radius={3000} depth={50} count={10000} factor={10} />

        <mesh>
          <sphereGeometry args={[20, 32, 32]} />
          <meshBasicMaterial color="yellow" />
        </mesh>

        {planets.map((planet) => (
          <Planet 
            key={planet.name} 
            setSelectedPlanet={setSelectedPlanet}
            {...planet} 
          />
        ))}
      </Canvas>
    </div>
  );
}

export default App;