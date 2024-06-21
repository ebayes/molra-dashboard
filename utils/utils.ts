import { Position, Node } from 'reactflow';

interface NodeWithPosition extends Node {
  positionAbsolute?: { x: number; y: number };
  width: number | null;
  height: number | null;
}

function getNodeIntersection(intersectionNode: NodeWithPosition, targetNode: NodeWithPosition) {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  if (
    !intersectionNodePosition ||
    !targetPosition ||
    intersectionNodeWidth == null ||
    intersectionNodeHeight == null ||
    targetNode.width == null ||
    targetNode.height == null
  ) {
    // Return a default point if any required property is missing or null
    return { x: 0, y: 0 };
  }

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.width / 2;
  const y1 = targetPosition.y + targetNode.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

function getEdgePosition(node: NodeWithPosition, intersectionPoint: { x: number; y: number }) {
  if (!node.positionAbsolute || node.width == null || node.height == null) {
    return Position.Top; // Default position if required properties are missing
  }

  const nx = Math.round(node.positionAbsolute.x);
  const ny = Math.round(node.positionAbsolute.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) return Position.Left;
  if (px >= nx + node.width - 1) return Position.Right;
  if (py <= ny + 1) return Position.Top;
  if (py >= ny + node.height - 1) return Position.Bottom;

  return Position.Top;
}

export function getEdgeParams(source: Node, target: Node) {
  const sourceNode = source as NodeWithPosition;
  const targetNode = target as NodeWithPosition;

  if (
    !sourceNode.positionAbsolute ||
    !targetNode.positionAbsolute ||
    sourceNode.width == null ||
    sourceNode.height == null ||
    targetNode.width == null ||
    targetNode.height == null
  ) {
    // Return default values if any required property is missing or null
    return {
      sx: 0,
      sy: 0,
      tx: 0,
      ty: 0,
      sourcePos: Position.Bottom,
      targetPos: Position.Top,
    };
  }

  const sourceIntersectionPoint = getNodeIntersection(sourceNode, targetNode);
  const targetIntersectionPoint = getNodeIntersection(targetNode, sourceNode);

  const sourcePos = getEdgePosition(sourceNode, sourceIntersectionPoint);
  const targetPos = getEdgePosition(targetNode, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}