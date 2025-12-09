# 🔧 Troubleshooting Guide - WebGIS Playground

## Quick Diagnostics

### Is it working? Check these:
- [ ] Globe is visible and rotating
- [ ] Hand indicator (green dot) appears when hand is visible
- [ ] Gesture feedback shows when making gestures
- [ ] Hand confidence shows percentage > 0%
- [ ] No red errors in browser console (F12)

---

## Common Issues & Solutions

### 🎥 Camera Issues

#### Problem: "Camera not detected" or "Permission denied"

**Symptoms**:
- No video feed in top-right corner
- Console shows camera error
- Hand confidence stays at 0%

**Solutions**:
1. **Check Browser Permissions**
   - Click the lock icon in address bar
   - Set Camera to "Allow"
   - Refresh the page

2. **Check if Camera is in Use**
   - Close Zoom, Teams, Skype, or other video apps
   - Check Task Manager for apps using camera
   - Restart browser

3. **Try Different Browser**
   - Chrome (recommended) - best compatibility
   - Edge - good compatibility
   - Firefox - may have issues with MediaPipe
   - Safari - limited support

4. **Check Camera Hardware**
   ```bash
   # Windows: Device Manager
   # Check if camera is listed and enabled
   ```

5. **Use Mouse Fallback**
   - If camera doesn't work, mouse controls still function
   - Drag to rotate, wheel to zoom

---

### 🌍 Globe Not Moving

#### Problem: Globe renders but doesn't respond to gestures

**Symptoms**:
- Globe is visible but static
- Gestures are detected (feedback shows)
- But globe doesn't rotate/zoom

**Solutions**:

1. **Check Console for Errors**
   ```
   Press F12 → Console tab
   Look for red error messages
   ```

2. **Verify State Updates**
   - Open React DevTools
   - Check if `globeRotation` and `zoomLevel` are changing
   - If not, issue is in App.js

3. **Test Mouse Controls**
   - Try dragging with mouse
   - Try mouse wheel zoom
   - If mouse works but gestures don't, issue is in HandGestureController

4. **Check Props Connection**
   ```javascript
   // In Globe.js, add console.log
   useEffect(() => {
     console.log('Globe rotation updated:', globeRotation);
   }, [globeRotation]);
   ```

5. **Verify Three.js Refs**
   ```javascript
   // In Globe.js, check if refs are set
   console.log('Globe ref:', globeRef.current);
   console.log('Camera ref:', cameraRef.current);
   ```

---

### 👋 Gestures Not Recognized

#### Problem: Hand is detected but gestures don't trigger

**Symptoms**:
- Hand confidence > 0%
- Green dot follows hand
- But gesture feedback doesn't show
- Current gesture stays "None"

**Solutions**:

1. **Improve Lighting**
   - Use bright, even lighting
   - Avoid backlighting (window behind you)
   - Turn on room lights

2. **Adjust Hand Position**
   - Keep hand 1-2 feet from camera
   - Face palm toward camera
   - Keep hand in center of frame

3. **Make Gestures More Deliberate**
   - Hold gesture for 1-2 seconds
   - Make clear, exaggerated movements
   - Ensure fingers are fully extended/closed

4. **Lower Detection Threshold**
   ```javascript
   // In HandGestureController.js
   hands.setOptions({
     minDetectionConfidence: 0.3,  // Lower from 0.5
     minTrackingConfidence: 0.3    // Lower from 0.5
   });
   ```

5. **Check Gesture Logic**
   ```javascript
   // Add debug logging in detectGesture()
   console.log('Fingers extended:', fingers);
   console.log('Extended count:', extendedCount);
   ```

---

### 🐌 Performance Issues

#### Problem: Laggy, low FPS, stuttering

**Symptoms**:
- Globe rotates slowly or jerkily
- FPS < 30
- High CPU/memory usage
- Browser feels sluggish

**Solutions**:

1. **Close Other Tabs**
   - Each tab uses memory
   - Close unnecessary tabs
   - Restart browser

2. **Reduce Globe Detail**
   ```javascript
   // In Globe.js, lower segments
   const geometry = new THREE.SphereGeometry(2, 32, 32); // Was 64, 64
   ```

3. **Reduce Star Count**
   ```javascript
   // In Globe.js
   for (let i = 0; i < 5000; i++) { // Was 10000
   ```

4. **Disable Shadows**
   ```javascript
   // In Globe.js
   renderer.shadowMap.enabled = false;
   globe.castShadow = false;
   globe.receiveShadow = false;
   ```

5. **Lower MediaPipe Complexity**
   ```javascript
   // In HandGestureController.js
   hands.setOptions({
     modelComplexity: 0,  // Was 1 (0 = lite, 1 = full)
   });
   ```

6. **Check System Resources**
   - Open Task Manager (Ctrl+Shift+Esc)
   - Check CPU and memory usage
   - Close resource-heavy apps

---

### 📦 Installation Issues

#### Problem: npm install fails

**Symptoms**:
- Errors during `npm install`
- Missing dependencies
- Version conflicts

**Solutions**:

1. **Clear npm Cache**
   ```bash
   npm cache clean --force
   npm install
   ```

2. **Delete node_modules**
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

3. **Update npm**
   ```bash
   npm install -g npm@latest
   ```

4. **Use Specific Node Version**
   ```bash
   # Requires Node 16+
   node --version
   # If < 16, update Node.js
   ```

5. **Install Dependencies Individually**
   ```bash
   npm install react react-dom
   npm install three
   npm install @mediapipe/hands @mediapipe/camera_utils
   npm install styled-components framer-motion
   ```

---

### 🚀 Build/Start Issues

#### Problem: npm start fails

**Symptoms**:
- Error when running `npm start`
- Port already in use
- Compilation errors

**Solutions**:

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Or use different port
   set PORT=3001 && npm start
   ```

2. **Clear Build Cache**
   ```bash
   rmdir /s /q build
   npm start
   ```

3. **Check for Syntax Errors**
   - Look at error message
   - Check file and line number
   - Fix syntax issues

4. **Reinstall react-scripts**
   ```bash
   npm install react-scripts@latest
   ```

---

### 🎨 UI/Display Issues

#### Problem: UI elements not showing or misaligned

**Symptoms**:
- Menu doesn't appear
- Buttons not clickable
- Text overlapping
- Layout broken

**Solutions**:

1. **Check z-index**
   - Menu should have high z-index (2000+)
   - Globe should be lower (100)

2. **Clear Browser Cache**
   ```
   Ctrl+Shift+Delete → Clear cache
   Hard refresh: Ctrl+Shift+R
   ```

3. **Check Styled Components**
   ```javascript
   // Verify styled-components is imported
   import styled from 'styled-components';
   ```

4. **Responsive Design**
   - Try different window sizes
   - Check mobile view (F12 → Toggle device toolbar)

---

### 🔴 Console Errors

#### Error: "Cannot read property 'rotation' of null"

**Cause**: Globe ref not initialized

**Solution**:
```javascript
// Add null check
if (globeRef.current) {
  globeRef.current.rotation.x = globeRotation.x;
}
```

#### Error: "MediaPipe is not defined"

**Cause**: MediaPipe not loaded from CDN

**Solution**:
```javascript
// Check internet connection
// Verify CDN URL is correct
locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}
```

#### Error: "WebGL not supported"

**Cause**: Browser doesn't support WebGL

**Solution**:
- Update graphics drivers
- Enable hardware acceleration in browser
- Try different browser
- Check: https://get.webgl.org/

#### Error: "getUserMedia is not defined"

**Cause**: Browser doesn't support camera API

**Solution**:
- Use HTTPS (required for camera access)
- Update browser to latest version
- Check browser compatibility

---

## Debug Mode

### Enable Detailed Logging

Add to `HandGestureController.js`:
```javascript
const DEBUG = true;

if (DEBUG) {
  console.log('Hand detected:', results.multiHandLandmarks);
  console.log('Gesture:', gesture);
  console.log('Confidence:', handedness.score);
}
```

Add to `App.js`:
```javascript
useEffect(() => {
  console.log('Globe rotation:', globeRotation);
  console.log('Zoom level:', zoomLevel);
}, [globeRotation, zoomLevel]);
```

Add to `Globe.js`:
```javascript
useEffect(() => {
  console.log('Globe rotation updated:', globeRotation);
  console.log('Globe ref:', globeRef.current?.rotation);
}, [globeRotation]);
```

---

## Performance Monitoring

### Check FPS
```javascript
// Add to Globe.js
let lastTime = Date.now();
let frames = 0;

const animate = () => {
  frames++;
  const now = Date.now();
  if (now - lastTime > 1000) {
    console.log('FPS:', frames);
    frames = 0;
    lastTime = now;
  }
  // ... rest of animation
};
```

### Check Memory
```
F12 → Performance tab → Record → Stop
Check memory usage over time
```

---

## Testing Checklist

### Basic Functionality
- [ ] App loads without errors
- [ ] Globe renders in 3D
- [ ] Camera permission granted
- [ ] Hand detected (green dot visible)
- [ ] Gestures recognized (feedback shows)
- [ ] Globe rotates with swipe
- [ ] Globe zooms with pinch
- [ ] Menu toggles with open palm
- [ ] Info panel toggles with two fingers
- [ ] Fist resets view

### Performance
- [ ] FPS > 30
- [ ] No lag when rotating
- [ ] Smooth gesture transitions
- [ ] Memory usage stable

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Edge
- [ ] Works in Firefox (may have issues)
- [ ] Works in Safari (limited)

---

## Getting Help

### Information to Provide

When reporting issues, include:

1. **Browser & Version**
   ```
   Chrome 120.0.6099.109
   ```

2. **Operating System**
   ```
   Windows 11
   ```

3. **Console Errors**
   ```
   F12 → Console → Copy error messages
   ```

4. **Steps to Reproduce**
   ```
   1. Open app
   2. Allow camera
   3. Make fist gesture
   4. Globe doesn't reset
   ```

5. **Expected vs Actual**
   ```
   Expected: Globe resets to default position
   Actual: Nothing happens
   ```

---

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Camera not working | Allow permissions, close other apps |
| Globe not moving | Check console, test mouse controls |
| Gestures not detected | Improve lighting, make deliberate gestures |
| Low performance | Close tabs, reduce globe detail |
| npm install fails | Clear cache, delete node_modules |
| npm start fails | Kill port 3000, clear build cache |
| UI broken | Clear browser cache, hard refresh |

---

## Still Having Issues?

1. **Check all documentation files**:
   - SETUP_INSTRUCTIONS.md
   - TEST_CHECKLIST.md
   - ARCHITECTURE.md
   - IMPLEMENTATION_SUMMARY.md

2. **Review the code**:
   - HandGestureController.js
   - App.js
   - Globe.js

3. **Test with minimal setup**:
   - Disable all gestures except one
   - Test with mouse controls only
   - Isolate the problem

4. **Start fresh**:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   npm start
   ```

---

**Remember**: Most issues are related to camera permissions, lighting conditions, or browser compatibility. Start with the basics! 🔍
