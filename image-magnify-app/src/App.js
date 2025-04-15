import React from 'react';
import './App.css';
import ImageMagnifier from './ImageMagnifier';
import sampleImage from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-white mb-4">React Image Magnifier</h1>
        <ImageMagnifier src={sampleImage} width="300px" height="300px" zoomLevel={3} />
      </header>
    </div>
  );
}

export default App;
