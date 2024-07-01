import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';

export function getDSMLayer(layers: any[]) {
  const dsmLayer = layers.find(layer => layer.layer_name === "DSM");
  if (dsmLayer) {
    return new TileLayer({
      source: new XYZ({
        url: dsmLayer.layer_url,
      }),
    });
  }
  return null;
}