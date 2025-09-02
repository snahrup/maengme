// Icon Generator Script - Run this to generate PNG icons from SVG
// Usage: Copy the SVG output and use an online converter or design tool

import React from 'react';

const IconGenerator = () => {
  const svgString = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1DA1FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#007AFF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  
  <!-- Glass effect overlay -->
  <rect width="512" height="512" rx="112" fill="url(#glassGrad)" />
  
  <!-- Dark background circle for contrast -->
  <circle cx="256" cy="256" r="200" fill="rgba(11, 18, 32, 0.3)" />
  
  <!-- M Symbol -->
  <path
    d="M 100 380 L 100 132 L 180 300 L 256 132 L 332 300 L 412 132 L 412 380"
    stroke="white"
    stroke-width="28"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
  
  <!-- Center dot -->
  <circle cx="256" cy="216" r="20" fill="white" opacity="0.9" />
  
  <!-- Time arc accent -->
  <path
    d="M 256 56 A 200 200 0 0 1 456 256"
    stroke="rgba(255,255,255,0.2)"
    stroke-width="4"
    stroke-linecap="round"
    fill="none"
  />
</svg>`;

  const svgString192 = `
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad192" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1DA1FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#007AFF;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="192" height="192" rx="42" fill="url(#bgGrad192)" />
  
  <!-- M Symbol (simplified for small size) -->
  <path
    d="M 38 143 L 38 49 L 68 113 L 96 49 L 124 113 L 154 49 L 154 143"
    stroke="white"
    stroke-width="12"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
  
  <!-- Center dot -->
  <circle cx="96" cy="81" r="8" fill="white" />
</svg>`;

  const svgString1024 = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad1024" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1DA1FF;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0088FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#007AFF;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="1024" rx="224" fill="url(#bgGrad1024)" />
  
  <!-- Glass overlay -->
  <rect width="1024" height="1024" rx="224" fill="rgba(255,255,255,0.1)" />
  
  <!-- Inner circle for depth -->
  <circle cx="512" cy="512" r="400" fill="rgba(11, 18, 32, 0.2)" />
  
  <!-- M Symbol with shadow -->
  <g filter="url(#shadow)">
    <path
      d="M 200 760 L 200 264 L 360 600 L 512 264 L 664 600 L 824 264 L 824 760"
      stroke="white"
      stroke-width="56"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>
  
  <!-- Center accent -->
  <circle cx="512" cy="432" r="40" fill="white" opacity="0.95" />
  
  <!-- Decorative arcs -->
  <path
    d="M 512 112 A 400 400 0 0 1 912 512"
    stroke="rgba(255,255,255,0.15)"
    stroke-width="8"
    stroke-linecap="round"
    fill="none"
  />
  <path
    d="M 112 512 A 400 400 0 0 1 512 112"
    stroke="rgba(255,255,255,0.1)"
    stroke-width="8"
    stroke-linecap="round"
    fill="none"
  />
</svg>`;

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">MaengMe Icon Generator</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">512x512 (Main Icon)</h2>
          <div className="bg-white p-4 rounded-lg inline-block">
            <div dangerouslySetInnerHTML={{ __html: svgString }} />
          </div>
          <pre className="mt-4 p-4 bg-gray-800 text-white text-xs overflow-x-auto rounded">
            {svgString}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">192x192 (Small Icon)</h2>
          <div className="bg-white p-4 rounded-lg inline-block">
            <div dangerouslySetInnerHTML={{ __html: svgString192 }} />
          </div>
          <pre className="mt-4 p-4 bg-gray-800 text-white text-xs overflow-x-auto rounded">
            {svgString192}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">1024x1024 (Store Icon)</h2>
          <div className="bg-white p-4 rounded-lg inline-block">
            <div dangerouslySetInnerHTML={{ __html: svgString1024 }} />
          </div>
          <pre className="mt-4 p-4 bg-gray-800 text-white text-xs overflow-x-auto rounded">
            {svgString1024}
          </pre>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-900 rounded-lg">
        <p className="text-white">
          <strong>To generate PNG files:</strong><br />
          1. Copy each SVG code above<br />
          2. Go to <a href="https://cloudconvert.com/svg-to-png" className="underline">cloudconvert.com/svg-to-png</a><br />
          3. Paste the SVG and convert to PNG<br />
          4. Save as icon-192.png, icon-512.png, and icon-1024.png
        </p>
      </div>
    </div>
  );
};

export default IconGenerator;