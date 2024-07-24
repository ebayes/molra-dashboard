import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import WebGLTileLayer from 'ol/layer/WebGLTile';

export function getOrthomosaicLayer(layers: any[]) {
  const canopyMosaicLayer = layers.find(layer => layer.layer_name === "Canopy mosaic");
  if (canopyMosaicLayer) {
    return new TileLayer({
      source: new XYZ({
        url: canopyMosaicLayer.layer_url,
      }),
      zIndex: 1,
    });
  }
  return null;
}

export function getDSMLayer(layers: any[]) {
  const dsmLayer = layers.find(layer => layer.layer_name === "DSM");
  if (dsmLayer) {
    return new WebGLTileLayer({
      source: new XYZ({
        url: dsmLayer.layer_url,
      }),
      style: {
        color: ['color', ['interpolate', ['linear'], ['band', 1], dsmLayer.viz.min, [0, 0, 0, 0], dsmLayer.viz.max, [1, 1, 1, 1]]],
      },
      zIndex: 2,
    });
  }
  return null;
}