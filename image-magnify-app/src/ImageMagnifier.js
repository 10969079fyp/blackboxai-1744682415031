import React, { useState, useRef } from 'react';
import './ImageMagnifier.css';

const ImageMagnifier = ({ src, width, height, magnifierHeight = 150, magnifierWidth = 150, zoomLevel = 2 }) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef(null);

  const handleMouseEnter = (e) => {
    const elem = imgRef.current;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const elem = imgRef.current;
    const { top, left } = elem.getBoundingClientRect();

    // calculate cursor position on the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    // prevent magnifier from being positioned outside the image
    if (x < 0 || y < 0 || x > imgWidth || y > imgHeight) {
      setShowMagnifier(false);
    } else {
      setXY([x, y]);
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="image-magnifier-container" style={{ position: 'relative', width, height }}>
      <img
        src={src}
        ref={imgRef}
        style={{ width: width, height: height }}
        alt="magnifiable"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="image-magnifier-image"
      />

      {showMagnifier && (
        <div
          className="image-magnifier-lens"
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            borderRadius: '50%',
            boxShadow: '0 0 8px 2px rgba(0,0,0,0.3)',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',

            // calculate zoomed background position
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
            border: '3px solid #000',
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;
