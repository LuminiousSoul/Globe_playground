import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const PanelContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: rgba(30, 30, 40, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  z-index: 1200;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

const PanelTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const PanelContent = styled.div`
  padding: 30px;
  max-height: 60vh;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionIcon = styled.span`
  font-size: 1.3rem;
`;

const InfoText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
`;

const StatValue = styled.div`
  color: #4CAF50;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
`;

const GestureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GestureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const GestureInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GestureIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const GestureText = styled.div`
  flex: 1;
`;

const GestureTitle = styled.div`
  color: white;
  font-weight: bold;
  margin-bottom: 2px;
  font-size: 0.9rem;
`;

const GestureDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const GestureAction = styled.div`
  color: #4CAF50;
  font-size: 0.8rem;
  font-weight: bold;
`;

const CoordinatesDisplay = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
`;

const CoordinateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CoordinateLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const CoordinateValue = styled.span`
  color: #4CAF50;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const InfoPanel = ({ isVisible, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globeStats, setGlobeStats] = useState({
    zoomLevel: 5,
    rotationX: 0,
    rotationY: 0,
    currentLayer: 'OpenStreetMap',
    renderFPS: 60,
    triangles: 8192,
    textures: 4
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate dynamic stats updates
      setGlobeStats(prev => ({
        ...prev,
        renderFPS: 58 + Math.floor(Math.random() * 5),
        rotationY: prev.rotationY + 0.01
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const gestureControls = [
    {
      icon: '✋',
      title: 'Open Palm',
      description: 'Toggle main menu',
      action: 'Menu'
    },
    {
      icon: '👊',
      title: 'Fist',
      description: 'Reset globe to default view',
      action: 'Reset'
    },
    {
      icon: '👉',
      title: 'Point',
      description: 'Fly to pointed location',
      action: 'Navigate'
    },
    {
      icon: '✌️',
      title: 'Two Fingers',
      description: 'Toggle information panel',
      action: 'Info'
    },
    {
      icon: '👋',
      title: 'Swipe',
      description: 'Rotate globe in swipe direction',
      action: 'Rotate'
    },
    {
      icon: '🤏',
      title: 'Pinch',
      description: 'Zoom in or out',
      action: 'Zoom'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <PanelContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <PanelHeader>
            <PanelTitle>
              <span>ℹ️</span>
              Globe Information
            </PanelTitle>
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>
          </PanelHeader>

          <PanelContent>
            <Section>
              <SectionTitle>
                <SectionIcon>🌍</SectionIcon>
                Globe Status
              </SectionTitle>
              <StatsGrid>
                <StatCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <StatValue>{globeStats.renderFPS}</StatValue>
                  <StatLabel>FPS</StatLabel>
                </StatCard>
                <StatCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <StatValue>{globeStats.triangles}</StatValue>
                  <StatLabel>Triangles</StatLabel>
                </StatCard>
                <StatCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <StatValue>{globeStats.textures}</StatValue>
                  <StatLabel>Textures</StatLabel>
                </StatCard>
                <StatCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <StatValue>WebGL</StatValue>
                  <StatLabel>Renderer</StatLabel>
                </StatCard>
              </StatsGrid>
            </Section>

            <Section>
              <SectionTitle>
                <SectionIcon>📍</SectionIcon>
                Current Position
              </SectionTitle>
              <CoordinatesDisplay>
                <CoordinateRow>
                  <CoordinateLabel>Latitude:</CoordinateLabel>
                  <CoordinateValue>40.7128° N</CoordinateValue>
                </CoordinateRow>
                <CoordinateRow>
                  <CoordinateLabel>Longitude:</CoordinateLabel>
                  <CoordinateValue>74.0060° W</CoordinateValue>
                </CoordinateRow>
                <CoordinateRow>
                  <CoordinateLabel>Zoom Level:</CoordinateLabel>
                  <CoordinateValue>{globeStats.zoomLevel.toFixed(1)}</CoordinateValue>
                </CoordinateRow>
                <CoordinateRow>
                  <CoordinateLabel>Rotation X:</CoordinateLabel>
                  <CoordinateValue>{globeStats.rotationX.toFixed(2)}°</CoordinateValue>
                </CoordinateRow>
                <CoordinateRow>
                  <CoordinateLabel>Rotation Y:</CoordinateLabel>
                  <CoordinateValue>{globeStats.rotationY.toFixed(2)}°</CoordinateValue>
                </CoordinateRow>
                <CoordinateRow>
                  <CoordinateLabel>Layer:</CoordinateLabel>
                  <CoordinateValue>{globeStats.currentLayer}</CoordinateValue>
                </CoordinateRow>
              </CoordinatesDisplay>
            </Section>

            <Section>
              <SectionTitle>
                <SectionIcon>👋</SectionIcon>
                Gesture Controls
              </SectionTitle>
              <GestureList>
                {gestureControls.map((control, index) => (
                  <GestureItem
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <GestureInfo>
                      <GestureIcon>{control.icon}</GestureIcon>
                      <GestureText>
                        <GestureTitle>{control.title}</GestureTitle>
                        <GestureDescription>{control.description}</GestureDescription>
                      </GestureText>
                    </GestureInfo>
                    <GestureAction>{control.action}</GestureAction>
                  </GestureItem>
                ))}
              </GestureList>
            </Section>

            <Section>
              <SectionTitle>
                <SectionIcon>ℹ️</SectionIcon>
                About
              </SectionTitle>
              <InfoText>
                WebGIS Playground is an interactive 3D globe application that uses 
                hand gesture controls for navigation. Built with React, Three.js, 
                and advanced computer vision techniques.
              </InfoText>
              <InfoText>
                <strong>Version:</strong> 1.0.0 | 
                <strong> Updated:</strong> {currentTime.toLocaleTimeString()}
              </InfoText>
            </Section>
          </PanelContent>
        </PanelContainer>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;