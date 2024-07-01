import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';

export function getOrthomosaicLayer(layers: any[]) {
  const canopyMosaicLayer = layers.find(layer => layer.layer_name === "Canopy mosaic");
  if (canopyMosaicLayer) {
    return new TileLayer({
      source: new XYZ({
        url: canopyMosaicLayer.layer_url,
      }),
    });
  }
  return null;
}

