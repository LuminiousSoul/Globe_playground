# WebGIS Playground - Testing Checklist

## ✅ Pre-Flight Checks

Before running, verify these files exist:
- [ ] `src/App.js` - Updated with gesture state management
- [ ] `src/components/Globe.js` - Updated to receive rotation/zoom props
- [ ] `src/components/HandGestureController.js` - Rewritten with MediaPipe
- [ ] `package.json` - Contains @mediapipe/hands and @mediapipe/camera_utils

## 🧪 Testing Steps

### 1. Installation Test
```bash
npm install
```
**Expected**: All dependencies install without errors

### 2. Start Application
```bash
npm start
```
**Expected**: App opens at http://localhost:3000

### 3. Initial Load Test
- [ ] Loading screen appears
- [ ] "WebGIS Playground" title visible
- [ ] After 2 seconds, calibration screen appears
- [ ] "Start Exploring" button is clickable

### 4. Camera Permission Test
- [ ] Browser asks for camera permission
- [ ] Click "Allow"
- [ ] Video feed appears in top-right corner (if enabled)

### 5. Globe Rendering Test
- [ ] 3D globe is visible in center
- [ ] Globe has texture (green/blue continents)
- [ ] Stars are visible in background
- [ ] "Current Layer: OpenStreetMap" shows in top-left

### 6. Mouse Control Test (Fallback)
- [ ] Click and drag on globe → Globe rotates
- [ ] Mouse wheel up → Globe zooms in
- [ ] Mouse wheel down → Globe zooms out
- [ ] Green dot follows mouse cursor

### 7. Hand Gesture Tests

#### Test A: Open Palm (✋)
1. Show open palm to camera
2. **Expected**: Menu toggles open/closed
3. **Feedback**: "✋ Menu Toggled" appears

#### Test B: Fist (👊)
1. Make a fist
2. **Expected**: Globe resets to default position
3. **Feedback**: "👊 View Reset" appears

#### Test C: Two Fingers (✌️)
1. Show peace sign (index + middle finger)
2. **Expected**: Info panel toggles
3. **Feedback**: "✌️ Info Panel Toggled" appears

#### Test D: Swipe Left/Right (👋)
1. Move hand left
2. **Expected**: Globe rotates left (counterclockwise)
3. **Feedback**: "← Rotating Left" appears
4. Move hand right
5. **Expected**: Globe rotates right (clockwise)
6. **Feedback**: "→ Rotating Right" appears

#### Test E: Swipe Up/Down (👋)
1. Move hand up
2. **Expected**: Globe rotates up
3. **Feedback**: "↑ Rotating Up" appears
4. Move hand down
5. **Expected**: Globe rotates down
6. **Feedback**: "↓ Rotating Down" appears

#### Test F: Pinch (🤏)
1. Bring thumb and index finger together
2. **Expected**: Globe zooms in
3. **Feedback**: "🤏 Zooming In" appears
4. Spread fingers apart
5. **Expected**: Globe zooms out
6. **Feedback**: "👐 Zooming Out" appears

#### Test G: Continuous Rotation (🖐️)
1. Keep hand open and move slowly
2. **Expected**: Globe follows hand movement smoothly
3. **No feedback** (continuous gesture)

### 8. UI Component Tests
- [ ] Hand confidence shows percentage (0-100%)
- [ ] Current gesture displays in bottom-left
- [ ] Green hand indicator follows hand position
- [ ] Layer info shows current map layer

### 9. Layer Switching Test
- [ ] Click layer selector
- [ ] Switch to "Satellite" → Globe texture changes to blue
- [ ] Switch to "Terrain" → Globe texture changes to orange
- [ ] Switch to "Custom" → Globe texture changes to purple

### 10. Performance Test
- [ ] FPS stays above 30 (check browser DevTools)
- [ ] No lag when rotating globe
- [ ] Smooth gesture transitions
- [ ] No memory leaks (check Task Manager)

## 🐛 Common Issues & Solutions

### Issue: Globe doesn't move with hand gestures
**Solution**: 
1. Check browser console for errors
2. Verify camera permission is granted
3. Make sure hand is visible in video feed
4. Try mouse controls to verify globe can move

### Issue: Camera not detected
**Solution**:
1. Check if other apps are using camera
2. Try different browser (Chrome recommended)
3. Refresh page and allow permissions again
4. Use mouse fallback controls

### Issue: Gestures not recognized
**Solution**:
1. Improve lighting conditions
2. Move hand closer to camera (1-2 feet)
3. Make gestures more deliberately
4. Check "Hand Confidence" is above 50%

### Issue: Globe rotates too fast/slow
**Solution**:
1. Open `src/App.js`
2. Find gesture handlers (swipe_left, swipe_right, etc.)
3. Adjust multiplier values (0.2 → 0.1 for slower, 0.3 for faster)

### Issue: Zoom too sensitive
**Solution**:
1. Open `src/App.js`
2. Find pinch_in/pinch_out handlers
3. Adjust step value (0.5 → 0.3 for less sensitive)

## 📊 Expected Behavior Summary

| Action | Expected Result | Time |
|--------|----------------|------|
| App Start | Loading screen → Calibration | 2s |
| Camera Allow | Video feed appears | 1s |
| Hand Detection | Green dot + confidence % | Instant |
| Gesture | Feedback popup + action | <0.5s |
| Globe Rotation | Smooth animation | Instant |
| Zoom | Smooth camera movement | Instant |
| Layer Switch | Texture change | <1s |

## ✅ Success Criteria

Your WebGIS Playground is working correctly if:
1. ✅ Globe renders in 3D with textures
2. ✅ Hand gestures are detected and shown
3. ✅ Globe rotates when you swipe
4. ✅ Globe zooms when you pinch
5. ✅ Menu/panels toggle with gestures
6. ✅ Mouse controls work as fallback
7. ✅ No console errors
8. ✅ Smooth performance (30+ FPS)

## 🎉 Final Test

**The Ultimate Test**: 
1. Show open palm → Menu opens
2. Swipe right → Globe rotates right
3. Pinch → Globe zooms in
4. Make fist → Globe resets
5. Show two fingers → Info panel opens

If all 5 work, **YOU'RE READY TO GO! 🚀**

---

**Report any issues with:**
- Browser console errors (F12 → Console)
- Network tab for failed requests
- Performance metrics (FPS, memory)
