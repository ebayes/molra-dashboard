import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { fetchObservations } from '@/utils/molra';
import { Style, Circle, Fill, Stroke } from 'ol/style';

// Define an interface for the observation object
interface Observation {
  modality: string;
  lon: number;
  lat: number;
}

export async function getSpeciesDetectionLayer(selectedSubsite: string) {
  const observations = await fetchObservations(selectedSubsite);
  
  const features = (observations as Observation[])
    .filter((obs) => obs.modality === 'visual')
    .map((obs) => {
      const coordinates = fromLonLat([obs.lon, obs.lat]);
      return new Feature({
        geometry: new Point(coordinates)
      });
    });

  const vectorSource = new VectorSource({
    features: features
  });

  return new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new Circle({
        radius: 3,
        fill: new Fill({ color: 'rgba(0, 0, 0, 0.5)' }),
        stroke: new Stroke({ color: '#fff', width: 1 })
      })
    })
  });
}