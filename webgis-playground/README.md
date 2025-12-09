# WebGIS Playground 🌍

An interactive 3D globe application with advanced hand gesture controls, built with React, Three.js, and computer vision technologies.

## Features ✨

### 🤖 Hand Gesture Controls
- **Open Palm**: Toggle main menu
- **Fist**: Reset globe to default view
- **Pointing**: Fly to specific locations
- **Two Fingers**: Toggle information panel
- **Swipe Gestures**: Rotate globe in any direction
- **Pinch Gestures**: Zoom in and out

### 🗺️ Multiple Map Layers
- **OpenStreetMap**: Standard map view
- **Satellite**: High-resolution satellite imagery
- **Terrain**: Elevation and topographic data
- **Custom Layer**: Stylized custom mapping

### 🎮 Interactive 3D Globe
- Real-time 3D rendering with Three.js
- Smooth animations and transitions
- Dynamic texture switching
- Starfield background
- Responsive design

### 📊 Real-time Information
- Current coordinates display
- Performance metrics (FPS, triangles, textures)
- Gesture recognition feedback
- Layer statistics and loading times

## Technology Stack 🛠️

- **Frontend**: React 18, Styled Components, Framer Motion
- **3D Graphics**: Three.js, WebGL
- **Hand Tracking**: MediaPipe Hands, TensorFlow.js
- **UI/UX**: Modern glass-morphism design
- **Build Tools**: Create React App

## Quick Start 🚀

### Prerequisites
- Node.js 16+ and npm/yarn
- Web browser with WebGL support
- Webcam for gesture controls (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webgis-playground.git
   cd webgis-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage Guide 📖

### Basic Controls

| Gesture | Action | Description |
|---------|---------|-------------|
| ✋ Open Palm | Toggle Menu | Show/hide main menu |
| 👊 Fist | Reset View | Return to default position |
| 👉 Point | Fly To | Navigate to pointed location |
| ✌️ Two Fingers | Info Panel | Show/hide information |
| 👋 Swipe | Rotate | Rotate globe in swipe direction |
| 🤏 Pinch | Zoom | Zoom in or out |

### Mouse/Touch Fallback
If camera access is not available, the application provides mouse and touch controls:
- **Click and Drag**: Rotate globe
- **Mouse Wheel**: Zoom in/out
- **Touch Gestures**: Swipe to rotate, pinch to zoom

### Menu Options
- **Reset View**: Return globe to starting position
- **Layer Selector**: Switch between map layers
- **Fly to Location**: Navigate to specific coordinates
- **Information Panel**: View detailed globe statistics
- **Calibration**: Recalibrate gesture recognition
- **Fullscreen**: Toggle fullscreen mode

## Project Structure 📁

```
webgis-playground/
├── public/
│   ├── index.html          # Main HTML template
│   ├── favicon.ico         # Application icon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── Globe.js        # 3D globe component
│   │   ├── HandGestureController.js  # Gesture recognition
│   │   ├── Menu.js         # Main menu component
│   │   ├── LayerSelector.js # Map layer selector
│   │   └── InfoPanel.js    # Information display
│   ├── utils/
│   │   └── GestureContext.js # Gesture state management
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Configuration ⚙️

### Environment Variables
Create a `.env` file in the root directory for custom configuration:

```env
REACT_APP_DEFAULT_LAYER=osm
REACT_APP_ENABLE_GESTURES=true
REACT_APP_CALIBRATION_TIMEOUT=3000
REACT_APP_GESTURE_SENSITIVITY=0.5
```

### Gesture Sensitivity
Adjust gesture recognition sensitivity in `src/components/HandGestureController.js`:

```javascript
const GESTURE_CONFIG = {
  sensitivity: 0.5,        // Gesture detection sensitivity
  calibrationSteps: 4,     // Number of calibration steps
  detectionInterval: 100,  // Detection update interval (ms)
  gestureTimeout: 3000     // Gesture timeout (ms)
};
```

## Browser Support 🌐

### Supported Browsers
- **Chrome** 90+ (Recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Required Features
- WebGL 1.0 or 2.0
- WebRTC (for camera access)
- ES6+ JavaScript support
- CSS Grid and Flexbox

## Performance Optimization 🚀

### Recommended Settings
- **Screen Resolution**: 1920x1080 or higher
- **Memory**: 4GB RAM minimum
- **Graphics**: Dedicated GPU recommended
- **Camera**: 720p or higher for gesture recognition

### Optimization Tips
1. **Reduce Globe Detail**: Lower sphere segmentation in `Globe.js`
2. **Limit Star Count**: Reduce starfield density
3. **Disable Shadows**: Turn off shadow mapping for better performance
4. **Lower Texture Resolution**: Use smaller texture sizes

## Troubleshooting 🔧

### Common Issues

**Camera not working**
- Check browser permissions for camera access
- Ensure no other application is using the camera
- Try refreshing the page and allowing camera access

**Globe not rendering**
- Verify WebGL support in your browser
- Check for graphics driver updates
- Try disabling browser hardware acceleration

**Gestures not recognized**
- Ensure adequate lighting for camera
- Recalibrate gestures using the menu option
- Check camera resolution and positioning

**Poor performance**
- Lower graphics settings in the menu
- Close other browser tabs
- Check system resource usage

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL:
```
http://localhost:3000?debug=true
```

This enables:
- Performance monitoring
- Gesture debugging info
- Console logging
- Wireframe rendering

## Development 🔨

### Adding New Features

1. **New Map Layer**
   ```javascript
   // In Globe.js, add new texture creation function
   function createNewLayerTexture() {
     // Texture creation logic
   }
   ```

2. **New Gesture**
   ```javascript
   // In HandGestureController.js, add gesture detection
   case 'new_gesture':
     handleGestureAction('new_action');
     break;
   ```

3. **New Menu Item**
   ```javascript
   // In Menu.js, add to menuItems array
   {
     id: 'new-item',
     title: 'New Feature',
     description: 'Feature description',
     icon: '🆕',
     action: 'Gesture'
   }
   ```

### Code Style
- ESLint configuration included
- Prettier formatting recommended
- Follow React best practices
- Use functional components and hooks

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- **Three.js** for 3D graphics rendering
- **MediaPipe** for hand tracking capabilities
- **Framer Motion** for smooth animations
- **React Community** for excellent tools and libraries

## Support 💬

For questions, issues, or contributions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Enjoy exploring the world with WebGIS Playground!** 🌍✨