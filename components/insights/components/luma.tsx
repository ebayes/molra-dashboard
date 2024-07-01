import React from 'react';

export function DemoHelloWorld() {
  return (
    <div className="flex w-full h-full">
      <iframe
        className='w-full h-full'
        title="test_pres"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking
        execution-while-out-of-viewport
        execution-while-not-rendered
        web-share
        src="https://sketchfab.com/models/68353de712244d17bf04f5a7846f5574/embed"
      />
    </div>
  );
}