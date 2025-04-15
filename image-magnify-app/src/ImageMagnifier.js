import React, { useState, useRef, useEffect } from 'react';
import './ImageMagnifier.css';

const ImageMagnifier = ({ src, width, height, magnifierHeight = 350, magnifierWidth = 350, zoomLevel: initialZoomLevel = 2 }) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const imgRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (!zoomMode) {
      const elem = imgRef.current;
      const { width, height } = elem.getBoundingClientRect();
      setSize([width, height]);
      setShowMagnifier(true);
    }
  };

  const handleMouseMove = (e) => {
    const elem = imgRef.current;
    const { top, left } = elem.getBoundingClientRect();

    // calculate cursor position on the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    // prevent magnifier from being positioned outside the image
    if (x < 0 || y < 0 || x > imgWidth || y > imgHeight) {
      if (!zoomMode) {
        setShowMagnifier(false);
      }
    } else {
      setXY([x, y]);
      if (!zoomMode) {
        setShowMagnifier(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!zoomMode) {
      setShowMagnifier(false);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    const elem = imgRef.current;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setZoomMode(!zoomMode);
    setShowMagnifier(!zoomMode);
  };

  const handleWheel = (e) => {
    if (zoomMode) {
      e.preventDefault();
      const delta = e.deltaY || e.detail || e.wheelDelta;
      setZoomLevel((prevZoom) => {
        let newZoom = prevZoom - delta * 0.01;
        if (newZoom < 1) newZoom = 1;
        if (newZoom > 10) newZoom = 10;
        return newZoom;
      });
    }
  };

  useEffect(() => {
    const imgElem = imgRef.current;
    if (zoomMode) {
      imgElem.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      imgElem.removeEventListener('wheel', handleWheel);
      setZoomLevel(initialZoomLevel);
    }
    return () => {
      imgElem.removeEventListener('wheel', handleWheel);
    };
  }, [zoomMode, initialZoomLevel]);

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
        onDoubleClick={handleDoubleClick}
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
