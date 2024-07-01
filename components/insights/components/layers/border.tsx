import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { fetchSites } from '@/utils/molra';

export async function getBorderLayer(selectedSubsite: string) {
  const sites = await fetchSites();
  const vectorSource = new VectorSource();

  const selectedSite = sites.find((site: any) => site.site_id === selectedSubsite);

  if (selectedSite && selectedSite.extent && selectedSite.extent.geometry && selectedSite.extent.geometry.coordinates) {
    const coordinates = selectedSite.extent.geometry.coordinates[0].map((coord: number[]) => fromLonLat(coord));
    const polygon = new Polygon([coordinates]);
    const feature = new Feature(polygon);
    vectorSource.addFeature(feature);
  }

  return new VectorLayer({
    source: vectorSource,
    properties: { layerName: 'Border' }
  });
}