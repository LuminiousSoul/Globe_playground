import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const GlobeContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: ${props => props.cursor || 'grab'};
  
  &:active {
    cursor: grabbing;
  }
`;

const LoadingIndicator = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2rem;
  z-index: 100;
`;

const LayerInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
`;

const Globe = ({ selectedLayer, flyToLocation, globeRotation = { x: 0, y: 0 }, zoomLevel = 5 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const globeRef = useRef(null);
  const animationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Layer configurations
  const layerConfigs = {
    osm: {
      name: 'OpenStreetMap',
      color: '#4CAF50',
      texture: createOSMTexture()
    },
    satellite: {
      name: 'Satellite',
      color: '#2196F3',
      texture: createSatelliteTexture()
    },
    terrain: {
      name: 'Terrain',
      color: '#FF9800',
      texture: createTerrainTexture()
    },
    custom: {
      name: 'Custom Layer',
      color: '#9C27B0',
      texture: createCustomTexture()
    }
  };

  function createOSMTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create a stylized world map
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(0.5, '#81C784');
    gradient.addColorStop(1, '#4CAF50');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add continent-like shapes
    ctx.fillStyle = '#2E7D32';
    // North America
    ctx.fillRect(100, 150, 200, 100);
    // South America
    ctx.fillRect(150, 280, 80, 120);
    // Europe/Africa
    ctx.fillRect(450, 120, 100, 280);
    // Asia
    ctx.fillRect(600, 100, 250, 150);
    // Australia
    ctx.fillRect(800, 300, 100, 60);
    
    return new THREE.CanvasTexture(canvas);
  }

  function createSatelliteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create satellite-like texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1976D2');
    gradient.addColorStop(0.3, '#42A5F5');
    gradient.addColorStop(0.7, '#64B5F6');
    gradient.addColorStop(1, '#1976D2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add land masses in green
    ctx.fillStyle = '#2E7D32';
    ctx.globalAlpha = 0.8;
    // Continents (simplified)
    ctx.fillRect(100, 150, 200, 100);
    ctx.fillRect(150, 280, 80, 120);
    ctx.fillRect(450, 120, 100, 280);
    ctx.fillRect(600, 100, 250, 150);
    ctx.fillRect(800, 300, 100, 60);
    
    return new THREE.CanvasTexture(canvas);
  }

  function createTerrainTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create terrain-like texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FF9800');
    gradient.addColorStop(0.3, '#FFB74D');
    gradient.addColorStop(0.7, '#FFCC02');
    gradient.addColorStop(1, '#FF9800');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add elevation effect
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 30 + 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  function createCustomTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create custom purple theme
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#9C27B0');
    gradient.addColorStop(0.3, '#BA68C8');
    gradient.addColorStop(0.7, '#CE93D8');
    gradient.addColorStop(1, '#9C27B0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add geometric patterns
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = zoomLevel;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create globe
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      map: layerConfigs[selectedLayer].texture,
      bumpScale: 0.05,
      specular: new THREE.Color('grey'),
      shininess: 10
    });
    
    const globe = new THREE.Mesh(geometry, material);
    globe.castShadow = true;
    globe.receiveShadow = true;
    scene.add(globe);
    globeRef.current = globe;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    
    animate();
    setIsLoading(false);

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update globe texture when layer changes
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.material.map = layerConfigs[selectedLayer].texture;
      globeRef.current.material.needsUpdate = true;
    }
  }, [selectedLayer]);

  // Handle fly to location
  useEffect(() => {
    if (flyToLocation && globeRef.current) {
      const { lat, lng } = flyToLocation;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      // Directly set rotation for fly-to
      if (globeRef.current) {
        globeRef.current.rotation.y = theta;
        globeRef.current.rotation.x = phi - Math.PI / 2;
      }
    }
  }, [flyToLocation]);

  // Update camera zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevel;
    }
  }, [zoomLevel]);

  // Update globe rotation from props
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.rotation.x = globeRotation.x;
      globeRef.current.rotation.y = globeRotation.y;
    }
  }, [globeRotation]);

  return (
    <GlobeContainer>
      {isLoading && (
        <LoadingIndicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading 3D Globe...
        </LoadingIndicator>
      )}
      
      <LayerInfo>
        Current Layer: {layerConfigs[selectedLayer].name}
      </LayerInfo>
      
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </GlobeContainer>
  );
};

export default Globe;