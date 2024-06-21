import React from 'react';
import { Handle, Position, useStore, NodeProps, ReactFlowState } from 'reactflow';

const connectionNodeIdSelector = (state: ReactFlowState) => state.connectionNodeId;

export default function CustomNode({ id, data }: NodeProps) {
  const connectionNodeId = useStore<string | null>(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div className="custom-node">
      <Handle
        className="custom-handle"
        position={Position.Left}
        type="target"
        isConnectableStart={false}
      />
      <div
        className="custom-node-body"
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
          backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
        }}
      >
        {data.label}
      </div>
      {!isConnecting && (
        <Handle
          className="custom-handle"
          position={Position.Right}
          type="source"
        />
      )}
    </div>
  );
}