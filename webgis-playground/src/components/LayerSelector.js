import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const SelectorContainer = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const SelectorTitle = styled.h3`
  color: white;
  margin: 0 0 15px 0;
  font-size: 16px;
  text-align: center;
  opacity: 0.9;
`;

const LayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LayerButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  padding: 12px 16px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const LayerIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.color || '#666'};
  margin-right: 10px;
`;

const LayerInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ActiveIndicator = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4CAF50;
`;

const GestureHint = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
`;

const layerConfigs = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    description: 'Standard map view',
    color: '#4CAF50',
    icon: '🗺️'
  },
  {
    id: 'satellite',
    name: 'Satellite',
    description: 'Satellite imagery',
    color: '#2196F3',
    icon: '🛰️'
  },
  {
    id: 'terrain',
    name: 'Terrain',
    description: 'Elevation and terrain',
    color: '#FF9800',
    icon: '🏔️'
  },
  {
    id: 'custom',
    name: 'Custom Layer',
    description: 'Custom styled map',
    color: '#9C27B0',
    icon: '🎨'
  }
];

const LayerSelector = ({ selectedLayer, onLayerChange, isVisible = true }) => {
  const handleLayerChange = (layerId) => {
    onLayerChange(layerId);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <SelectorContainer
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <SelectorTitle>Map Layers</SelectorTitle>
          
          <LayerList>
            {layerConfigs.map((layer) => (
              <LayerButton
                key={layer.id}
                active={selectedLayer === layer.id}
                onClick={() => handleLayerChange(layer.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LayerInfo>
                  <LayerIcon color={layer.color} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold' }}>{layer.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>
                      {layer.description}
                    </div>
                  </div>
                </LayerInfo>
                
                {selectedLayer === layer.id && (
                  <ActiveIndicator
                    layoutId="activeIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
              </LayerButton>
            ))}
          </LayerList>
          
          <GestureHint>
            Use "Open Palm" gesture to toggle menu
          </GestureHint>
        </SelectorContainer>
      )}
    </AnimatePresence>
  );
};

// Additional styled components for enhanced UI
const LayerStats = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const LayerSelectorEnhanced = ({ selectedLayer, onLayerChange, isVisible = true }) => {
  const [layerStats, setLayerStats] = React.useState({
    osm: { loadTime: '1.2s', resolution: '256px', lastUpdate: '2 min ago' },
    satellite: { loadTime: '2.1s', resolution: '512px', lastUpdate: '5 min ago' },
    terrain: { loadTime: '1.8s', resolution: '384px', lastUpdate: '1 min ago' },
    custom: { loadTime: '1.5s', resolution: '320px', lastUpdate: '3 min ago' }
  });

  const handleLayerChange = (layerId) => {
    onLayerChange(layerId);
    
    // Update stats
    setLayerStats(prev => ({
      ...prev,
      [layerId]: {
        ...prev[layerId],
        lastUpdate: 'just now'
      }
    }));

    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <SelectorContainer
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <SelectorTitle>Map Layers</SelectorTitle>
          
          <LayerList>
            {layerConfigs.map((layer) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: layerConfigs.indexOf(layer) * 0.1 }}
              >
                <LayerButton
                  active={selectedLayer === layer.id}
                  onClick={() => handleLayerChange(layer.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LayerInfo>
                    <LayerIcon color={layer.color} />
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{layer.icon}</span>
                        <span>{layer.name}</span>
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>
                        {layer.description}
                      </div>
                    </div>
                  </LayerInfo>
                  
                  {selectedLayer === layer.id && (
                    <ActiveIndicator
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </LayerButton>
              </motion.div>
            ))}
          </LayerList>
          
          <LayerStats>
            <StatItem>
              <span>Load Time:</span>
              <span>{layerStats[selectedLayer]?.loadTime || '1.2s'}</span>
            </StatItem>
            <StatItem>
              <span>Resolution:</span>
              <span>{layerStats[selectedLayer]?.resolution || '256px'}</span>
            </StatItem>
            <StatItem>
              <span>Last Update:</span>
              <span>{layerStats[selectedLayer]?.lastUpdate || '2 min ago'}</span>
            </StatItem>
          </LayerStats>
          
          <GestureHint>
            Use "Open Palm" gesture to toggle menu
          </GestureHint>
        </SelectorContainer>
      )}
    </AnimatePresence>
  );
};

export default LayerSelectorEnhanced;