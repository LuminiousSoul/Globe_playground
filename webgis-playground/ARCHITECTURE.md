# 🏗️ WebGIS Playground - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERACTION                            │
│                                                                       │
│  👋 Hand Gestures              🖱️ Mouse/Touch (Fallback)            │
│  ├─ Open Palm (✋)              ├─ Click & Drag                      │
│  ├─ Fist (👊)                  ├─ Mouse Wheel                       │
│  ├─ Pointing (👉)              └─ Touch Gestures                    │
│  ├─ Two Fingers (✌️)                                                │
│  ├─ Swipe (👋)                                                      │
│  └─ Pinch (🤏)                                                      │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        INPUT LAYER                                   │
│                                                                       │
│  📹 Webcam Feed (640x480)                                            │
│  └─ Video Stream → MediaPipe Hands                                   │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    DETECTION LAYER                                   │
│                                                                       │
│  🤖 MediaPipe Hands API                                              │
│  ├─ Hand Landmark Detection (21 points)                              │
│  ├─ Hand Tracking (60 FPS)                                           │
│  ├─ Confidence Score (0-1)                                           │
│  └─ 3D Coordinates (x, y, z)                                         │
│                                                                       │
│  Output: landmarks[] = [                                             │
│    {x: 0.5, y: 0.3, z: 0.1},  // Wrist                              │
│    {x: 0.6, y: 0.2, z: 0.0},  // Thumb tip                          │
│    {x: 0.7, y: 0.1, z: 0.0},  // Index tip                          │
│    ... (21 total points)                                             │
│  ]                                                                   │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  GESTURE RECOGNITION LAYER                           │
│                                                                       │
│  🧠 HandGestureController.js                                         │
│  │                                                                    │
│  ├─ detectGesture(landmarks)                                         │
│  │  ├─ Analyze finger positions                                      │
│  │  ├─ Calculate distances                                           │
│  │  ├─ Detect movement deltas                                        │
│  │  └─ Return gesture type                                           │
│  │                                                                    │
│  ├─ Gesture Types:                                                   │
│  │  ├─ open_palm     (5 fingers extended)                            │
│  │  ├─ fist          (0 fingers extended)                            │
│  │  ├─ pointing      (index only)                                    │
│  │  ├─ two_fingers   (index + middle)                                │
│  │  ├─ pinch_in      (thumb-index close, moving in)                 │
│  │  ├─ pinch_out     (thumb-index close, moving out)                │
│  │  ├─ swipe_left    (hand moving left)                              │
│  │  ├─ swipe_right   (hand moving right)                             │
│  │  ├─ swipe_up      (hand moving up)                                │
│  │  ├─ swipe_down    (hand moving down)                              │
│  │  └─ rotate        (continuous small movements)                    │
│  │                                                                    │
│  └─ Output: { gesture: 'swipe_left', data: { deltaX: -50 } }        │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                            │
│                                                                       │
│  ⚛️ App.js (React State)                                             │
│  │                                                                    │
│  ├─ State Variables:                                                 │
│  │  ├─ globeRotation: { x: 0, y: 0 }                                │
│  │  ├─ zoomLevel: 5                                                  │
│  │  ├─ currentGesture: 'None'                                        │
│  │  ├─ showMenu: false                                               │
│  │  └─ showInfoPanel: false                                          │
│  │                                                                    │
│  ├─ handleGestureDetected(gesture, data):                            │
│  │  │                                                                 │
│  │  ├─ switch (gesture):                                             │
│  │  │  ├─ 'swipe_left'  → setGlobeRotation(y - 0.2)                 │
│  │  │  ├─ 'swipe_right' → setGlobeRotation(y + 0.2)                 │
│  │  │  ├─ 'swipe_up'    → setGlobeRotation(x - 0.2)                 │
│  │  │  ├─ 'swipe_down'  → setGlobeRotation(x + 0.2)                 │
│  │  │  ├─ 'pinch_in'    → setZoomLevel(zoom - 0.5)                  │
│  │  │  ├─ 'pinch_out'   → setZoomLevel(zoom + 0.5)                  │
│  │  │  ├─ 'fist'        → reset rotation & zoom                      │
│  │  │  ├─ 'open_palm'   → toggle menu                                │
│  │  │  ├─ 'two_fingers' → toggle info panel                          │
│  │  │  └─ 'rotate'      → continuous rotation with deltaX/Y          │
│  │  │                                                                 │
│  │  └─ State updates trigger re-render                               │
│  │                                                                    │
│  └─ Props passed to children:                                        │
│     ├─ <Globe globeRotation={...} zoomLevel={...} />                │
│     ├─ <HandGestureController onGestureDetected={...} />            │
│     ├─ <Menu isVisible={showMenu} />                                 │
│     └─ <InfoPanel isVisible={showInfoPanel} />                       │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      RENDERING LAYER                                 │
│                                                                       │
│  🌍 Globe.js (Three.js)                                              │
│  │                                                                    │
│  ├─ Props Received:                                                  │
│  │  ├─ globeRotation: { x, y }                                       │
│  │  ├─ zoomLevel: number                                             │
│  │  └─ selectedLayer: 'osm' | 'satellite' | 'terrain' | 'custom'    │
│  │                                                                    │
│  ├─ Three.js Scene Setup:                                            │
│  │  ├─ Scene (container)                                             │
│  │  ├─ Camera (PerspectiveCamera)                                    │
│  │  ├─ Renderer (WebGLRenderer)                                      │
│  │  ├─ Globe (SphereGeometry + MeshPhongMaterial)                    │
│  │  ├─ Lights (Ambient + Directional)                                │
│  │  └─ Stars (PointsMaterial)                                        │
│  │                                                                    │
│  ├─ useEffect (globeRotation):                                       │
│  │  └─ globeRef.current.rotation.x = globeRotation.x                 │
│  │     globeRef.current.rotation.y = globeRotation.y                 │
│  │                                                                    │
│  ├─ useEffect (zoomLevel):                                           │
│  │  └─ cameraRef.current.position.z = zoomLevel                      │
│  │                                                                    │
│  └─ Animation Loop (60 FPS):                                         │
│     └─ renderer.render(scene, camera)                                │
└───────────────────────┬─────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUT LAYER                                  │
│                                                                       │
│  🖥️ Visual Display                                                   │
│  ├─ 3D Globe (rotating based on gestures)                            │
│  ├─ Hand Indicator (green dot)                                       │
│  ├─ Gesture Feedback (popup messages)                                │
│  ├─ Hand Confidence (percentage)                                     │
│  ├─ Current Gesture (text display)                                   │
│  ├─ Menu (when toggled)                                              │
│  ├─ Info Panel (when toggled)                                        │
│  └─ Layer Selector                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.js (Root)
│
├─ LoadingScreen
│  └─ Shows for 2 seconds on startup
│
├─ Globe.js
│  ├─ Receives: globeRotation, zoomLevel, selectedLayer
│  ├─ Three.js Scene
│  │  ├─ SphereGeometry (globe)
│  │  ├─ Lights
│  │  └─ Stars
│  └─ Updates rotation/zoom from props
│
├─ HandGestureController.js
│  ├─ Receives: videoRef, onGestureDetected
│  ├─ MediaPipe Hands
│  │  ├─ Camera initialization
│  │  ├─ Hand detection
│  │  └─ Landmark tracking
│  ├─ Gesture Recognition
│  │  └─ detectGesture(landmarks)
│  ├─ Visual Feedback
│  │  ├─ HandIndicator (green dot)
│  │  ├─ GestureFeedback (popup)
│  │  ├─ HandHUD (confidence)
│  │  └─ CalibrationOverlay
│  └─ Calls: onGestureDetected(gesture, data)
│
├─ VideoFeed
│  └─ Shows webcam (toggleable)
│
├─ Menu.js
│  ├─ Receives: isVisible, onClose
│  └─ Shows when open_palm gesture
│
├─ LayerSelector.js
│  ├─ Receives: selectedLayer, onLayerChange
│  └─ Switches map textures
│
├─ InfoPanel.js
│  ├─ Receives: isVisible, onClose
│  └─ Shows when two_fingers gesture
│
└─ GestureIndicator
   └─ Displays current gesture name
```

---

## Data Flow Sequence

### Example: User Swipes Right

```
1. USER ACTION
   └─ User moves hand right
      ↓

2. CAMERA CAPTURE
   └─ Webcam captures frame
      └─ Video stream → MediaPipe
         ↓

3. HAND DETECTION
   └─ MediaPipe detects hand
      └─ Returns 21 landmarks with x, y, z coordinates
         ↓

4. GESTURE RECOGNITION
   └─ HandGestureController.detectGesture()
      ├─ Compares current position with last position
      ├─ Calculates: deltaX = current.x - last.x
      ├─ Detects: deltaX > 0.05 (moving right)
      └─ Returns: { gesture: 'swipe_right', data: {} }
         ↓

5. EVENT CALLBACK
   └─ onGestureDetected('swipe_right')
      └─ Calls App.handleGestureDetected()
         ↓

6. STATE UPDATE
   └─ App.js: setGlobeRotation(prev => ({ ...prev, y: prev.y + 0.2 }))
      ├─ Old rotation: { x: 0, y: 0 }
      └─ New rotation: { x: 0, y: 0.2 }
         ↓

7. PROPS UPDATE
   └─ Globe receives new props
      └─ globeRotation = { x: 0, y: 0.2 }
         ↓

8. REACT RE-RENDER
   └─ Globe.js useEffect triggered
      └─ Detects globeRotation changed
         ↓

9. THREE.JS UPDATE
   └─ globeRef.current.rotation.y = 0.2
      └─ Globe mesh rotates
         ↓

10. VISUAL FEEDBACK
    ├─ Globe rotates right on screen
    ├─ Gesture feedback shows "→ Rotating Right"
    └─ User sees immediate response
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      App.js State                            │
│                                                               │
│  const [globeRotation, setGlobeRotation] = useState({        │
│    x: 0,  // Vertical rotation (up/down)                     │
│    y: 0   // Horizontal rotation (left/right)                │
│  });                                                          │
│                                                               │
│  const [zoomLevel, setZoomLevel] = useState(5);              │
│  // Range: 3 (close) to 10 (far)                             │
│                                                               │
│  const [currentGesture, setCurrentGesture] = useState('None');│
│  const [showMenu, setShowMenu] = useState(false);            │
│  const [showInfoPanel, setShowInfoPanel] = useState(false);  │
│  const [selectedLayer, setSelectedLayer] = useState('osm');  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
        ┌───────────────┴───────────────┐
        │                               │
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│   Globe.js       │          │  Menu.js         │
│                  │          │  InfoPanel.js    │
│ Props:           │          │  LayerSelector   │
│ - globeRotation  │          │                  │
│ - zoomLevel      │          │ Props:           │
│ - selectedLayer  │          │ - isVisible      │
│                  │          │ - onClose        │
│ Updates:         │          │ - selectedLayer  │
│ - Globe rotation │          │                  │
│ - Camera zoom    │          │ Updates:         │
│ - Texture        │          │ - UI visibility  │
└──────────────────┘          └──────────────────┘
```

---

## Gesture Detection Algorithm

### Finger Extension Detection
```javascript
function isFingerExtended(landmarks, tipIdx, pipIdx, mcpIdx) {
  const tip = landmarks[tipIdx];  // Fingertip
  const pip = landmarks[pipIdx];  // Middle joint
  const mcp = landmarks[mcpIdx];  // Base joint
  
  // Finger is extended if tip is above pip, and pip is above mcp
  return tip.y < pip.y && pip.y < mcp.y;
}

// Example: Index finger
isFingerExtended(landmarks, 8, 7, 6)
// 8 = index tip, 7 = index pip, 6 = index mcp
```

### Gesture Classification
```javascript
function detectGesture(landmarks) {
  // Count extended fingers
  const fingers = {
    thumb: isFingerExtended(landmarks, 4, 3, 2),
    index: isFingerExtended(landmarks, 8, 7, 6),
    middle: isFingerExtended(landmarks, 12, 11, 10),
    ring: isFingerExtended(landmarks, 16, 15, 14),
    pinky: isFingerExtended(landmarks, 20, 19, 18)
  };
  
  const extendedCount = Object.values(fingers).filter(Boolean).length;
  
  // Classify gesture
  if (extendedCount === 5) return 'open_palm';
  if (extendedCount === 0) return 'fist';
  if (fingers.index && !fingers.middle) return 'pointing';
  if (fingers.index && fingers.middle && !fingers.ring) return 'two_fingers';
  
  // Check for pinch
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const distance = calculateDistance(thumbTip, indexTip);
  if (distance < 0.05) return 'pinch';
  
  // Check for swipe
  if (lastPosition) {
    const deltaX = landmarks[9].x - lastPosition.x;
    const deltaY = landmarks[9].y - lastPosition.y;
    
    if (Math.abs(deltaX) > 0.05) {
      return deltaX > 0 ? 'swipe_right' : 'swipe_left';
    }
    if (Math.abs(deltaY) > 0.05) {
      return deltaY > 0 ? 'swipe_down' : 'swipe_up';
    }
  }
  
  return null;
}
```

---

## Performance Optimization

### Rendering Pipeline
```
Frame Start (16.67ms budget for 60 FPS)
│
├─ MediaPipe Processing (~10ms)
│  └─ Hand detection + landmark extraction
│
├─ Gesture Recognition (~2ms)
│  └─ Analyze landmarks + classify gesture
│
├─ React State Update (~1ms)
│  └─ setState triggers re-render
│
├─ Three.js Rendering (~3ms)
│  ├─ Update globe rotation
│  ├─ Update camera position
│  └─ Render scene
│
└─ Frame End (Total: ~16ms) ✅ 60 FPS maintained
```

### Optimization Techniques Used
1. **Debouncing**: Gestures throttled to 500ms
2. **Ref Usage**: Direct DOM manipulation for performance
3. **Memoization**: Prevent unnecessary re-renders
4. **RequestAnimationFrame**: Smooth 60 FPS rendering
5. **Lazy Loading**: MediaPipe loaded from CDN

---

## Error Handling & Fallbacks

```
┌─────────────────────────────────────────┐
│     Camera Access Requested             │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ↓                ↓
    ✅ Allowed      ❌ Denied
        │                │
        ↓                ↓
┌──────────────┐  ┌──────────────────┐
│ MediaPipe    │  │ Mouse Fallback   │
│ Hand Tracking│  │                  │
│              │  │ - Drag to rotate │
│ - Gestures   │  │ - Wheel to zoom  │
│ - Real-time  │  │ - Click controls │
└──────────────┘  └──────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  React 18 + Hooks (useState, useEffect, useRef)         │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   3D Layer   │ │  Vision Layer│ │   UI Layer   │
│              │ │              │ │              │
│  Three.js    │ │  MediaPipe   │ │  Styled-     │
│  - WebGL     │ │  - Hands     │ │  Components  │
│  - Geometry  │ │  - Camera    │ │              │
│  - Materials │ │  - Landmarks │ │  Framer      │
│  - Lights    │ │              │ │  Motion      │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

This architecture ensures:
- ✅ **Separation of Concerns**: Each layer has a specific responsibility
- ✅ **Unidirectional Data Flow**: Data flows from input → detection → state → rendering
- ✅ **Reactive Updates**: Changes propagate automatically through React
- ✅ **Performance**: Optimized for 60 FPS rendering
- ✅ **Maintainability**: Clear component boundaries
- ✅ **Scalability**: Easy to add new gestures or features

