# WebGIS Playground - Setup Instructions

## ✅ What Was Fixed

Your WebGIS Playground now has **REAL hand gesture controls** that actually move the globe!

### Changes Made:

1. **HandGestureController.js** - Complete rewrite with MediaPipe Hands integration
   - Real-time hand landmark detection
   - Gesture recognition (open palm, fist, pointing, two fingers, swipe, pinch)
   - Mouse fallback if camera is unavailable
   
2. **App.js** - Connected gesture data flow
   - Added globe rotation and zoom state management
   - Gesture events now properly update globe position
   
3. **Globe.js** - Receives rotation/zoom from props
   - Globe responds to hand gestures in real-time
   - Smooth rotation and zoom animations

## 🚀 How to Run

### Step 1: Install Dependencies
```bash
npm install
```

All required packages are already in package.json:
- @mediapipe/hands
- @mediapipe/camera_utils
- three (Three.js for 3D)
- react, styled-components, framer-motion

### Step 2: Start the Application
```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 3: Allow Camera Access
When prompted, click "Allow" to enable your webcam for hand tracking.

## 🎮 Hand Gesture Controls

| Gesture | Action | How to Do It |
|---------|--------|--------------|
| ✋ **Open Palm** | Toggle Menu | Show all 5 fingers spread open |
| 👊 **Fist** | Reset View | Close all fingers into a fist |
| 👉 **Pointing** | Point Mode | Extend only index finger |
| ✌️ **Two Fingers** | Info Panel | Extend index and middle finger (peace sign) |
| 👋 **Swipe Left/Right** | Rotate Globe Horizontally | Move hand left or right |
| 👋 **Swipe Up/Down** | Rotate Globe Vertically | Move hand up or down |
| 🤏 **Pinch** | Zoom In/Out | Bring thumb and index finger together |
| 🖐️ **Drag** | Continuous Rotation | Move hand while keeping it open |

## 🖱️ Mouse Fallback (if no camera)

If camera is not available, you can still control the globe:
- **Click and Drag**: Rotate the globe
- **Mouse Wheel**: Zoom in/out
- **Keyboard**: Use menu buttons

## 🔧 Troubleshooting

### Camera Not Working?
1. Check browser permissions (click lock icon in address bar)
2. Make sure no other app is using the camera
3. Try refreshing the page
4. Use Chrome/Edge for best compatibility

### Globe Not Moving?
1. Make sure you clicked "Start Exploring" on the calibration screen
2. Check that hand is visible in the video feed (top-right corner)
3. Try making gestures more deliberately and slowly
4. Check console for any errors (F12 → Console tab)

### Performance Issues?
1. Close other browser tabs
2. Reduce globe detail in Globe.js (lower sphere segments)
3. Disable video feed visibility
4. Use a dedicated GPU if available

## 📝 How It Works

```
Webcam → MediaPipe Hands → Landmark Detection → Gesture Recognition
    ↓
App.js (State Management)
    ↓
Globe.js (Three.js Rendering) → Visual Feedback
```

1. **MediaPipe** detects 21 hand landmarks in real-time
2. **Gesture Detection** analyzes finger positions to identify gestures
3. **App.js** receives gesture events and updates rotation/zoom state
4. **Globe.js** reads state and applies transformations to Three.js camera/globe
5. **Visual Feedback** shows current gesture and hand position

## 🎨 Customization

### Adjust Gesture Sensitivity
In `HandGestureController.js`, modify:
```javascript
minDetectionConfidence: 0.5,  // Lower = more sensitive (0.3-0.7)
minTrackingConfidence: 0.5    // Lower = more responsive (0.3-0.7)
```

### Change Rotation Speed
In `App.js`, adjust multipliers:
```javascript
case 'swipe_left':
  setGlobeRotation(prev => ({ ...prev, y: prev.y - 0.2 })); // Change 0.2
```

### Modify Zoom Range
In `App.js`:
```javascript
setZoomLevel(prev => Math.max(3, Math.min(10, prev + 0.5))); // Change 3 and 10
```

## 🌟 Features Now Working

✅ Real-time hand tracking with MediaPipe  
✅ Globe rotates with hand swipes  
✅ Pinch to zoom in/out  
✅ Gesture recognition feedback  
✅ Mouse fallback controls  
✅ Multiple map layers  
✅ Smooth animations  
✅ Hand position indicator  
✅ Confidence display  

## 📦 Project Structure

```
webgis-playground/
├── src/
│   ├── components/
│   │   ├── Globe.js                    ← 3D globe with Three.js
│   │   ├── HandGestureController.js    ← MediaPipe hand tracking
│   │   ├── Menu.js                     ← Main menu
│   │   ├── LayerSelector.js            ← Map layer switcher
│   │   └── InfoPanel.js                ← Information display
│   ├── App.js                          ← Main app with state management
│   └── index.js                        ← Entry point
└── package.json                        ← Dependencies
```

## 🎯 Next Steps

1. Run `npm start` and test the hand gestures
2. Try all gestures listed above
3. Experiment with different map layers
4. Customize sensitivity and speed to your preference

## 💡 Tips for Best Experience

- **Lighting**: Use good lighting for better hand detection
- **Distance**: Keep hand 1-2 feet from camera
- **Background**: Plain background works best
- **Gestures**: Make deliberate, clear gestures
- **Speed**: Move hand slowly for better tracking

---

**Enjoy exploring the world with hand gestures! 🌍✨**

If you encounter any issues, check the browser console (F12) for error messages.
