"use client"

import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  MarkerType,
  Connection,
  ConnectionLineComponentProps,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { EdgeProps, EdgeTypes } from 'reactflow';
import { RightPanel } from "@/components/Structure/RightPanel";
import Sidebar from '@/components/models/Sidebar';
import CustomNode from '@/components/models/CustomNode';
import FloatingEdge from '@/components/models/FloatingEdge';
import CustomConnectionLine from '@/components/models/CustomConnectionLine';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge as React.ComponentType<EdgeProps>,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

// Define getId here
let id = 0;
const getId = () => `dndnode_${id++}`;

function DnDFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]); 
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
  
      const type = event.dataTransfer.getData('application/reactflow');
  
      if (typeof type === 'undefined' || !type) {
        return;
      }
  
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
  
      const newNode = {
        id: getId(),
        type: 'custom',
        position,
        data: { label: `${type} node` },
      };
  
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={CustomConnectionLine as React.ComponentType<ConnectionLineComponentProps>}
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function Models() {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [activeTool, setActiveTool] = useState('hand');

  const handleImageClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsImageSelected(true);
  };

  const handleOutsideClick = () => {
    setIsImageSelected(false);
  };

  return (
    <div className="flex h-full">
      <RightPanel>
        <div id="right-top" className="right-top">
          <h1>Annotate</h1>
        </div>
        <div id="right-bottom" className="right-bottom flex h-full" onClick={handleOutsideClick}>
          <div id="chat-area" className="p-[15px] flex-grow flex flex-col" onClick={handleImageClick}>
            <div id="image-frame" className={`flex-grow border rounded-lg overflow-hidden relative p-[14px] box-border ${isImageSelected ? 'border-[#54B2BF] border-2 p-[13px]' : 'border-[hsl(var(--border-color))] border'}`}>
              <ReactFlowProvider>
                <DnDFlow />
              </ReactFlowProvider>
            </div>
          </div>

          <Sidebar />

        </div>
      </RightPanel>
    </div>
  );
}
