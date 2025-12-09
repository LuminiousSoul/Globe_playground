import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Globe from './components/Globe';
import HandGestureController from './components/HandGestureController';
import Menu from './components/Menu';
import LayerSelector from './components/LayerSelector';
import InfoPanel from './components/InfoPanel';
import { GestureProvider } from './utils/GestureContext';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
`;

const VideoFeed = styled.video`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
  z-index: 1000;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const GestureIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 30px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoadingScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  transition: opacity 0.5s ease;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
`;

const LoadingText = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const LoadingSubtext = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-align: center;
`;

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentGesture, setCurrentGesture] = useState('None');
  const [selectedLayer, setSelectedLayer] = useState('osm');
  const [showMenu, setShowMenu] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [flyToLocation, setFlyToLocation] = useState(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false); // optional, can track globe state
  const [isCameraAvailable, setIsCameraAvailable] = useState(true); // optional camera state
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [globeRotation, setGlobeRotation] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(5);

  const handleGestureDetected = (gesture, data = {}) => {
    setCurrentGesture(gesture);

    switch (gesture) {
      case 'open_palm':
        setShowMenu(prev => !prev);
        break;
      case 'two_fingers':
        setShowInfoPanel(prev => !prev);
        break;
      case 'fist':
        setGlobeRotation({ x: 0, y: 0 });
        setZoomLevel(5);
        break;
      case 'swipe_left':
        setGlobeRotation(prev => ({ ...prev, y: prev.y - 0.2 }));
        break;
      case 'swipe_right':
        setGlobeRotation(prev => ({ ...prev, y: prev.y + 0.2 }));
        break;
      case 'swipe_up':
        setGlobeRotation(prev => ({ ...prev, x: prev.x - 0.2 }));
        break;
      case 'swipe_down':
        setGlobeRotation(prev => ({ ...prev, x: prev.x + 0.2 }));
        break;
      case 'pinch_in':
        setZoomLevel(prev => Math.max(3, prev - 0.5));
        break;
      case 'pinch_out':
        setZoomLevel(prev => Math.min(10, prev + 0.5));
        break;
      case 'rotate':
        if (data.deltaX || data.deltaY) {
          setGlobeRotation(prev => ({
            x: prev.x + (data.deltaY || 0) * 0.01,
            y: prev.y + (data.deltaX || 0) * 0.01
          }));
        }
        break;
      case 'zoom':
        if (data.deltaZ) {
          setZoomLevel(prev => Math.max(3, Math.min(10, prev - data.deltaZ * 0.1)));
        }
        break;
      default:
        break;
    }
  };

  return (
    <GestureProvider>
      <AppContainer>
        <LoadingScreen visible={!isLoaded}>
          <LoadingText>WebGIS Playground</LoadingText>
          <LoadingSubtext>Initializing hand tracking and 3D globe...</LoadingSubtext>
        </LoadingScreen>

        {isLoaded && (
          <>
            <Globe 
              selectedLayer={selectedLayer}
              flyToLocation={flyToLocation}
              globeRotation={globeRotation}
              zoomLevel={zoomLevel}
            />

            <HandGestureController
              videoRef={videoRef}
              onGestureDetected={handleGestureDetected}
              setFlyToLocation={setFlyToLocation}
              isMenuOpen={showMenu}       
              isInfoPanelOpen={showInfoPanel}  
              isVideoOpen={showVideo}   
              isGlobeLoaded={isGlobeLoaded} 
              isCameraAvailable={isCameraAvailable} 
            />

            <VideoFeed 
              ref={videoRef} 
              visible={showVideo} 
              autoPlay 
              muted 
              playsInline 
            />

            <Menu 
              isVisible={showMenu}
              onClose={() => setShowMenu(false)}
            />

            <LayerSelector
              selectedLayer={selectedLayer}
              onLayerChange={setSelectedLayer}
              isVisible={!showMenu}
            />

            <InfoPanel 
              isVisible={showInfoPanel}
              onClose={() => setShowInfoPanel(false)}
            />

            <GestureIndicator>
              Current Gesture: {currentGesture}
            </GestureIndicator>
          </>
        )}
      </AppContainer>
    </GestureProvider>
  );
}

export default App;
