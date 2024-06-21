import React from 'react';
import { ConnectionLineComponentProps } from 'reactflow';

export default function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
        style={connectionLineStyle}
      />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
  );
}