import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

const ControllerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 500;
`;

const GestureFeedback = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 30px;
  border-radius: 15px;
  font-size: 18px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
`;

const CalibrationOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 2000;
  pointer-events: auto;
`;

const CalibrationText = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const CalibrationSubtext = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 600px;
  margin-bottom: 30px;
  opacity: 0.8;
`;

const SkipButton = styled.button`
  padding: 12px 30px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const HandIndicator = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #00ff00;
  border-radius: 50%;
  border: 2px solid white;
  pointer-events: none;
  z-index: 1500;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const HandHUD = styled.div`
  position: absolute;
  top: 100px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 10px;
  color: white;
  font-size: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const HandGestureController = ({ videoRef, onGestureDetected }) => {
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const lastHandPositionRef = useRef(null);
  const lastGestureTimeRef = useRef(0);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [showGestureFeedback, setShowGestureFeedback] = useState(false);
  const [gestureFeedback, setGestureFeedback] = useState('');
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0, visible: false });
  const [currentGesture, setCurrentGesture] = useState('None');
  const [handConfidence, setHandConfidence] = useState(0);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let cleanupFunctions = [];

    const initializeHandTracking = async () => {
      try {
        // Initialize MediaPipe Hands
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onHandResults);
        handsRef.current = hands;

        // Initialize camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        video.srcObject = stream;

        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });

        const camera = new Camera(video, {
          onFrame: async () => {
            await hands.send({ image: video });
          },
          width: 640,
          height: 480
        });

        camera.start();
        cameraRef.current = camera;

        cleanupFunctions.push(() => {
          camera.stop();
          stream.getTracks().forEach(track => track.stop());
        });

      } catch (error) {
        console.log('Camera not available, using mouse fallback');
        startMouseFallback();
      }
    };

    const onHandResults = (results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const handedness = results.multiHandedness[0];
        
        setHandConfidence(handedness.score);
        
        // Get palm center position
        const palmCenter = landmarks[9]; // Middle finger base
        setHandPosition({
          x: palmCenter.x * window.innerWidth,
          y: palmCenter.y * window.innerHeight,
          visible: true
        });

        // Detect gesture
        const gesture = detectGesture(landmarks);
        if (gesture) {
          handleDetectedGesture(gesture, landmarks);
        }

        lastHandPositionRef.current = palmCenter;
      } else {
        setHandPosition(prev => ({ ...prev, visible: false }));
      }
    };

    const detectGesture = (landmarks) => {
      const fingers = {
        thumb: isFingerExtended(landmarks, 4, 3, 2),
        index: isFingerExtended(landmarks, 8, 7, 6),
        middle: isFingerExtended(landmarks, 12, 11, 10),
        ring: isFingerExtended(landmarks, 16, 15, 14),
        pinky: isFingerExtended(landmarks, 20, 19, 18)
      };

      const extendedCount = Object.values(fingers).filter(Boolean).length;

      // Open palm (all fingers extended)
      if (extendedCount === 5) return 'open_palm';

      // Fist (no fingers extended)
      if (extendedCount === 0) return 'fist';

      // Pointing (only index finger extended)
      if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) return 'pointing';

      // Two fingers (peace sign)
      if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) return 'two_fingers';

      // Pinch detection (thumb and index close together)
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2) +
        Math.pow(thumbTip.z - indexTip.z, 2)
      );

      if (distance < 0.05) {
        return lastHandPositionRef.current && lastHandPositionRef.current.z < landmarks[9].z 
          ? 'pinch_in' 
          : 'pinch_out';
      }

      // Swipe detection
      if (lastHandPositionRef.current) {
        const deltaX = landmarks[9].x - lastHandPositionRef.current.x;
        const deltaY = landmarks[9].y - lastHandPositionRef.current.y;

        if (Math.abs(deltaX) > 0.05) {
          return deltaX > 0 ? 'swipe_right' : 'swipe_left';
        }
        if (Math.abs(deltaY) > 0.05) {
          return deltaY > 0 ? 'swipe_down' : 'swipe_up';
        }

        // Continuous rotation
        if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01) {
          return 'rotate';
        }
      }

      return null;
    };

    const isFingerExtended = (landmarks, tipIdx, pipIdx, mcpIdx) => {
      const tip = landmarks[tipIdx];
      const pip = landmarks[pipIdx];
      const mcp = landmarks[mcpIdx];
      
      return tip.y < pip.y && pip.y < mcp.y;
    };

    const handleDetectedGesture = (gesture, landmarks) => {
      const now = Date.now();
      if (now - lastGestureTimeRef.current < 500) return; // Debounce

      setCurrentGesture(gesture);

      if (gesture === 'rotate' && lastHandPositionRef.current) {
        const deltaX = (landmarks[9].x - lastHandPositionRef.current.x) * 1000;
        const deltaY = (landmarks[9].y - lastHandPositionRef.current.y) * 1000;
        
        if (onGestureDetected) {
          onGestureDetected('rotate', { deltaX, deltaY });
        }
      } else {
        if (onGestureDetected) {
          onGestureDetected(gesture);
        }
        showGestureFeedbackFor(gesture);
        lastGestureTimeRef.current = now;
      }
    };

    const startMouseFallback = () => {
      let isMouseDown = false;
      let lastMousePosition = { x: 0, y: 0 };

      const handleMouseMove = (e) => {
        setHandPosition({ x: e.clientX, y: e.clientY, visible: true });

        if (isMouseDown) {
          const deltaX = e.clientX - lastMousePosition.x;
          const deltaY = e.clientY - lastMousePosition.y;

          if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            if (onGestureDetected) {
              onGestureDetected('rotate', { deltaX: deltaX * 0.5, deltaY: deltaY * 0.5 });
            }
          }
        }

        lastMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseDown = () => (isMouseDown = true);
      const handleMouseUp = () => (isMouseDown = false);
      const handleWheel = (e) => {
        if (onGestureDetected) {
          onGestureDetected('zoom', { deltaZ: e.deltaY * 0.01 });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('wheel', handleWheel);

      cleanupFunctions.push(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('wheel', handleWheel);
      });
    };

    initializeHandTracking();

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [videoRef, onGestureDetected]);

  const showGestureFeedbackFor = (gesture) => {
    const gestureMessages = {
      open_palm: '✋ Menu Toggled',
      fist: '👊 View Reset',
      pointing: '👉 Pointing',
      two_fingers: '✌️ Info Panel Toggled',
      swipe_left: '← Rotating Left',
      swipe_right: '→ Rotating Right',
      swipe_up: '↑ Rotating Up',
      swipe_down: '↓ Rotating Down',
      pinch_in: '🤏 Zooming In',
      pinch_out: '👐 Zooming Out'
    };

    setGestureFeedback(gestureMessages[gesture] || `Gesture: ${gesture}`);
    setShowGestureFeedback(true);

    setTimeout(() => setShowGestureFeedback(false), 1500);
  };

  const handleSkipCalibration = () => {
    setIsCalibrating(false);
    if (onGestureDetected) {
      onGestureDetected('calibration_complete');
    }
  };

  return (
    <ControllerContainer>
      <HandHUD>
        Hand Confidence: {Math.round(handConfidence * 100)}% <br />
        Gesture: {currentGesture}
      </HandHUD>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <HandIndicator 
        visible={handPosition.visible}
        style={{ left: `${handPosition.x}px`, top: `${handPosition.y}px` }}
      />

      <AnimatePresence>
        {showGestureFeedback && (
          <GestureFeedback 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {gestureFeedback}
          </GestureFeedback>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalibrating && (
          <CalibrationOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CalibrationText>🌍 WebGIS Playground</CalibrationText>
            <CalibrationSubtext>
              Hand gesture controls are ready!<br />
              Use your hand to rotate the globe, pinch to zoom, and make gestures to interact.
            </CalibrationSubtext>
            <SkipButton onClick={handleSkipCalibration}>
              Start Exploring
            </SkipButton>
          </CalibrationOverlay>
        )}
      </AnimatePresence>
    </ControllerContainer>
  );
};

export default HandGestureController;
