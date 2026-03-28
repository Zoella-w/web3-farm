import React from 'react';

const VideoBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/videos/landing-page-bg.mp4" type="video/mp4" />
      </video>
      {/* 覆盖一层半透明黑色遮罩，确保文字可读性 */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
    </div>
  );
};

export default VideoBackground;
