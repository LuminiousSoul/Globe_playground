import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const MenuOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuContainer = styled(motion.div)`
  background: rgba(30, 30, 40, 0.95);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const MenuHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const MenuTitle = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  background: linear-gradient(45deg, #4CAF50, #2196F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MenuSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
`;

const MenuSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionIcon = styled.span`
  font-size: 1.5rem;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MenuItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const MenuItemText = styled.div`
  flex: 1;
`;

const MenuItemTitle = styled.div`
  color: white;
  font-weight: bold;
  margin-bottom: 4px;
`;

const MenuItemDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const MenuItemAction = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 20px;
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

const menuItems = [
  {
    id: 'reset-view',
    title: 'Reset View',
    description: 'Return to default globe position',
    icon: '🌍',
    color: '#4CAF50',
    action: 'Fist gesture',
    gesture: 'fist'
  },
  {
    id: 'toggle-layers',
    title: 'Layer Selector',
    description: 'Switch between map layers',
    icon: '🗺️',
    color: '#2196F3',
    action: 'Available',
    gesture: 'layers'
  },
  {
    id: 'fly-to-location',
    title: 'Fly to Location',
    description: 'Navigate to specific coordinates',
    icon: '📍',
    color: '#FF9800',
    action: 'Point gesture',
    gesture: 'pointing'
  },
  {
    id: 'toggle-info',
    title: 'Information Panel',
    description: 'Show/hide detailed information',
    icon: 'ℹ️',
    color: '#9C27B0',
    action: 'Two fingers',
    gesture: 'two_fingers'
  },
  {
    id: 'calibration',
    title: 'Recalibrate Gestures',
    description: 'Reset hand gesture calibration',
    icon: '🎯',
    color: '#F44336',
    action: 'Settings',
    gesture: 'calibration'
  },
  {
    id: 'fullscreen',
    title: 'Toggle Fullscreen',
    description: 'Enter/exit fullscreen mode',
    icon: '🔳',
    color: '#607D8B',
    action: 'Available',
    gesture: 'fullscreen'
  }
];

const gestureControls = [
  {
    gesture: '✋ Open Palm',
    action: 'Toggle Menu',
    description: 'Show or hide this menu'
  },
  {
    gesture: '👊 Fist',
    action: 'Reset View',
    description: 'Return to default globe position'
  },
  {
    gesture: '👉 Point',
    action: 'Fly to Location',
    description: 'Navigate to pointed location'
  },
  {
    gesture: '✌️ Two Fingers',
    action: 'Info Panel',
    description: 'Toggle information display'
  },
  {
    gesture: '👋 Swipe',
    action: 'Rotate Globe',
    description: 'Rotate in swipe direction'
  },
  {
    gesture: '🤏 Pinch',
    action: 'Zoom',
    description: 'Zoom in or out'
  }
];

const Menu = ({ isVisible, onClose }) => {
  const [activeSection, setActiveSection] = useState('main');

  const handleMenuItemClick = (item) => {
    switch (item.gesture) {
      case 'fist':
        // Trigger reset view
        if (window.globeController) {
          window.globeController.resetView();
        }
        break;
      case 'calibration':
        setActiveSection('calibration');
        break;
      case 'fullscreen':
        toggleFullscreen();
        break;
      default:
        console.log(`Menu item clicked: ${item.title}`);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const startCalibration = () => {
    console.log('Starting gesture calibration...');
    // This would trigger the calibration process in HandGestureController
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <MenuOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MenuContainer
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>

            {activeSection === 'main' && (
              <>
                <MenuHeader>
                  <MenuTitle>WebGIS Playground</MenuTitle>
                  <MenuSubtitle>Control your 3D globe with hand gestures</MenuSubtitle>
                </MenuHeader>

                <MenuSection>
                  <SectionTitle>
                    <SectionIcon>🎮</SectionIcon>
                    Quick Actions
                  </SectionTitle>
                  <MenuList>
                    {menuItems.map((item) => (
                      <MenuItem
                        key={item.id}
                        onClick={() => handleMenuItemClick(item)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MenuItemContent>
                          <MenuItemIcon color={item.color}>
                            {item.icon}
                          </MenuItemIcon>
                          <MenuItemText>
                            <MenuItemTitle>{item.title}</MenuItemTitle>
                            <MenuItemDescription>{item.description}</MenuItemDescription>
                          </MenuItemText>
                        </MenuItemContent>
                        <MenuItemAction>{item.action}</MenuItemAction>
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuSection>

                <MenuSection>
                  <SectionTitle>
                    <SectionIcon>👋</SectionIcon>
                    Gesture Controls
                  </SectionTitle>
                  <MenuList>
                    {gestureControls.map((control, index) => (
                      <MenuItem
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MenuItemContent>
                          <MenuItemText>
                            <MenuItemTitle>{control.gesture}</MenuItemTitle>
                            <MenuItemDescription>{control.description}</MenuItemDescription>
                          </MenuItemText>
                        </MenuItemContent>
                        <MenuItemAction>{control.action}</MenuItemAction>
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuSection>
              </>
            )}

            {activeSection === 'calibration' && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'white', marginBottom: '20px' }}>
                  Gesture Calibration
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
                  Recalibrate your hand gestures for better accuracy
                </p>
                <motion.button
                  onClick={startCalibration}
                  style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Calibration
                </motion.button>
                <motion.button
                  onClick={() => setActiveSection('main')}
                  style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    background: 'transparent',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '25px',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Menu
                </motion.button>
              </div>
            )}
          </MenuContainer>
        </MenuOverlay>
      )}
    </AnimatePresence>
  );
};

export default Menu;