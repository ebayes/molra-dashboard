const BASE_URL = "https://dev-dot-api-ras-dot-map-of-life.appspot.com/1.x/ras"

const sites = "sites"
const experts = "get_experts"
const observations = "observations"
const observations_list = "observations_list"

export async function fetchExperts() {
  const response = await fetch(`${BASE_URL}/${experts}`);
  const data = await response.json();
  return data;
}

export async function fetchSpecies(site_id: string) {
  const response = await fetch(`${BASE_URL}/species?site_id=${site_id}`);
  const data = await response.json();
  return data;
}

export async function getThumbnail(observation_id: string, site_name: string) {
  if (site_name) {
    const formattedSiteName = site_name.toLowerCase().replaceAll(' ', '_');
    return `https://storage.googleapis.com/cdn.mol.org/rapid_assessment/sites/${formattedSiteName}/thumbs/${observation_id}.jpg`;
  }
  return null;
}

export async function fetchTargetAreas(site_id: string) {
  const response = await fetch(`${BASE_URL}/target_areas?site_id=${site_id}`); 
  const data = await response.json();
  return data;
}

export async function fetchLayers(site_id: string) {
  const response = await fetch(`${BASE_URL}/layers?site_id=${site_id}`);
  const data = await response.json();
  return data;
}

export async function fetchSites() {
  const response = await fetch(`${BASE_URL}/sites`);
  const data = await response.json();
  return data;
}

export async function fetchFlightPath(site_id: string) {
  const response = await fetch(`${BASE_URL}/get_flight_path?site_id=${site_id}`); 
  const data = await response.json();
  return data;
}

export async function fetchObservations(site_id: string) {
  const response = await fetch(`${BASE_URL}/observations_list?site_id=${site_id}`);
  const data = await response.json();
  return data;
}

export async function fetchAnnotations(observation_id: string, site_id: string) {
  const expert_id = "f96e0c53-ee7d-41ec-9275-d9ec3fb8d39f"
  const response = await fetch(`${BASE_URL}/detections_self?observation_id=${observation_id}&expert_id=${expert_id}&site_id=${site_id}&modality=visual&level4=false`);
  const data = await response.json();
  return data;
}

export async function fetchGeoJSONData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return null;
  }
};