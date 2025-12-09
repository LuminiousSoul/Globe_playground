import React, { createContext, useContext, useReducer } from 'react';

const GestureContext = createContext();

const initialState = {
  currentGesture: 'none',
  gestureData: {},
  isDetecting: false,
  calibrationData: null
};

function gestureReducer(state, action) {
  switch (action.type) {
    case 'SET_GESTURE':
      return {
        ...state,
        currentGesture: action.payload.gesture,
        gestureData: action.payload.data || {}
      };
    case 'TOGGLE_DETECTION':
      return {
        ...state,
        isDetecting: !state.isDetecting
      };
    case 'SET_CALIBRATION':
      return {
        ...state,
        calibrationData: action.payload
      };
    default:
      return state;
  }
}

export function GestureProvider({ children }) {
  const [state, dispatch] = useReducer(gestureReducer, initialState);

  return (
    <GestureContext.Provider value={{ state, dispatch }}>
      {children}
    </GestureContext.Provider>
  );
}

export function useGesture() {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGesture must be used within a GestureProvider');
  }
  return context;
}