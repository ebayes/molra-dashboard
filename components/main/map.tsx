"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';
import { fetchSites, fetchLayers } from '@/utils/molra';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { getOrthomosaicLayer } from './ortho';
import { Style, Fill, Stroke, Text } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import { unByKey } from 'ol/Observable';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from 'next/image';
import { TaxaBadge } from "@/components/ui/taxabadge2";
import { TaxaDropdown } from "@/components/ui/taxa-dropdown";
import { Badge } from "@/components/ui/badge";
import { useVisualData } from '@/components/context/VisualDataContext';
import { intersects } from 'ol/extent';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import { Geometry } from 'ol/geom';
import { Layer } from 'ol/layer';

interface DSMLayerConfig {
  layer_url: string;
  viz: {
    [key: string]: any;
  };
}
interface MetadataItem {
  label: string;
  value: (feature: FeatureProperties | null) => string;
  unit?: string;  
}

interface EnhancedDetection {
  taxa: string;
  filterTaxa: string;
  confirmed: boolean;
  value: number;
  [key: string]: any;
}

interface SiteGeometry {
  coordinates: number[][][];
}

interface FeatureProperties {
  id?: any;  
  properties?: {
    level?: string;
    highest_height?: number;
    crown_diameter?: number;
    biomass?: number;
    label?: string;
    score?: number;
    id?: any;  
  };
  [key: string]: any;
}

interface SiteData {
  site_id: string;
  extent?: {
    geometry?: {
      coordinates: number[][][];
    };
  };
}

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: {
    [key: string]: any;
  };
}

interface OpenLayersMapProps {
  showCrowns: boolean;
  selectedCrownType: 'all' | 'cecropia' | 'fallen' | 'flowering' | 'palms';
  onFeatureCountChange: (count: number) => void;
  onCecropiaCountChange: (count: number) => void;
  onFloweringCountChange: (count: number) => void;
  onPalmCountChange: (count: number) => void;
  onAverageMetricsChange: (metrics: { avgHeight: string; avgDiameter: string; avgBiomass: string }) => void;
  showDSM: boolean;
  showOrthomosaic: boolean;
  onDSMControlChange: (controls: any) => void;
  onDSMLayerUpdate: (updateFunction: (controls: any) => void) => void;
  showSiteBoundary: boolean;
  selectedMetric: string | null;
}

function elevation(xOffset: number, yOffset: number) {
  const red = ['band', 1, xOffset, yOffset];
  const green = ['band', 2, xOffset, yOffset];
  const blue = ['band', 3, xOffset, yOffset];

  return [
    '-',
    32768,
    [
      '+',
      ['*', 255 * 256, red],
      ['*', 255, green],
      ['*', 255 / 256, blue]
    ]
  ];
}

const dp = ['*', 2, ['resolution']];
const z0x = ['*', ['var', 'vert'], elevation(-1, 0)];
const z1x = ['*', ['var', 'vert'], elevation(1, 0)];
const dzdx = ['/', ['-', z1x, z0x], dp];
const z0y = ['*', ['var', 'vert'], elevation(0, -1)];
const z1y = ['*', ['var', 'vert'], elevation(0, 1)];
const dzdy = ['/', ['-', z1y, z0y], dp];
const slope = ['atan', ['sqrt', ['+', ['^', dzdx, 2], ['^', dzdy, 2]]]];
const aspect = ['clamp', ['atan', ['-', 0, dzdx], dzdy], -Math.PI, Math.PI];
const sunEl = ['*', Math.PI / 180, ['var', 'sunEl']];
const sunAz = ['*', Math.PI / 180, ['var', 'sunAz']];

const cosIncidence = [
  '+',
  ['*', ['sin', sunEl], ['cos', slope]],
  ['*', ['cos', sunEl], ['sin', slope], ['cos', ['-', sunAz, aspect]]],
];
const scaled = ['*', 255, cosIncidence];

function calculateQuarters(extent: number[]): number[][][] {
  const [minX, minY, maxX, maxY] = extent;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return [
    [[minX, minY], [midX, minY], [midX, midY], [minX, midY], [minX, minY]],
    [[midX, minY], [maxX, minY], [maxX, midY], [midX, midY], [midX, minY]],
    [[minX, midY], [midX, midY], [midX, maxY], [minX, maxY], [minX, midY]],
    [[midX, midY], [maxX, midY], [maxX, maxY], [midX, maxY], [midX, midY]]
  ];
}

function OpenLayersMap({ 
  showCrowns,
  onFeatureCountChange,
  onCecropiaCountChange,
  onFloweringCountChange,
  onPalmCountChange,
  onAverageMetricsChange,
  showOrthomosaic,
  showDSM,
  onDSMControlChange,
  onDSMLayerUpdate,
  showSiteBoundary,
  selectedMetric,
  selectedCrownType
}: OpenLayersMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const selectedSubsite = "3f82dcca-45d6-464a-a01a-d2a598dc340f"
  const [map, setMap] = useState<Map | null>(null);
  const [crownsLayer, setCrownsLayer] = useState<any>(null);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [select, setSelect] = useState<Select | null>(null);
  const [siteGeometry, setSiteGeometry] = useState<SiteGeometry | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<FeatureProperties | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureProperties | null>(null);
  const featuresPanelRef = useRef<HTMLDivElement | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | number | null>(null);
  const [dsmLayer, setDsmLayer] = useState<TileLayer<XYZ> | WebGLTileLayer | null>(null);
  const [additionalLayers, setAdditionalLayers] = useState({});
  const [orthomosaicLayer, setOrthomosaicLayer] = useState<any>(null);
  const [dsmLayerConfig, setDsmLayerConfig] = useState<DSMLayerConfig | null>(null);
  const [canopyLayerConfig, setCanopyLayerConfig] = useState(null);
  const [siteBoundaryLayer, setSiteBoundaryLayer] = useState<Layer | null>(null);

  useEffect(() => {
    if (!map || !canopyLayerConfig) return;
  
    if (showOrthomosaic && !orthomosaicLayer) {
      const newOrthomosaicLayer = getOrthomosaicLayer([canopyLayerConfig]);
      if (newOrthomosaicLayer) {
        newOrthomosaicLayer.setVisible(true);
        map.addLayer(newOrthomosaicLayer);
        setOrthomosaicLayer(newOrthomosaicLayer);
      }
    } else if (orthomosaicLayer) {
      orthomosaicLayer.setVisible(showOrthomosaic);
    }
  }, [map, canopyLayerConfig, showOrthomosaic, orthomosaicLayer]);

  useEffect(() => {
    if (!map || !dsmLayerConfig) return;
  
    if (showDSM && !dsmLayer) {
      const newDsmLayer = new WebGLTileLayer({
        source: new XYZ({
          url: dsmLayerConfig.layer_url,
          maxZoom: 20,
        }),
        style: {
          variables: {
            ...dsmLayerConfig.viz,
            opacity: 0.7,
            sunEl: 45,
            sunAz: 315,
            vert: 1,
          },
          color: ['color', scaled, ['var', 'opacity']],
        },
        opacity: 1,
        zIndex: 5,
      });
  
      newDsmLayer.set('name', 'DSM Layer');
      
      const currentView = map.getView();
      const currentCenter = currentView.getCenter();
      const currentZoom = currentView.getZoom();      
      
      map.addLayer(newDsmLayer);
      setDsmLayer(newDsmLayer);
  
      const dsmSource = newDsmLayer.getSource();
      if (dsmSource && 'on' in dsmSource) {
        dsmSource.on('tileloadend', () => {
          if (currentCenter) {
            map.getView().setCenter(currentCenter);
          }
          if (currentZoom !== undefined) {
            map.getView().setZoom(currentZoom);
          }
        });
      }
  
      onDSMLayerUpdate((controls) => {
        (newDsmLayer as WebGLTileLayer).updateStyleVariables({ ...controls, vert: 1 });
      });
    } else if (!showDSM && dsmLayer) {
      map.removeLayer(dsmLayer);
      setDsmLayer(null);
      onDSMLayerUpdate(() => {});
    }
  }, [map, showDSM, dsmLayer, dsmLayerConfig, onDSMLayerUpdate]);

  const fetchAndProcessCrowns = useCallback(async () => {
    try {
      let geoJSONPath;
      switch (selectedCrownType) {
        case 'all':
          geoJSONPath = './crowns/full_projection.geojson';
          break;
        case 'cecropia':
          geoJSONPath = './crowns/cecropia.geojson';
          break;
        case 'fallen':
          geoJSONPath = './crowns/fallen_tree.geojson';
          break;
        case 'flowering':
          geoJSONPath = './crowns/flowering_canopy.geojson';
          break;
        case 'palms':
          geoJSONPath = './crowns/pinnately_leaved_palms.geojson';
          break;
        default:
          geoJSONPath = './crowns/full_projection.geojson';
      }

      const response = await fetch(geoJSONPath);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const geoJSONData = await response.json();
      const projection = 'EPSG:3857';
      return geoJSONData.features.map((feature: GeoJSONFeature) => {
        const geometry = new GeoJSON().readGeometry(feature.geometry, {
          featureProjection: projection
        });
        return new Feature({
          geometry: geometry,
          properties: feature.properties
        });
      });
    } catch (error) {
      console.error('Error fetching crowns:', error);
      return [];
    }
  }, [selectedCrownType]);

  useEffect(() => {
    fetch('https://dev-dot-api-ras-dot-map-of-life.appspot.com/1.x/ras/layers?site_id=3f82dcca-45d6-464a-a01a-d2a598dc340f')
      .then(response => response.json())
      .then((data: any[]) => {
        const dsmLayer = data.find(layer => layer.layer_name === 'DSM');
        if (dsmLayer) {
          setDsmLayerConfig(dsmLayer);
        }
  
        const canopyLayer = data.find(layer => layer.layer_name === 'Canopy mosaic');
        if (canopyLayer) {
          setCanopyLayerConfig(canopyLayer);
        }
      })
      .catch(error => console.error('Error fetching layer data:', error));
  }, []);


  useEffect(() => {
    if (!map || !selectedSubsite) return;

    const fetchAndDisplaySiteAndLayers = async () => {
      try {
        const sites = await fetchSites();
        const layers = await fetchLayers(selectedSubsite);
        const selectedSite = sites.find((site: any) => site.site_id === selectedSubsite);

        if (selectedSite?.extent?.coordinates) {
          const coordinates = selectedSite.extent.coordinates[0][0].map((coord: number[]) => fromLonLat(coord));
          const polygon = new Polygon([coordinates]);
          const feature = new Feature(polygon);
          const vectorSource = new VectorSource({
            features: [feature]
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
              stroke: new Stroke({
                color: 'rgba(0, 0, 255, 1)',
                width: 2
              }),
              // Remove the fill style
            }),
            zIndex: 1
          });

          // Remove existing vector layers except for the crowns layer
          map.getLayers().getArray()
            .filter(layer => layer instanceof VectorLayer && layer !== crownsLayer)
            .forEach(layer => map.removeLayer(layer));

          map.addLayer(vectorLayer);
          setSiteBoundaryLayer(vectorLayer);

          map.getView().fit(vectorSource.getExtent(), {
            padding: [50, 50, 50, 50],
            maxZoom: 19
          });
  
          // Add orthomosaic layer
          const orthomosaicLayers = layers.filter((layer: any) => layer.layer_name === "Canopy mosaic");
          if (orthomosaicLayers.length > 0) {
            const newOrthomosaicLayer = getOrthomosaicLayer(orthomosaicLayers);
            if (newOrthomosaicLayer) {
              newOrthomosaicLayer.setVisible(showOrthomosaic);
              map.getLayers().insertAt(1, newOrthomosaicLayer);
              setOrthomosaicLayer(newOrthomosaicLayer);
            } else {
              console.error('Failed to create orthomosaic layer');
            }
          }
        } else {
          console.error('Selected site does not have valid extent coordinates');
        }
      } catch (error) {
        console.error('Error fetching site and layers:', error);
      }
    };

    fetchAndDisplaySiteAndLayers();
  }, [map, selectedSubsite]);

  useEffect(() => {
    if (siteBoundaryLayer) {
      siteBoundaryLayer.setVisible(showSiteBoundary);
    }
  }, [showSiteBoundary, siteBoundaryLayer]);

  useEffect(() => {
    if (!mapRef.current) return;
  
    const key = 'kz7JcWA0duN5sxz7zyRG';
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
  
    const source = new XYZ({
      attributions: attributions,
      url: `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${key}`,
      tileSize: 512,
    });
  
    const initialMap = new Map({
      layers: [new TileLayer({ source: source })],
      target: mapRef.current,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  
    initialMap.on('loadstart', () => mapRef.current?.classList.add('spinner'));
    initialMap.on('loadend', () => mapRef.current?.classList.remove('spinner'));
  
    setMap(initialMap);
  
    return () => initialMap.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map || !selectedSubsite) return;
  
    const displayCrowns = async () => {
      try {
        console.log('Fetching crowns data...');
        const features = await fetchAndProcessCrowns();
        console.log('Number of features:', features.length);
        console.log('Sample feature properties:', features[0].getProperties());
    
        setAllFeatures(features);
        onFeatureCountChange(features.length);

        // Count specific types
        const cecropiaCount = features.filter((f: Feature<Geometry>) => f.get('properties')?.level === 'cecropia').length;
        const floweringCount = features.filter((f: Feature<Geometry>) => f.get('properties')?.level === 'flowering').length;
        const palmCount = features.filter((f: Feature<Geometry>) => f.get('properties')?.level === 'palm').length;

        onCecropiaCountChange(cecropiaCount);
        onFloweringCountChange(floweringCount);
        onPalmCountChange(palmCount);

        // Calculate totals
        const totalHeight = features.reduce((sum: number, f: Feature<Geometry>) => sum + (f.get('properties')?.highest_height || 0), 0);
        const totalDiameter = features.reduce((sum: number, f: Feature<Geometry>) => sum + (f.get('properties')?.crown_diameter || 0), 0);
        const totalBiomass = features.reduce((sum: number, f: Feature<Geometry>) => sum + (f.get('properties')?.biomass || 0), 0);

        // Calculate averages
        const avgHeight = totalHeight / features.length;
        const avgDiameter = totalDiameter / features.length;
        const avgBiomass = totalBiomass / features.length;

        onAverageMetricsChange({
          avgHeight: avgHeight.toFixed(2),
          avgDiameter: avgDiameter.toFixed(2),
          avgBiomass: avgBiomass.toFixed(2)
        });
  
        const vectorSource = new VectorSource({
          features: features
        });
  
        const newCrownsLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.5)'
            }),
            stroke: new Stroke({
              color: '#ff0000',
              width: 2
            })
          }),
          zIndex: 10, // Ensure crowns layer is on top
          visible: showCrowns
        });
  
        console.log('Adding crowns layer, visible:', showCrowns);
        map.addLayer(newCrownsLayer);
        setCrownsLayer(newCrownsLayer);
  
        // Fit the view to the features
        const extent = vectorSource.getExtent();
        // map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 19 });
      } catch (error) {
        console.error('Error fetching or processing crowns data:', error);
      }
    };
  
    displayCrowns();
  
    return () => {
      if (map && crownsLayer) {
        console.log('Removing crowns layer');
        map.removeLayer(crownsLayer);
      }
    };
  }, [map, selectedSubsite, fetchAndProcessCrowns, onFeatureCountChange, onCecropiaCountChange, onFloweringCountChange, onPalmCountChange, onAverageMetricsChange, selectedCrownType]);

  useEffect(() => {
    if (crownsLayer) {
      crownsLayer.setVisible(showCrowns);
    }
  }, [showCrowns, crownsLayer]);

  useEffect(() => {
    if (!map) return;
  
    const newSelect = new Select({
      condition: pointerMove,
      layers: [crownsLayer],
      hitTolerance: 5,
    });
  
    newSelect.on('select', (event) => {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        const properties = feature.getProperties() as FeatureProperties;
        setHoveredFeature(properties);
      } else {
        setHoveredFeature(null);
      }
      if (crownsLayer) {
        crownsLayer.changed(); 
      }
    });
  
    map.addInteraction(newSelect);
    setSelect(newSelect);
  
    const clickListener = map.on('click', (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
        layerFilter: (layer) => layer === crownsLayer,
        hitTolerance: 5
      });
  
      if (clickedFeature) {
        const properties = clickedFeature.getProperties() as FeatureProperties;
        setSelectedFeature(properties);
        setSelectedFeatureId(String(properties.id));
      } else {
        setSelectedFeature(null);
        setSelectedFeatureId(null);
      }
      
      if (crownsLayer) {
        crownsLayer.changed(); 
      }
    });
  
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        featuresPanelRef.current instanceof HTMLElement &&
        mapRef.current instanceof HTMLElement &&
        !featuresPanelRef.current.contains(e.target as Node) &&
        !mapRef.current.contains(e.target as Node)
      ) {
        setSelectedFeature(null);
        setSelectedFeatureId(null);
        if (crownsLayer) {
          crownsLayer.changed(); 
        }
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      if (map && newSelect) {
        map.removeInteraction(newSelect);
      }
      unByKey(clickListener);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [map, crownsLayer]);

  useEffect(() => {
    if (!map || !crownsLayer || !allFeatures) return;

    const updateFeatureStyle = (feature: Feature<Geometry>) => {
      const isSelected = feature.get('id') === selectedFeatureId;
      const isHovered = feature.get('id') === (hoveredFeature as any)?.id;

      let fillColor = 'rgba(255, 0, 0, 0.5)';

      if (selectedMetric) {
        const value = feature.get('properties')[selectedMetric];
        const maxValue = Math.max(...allFeatures.map(f => f.get('properties')[selectedMetric]));
        const minValue = Math.min(...allFeatures.map(f => f.get('properties')[selectedMetric]));
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        
        // Create a color gradient from blue (low) to red (high)
        const r = Math.round(normalizedValue * 255);
        const b = Math.round((1 - normalizedValue) * 255);
        fillColor = `rgba(${r}, 0, ${b}, 0.5)`;
      }

      return new Style({
        fill: new Fill({
          color: isSelected || isHovered ? 'rgba(255, 255, 255, 0.5)' : fillColor
        }),
        stroke: new Stroke({
          color: isSelected || isHovered ? '#0000ff' : '#ff0000',
          width: 2
        })
      });
    };

    crownsLayer.setStyle((feature: Feature<Geometry>) => updateFeatureStyle(feature));
  }, [map, crownsLayer, selectedFeatureId, hoveredFeature, selectedMetric, allFeatures]);


  const featureDetails = [
    {
      title: "Species",
      content: (feature: FeatureProperties | null) => {
        const mapLevel = (level: string | undefined): "species" | "genus" | "family" => {
          switch (level) {
            case "species":
            case "genus":
            case "family":
              return level;
            default:
              return "species";
          }
        };
  
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TaxaBadge 
                taxa={feature?.properties?.label ?? "unknown"}
                level={mapLevel(feature?.properties?.level)}
                variant="outline"  // Change this from "icon" to "outline"
                onLevelChange={(newLevel) => {
                  console.log("Level changed to:", newLevel);
                }}
              />
              <TaxaDropdown 
                detection={feature?.properties as any}
                selectedTaxa={feature?.properties?.label ?? 'Unknown'}
                taxonomicLevel={mapLevel(feature?.properties?.level)}
                onSelect={(value) => {
                  console.log("Selected taxa:", value);
                }}
              />
            </div>
            <div>
              {feature?.properties?.score !== undefined && (
                <Badge variant="secondary">
                  {`${Math.round(feature.properties.score * 100)}%`}
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Metadata",
      items: [
        { 
          label: "Height", 
          value: (feature: FeatureProperties | null) => 
            feature?.properties?.highest_height != null
              ? `${feature.properties.highest_height.toFixed(2)}`
              : 'N/A',
          unit: "m"
        },
        { 
          label: "Crown Diameter", 
          value: (feature: FeatureProperties | null) => 
            feature?.properties?.crown_diameter != null
              ? `${feature.properties.crown_diameter.toFixed(2)}`
              : 'N/A',
          unit: "m"
        },
      ] as MetadataItem[],
    },
  ];

  return (
    <div ref={mapRef} className="map relative">
      {showCrowns && (hoveredFeature || selectedFeature) && (
        <div 
          ref={featuresPanelRef}
          id="features-panel" 
          className={`absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-[250px] h-[205px] overflow-auto ${
            selectedFeature ? 'border-2 border-green-500' : ''
          }`}
        >
          <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>
            {featureDetails.map((detail, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{detail.title}</AccordionTrigger>
                <AccordionContent>
                  {detail.content ? (
                    detail.content(selectedFeature || hoveredFeature)
                  ) : (
                    <ul className="space-y-2">
                      {detail.items.map((item) => (
                        <li key={item.label} className="p-1 rounded">
                          <strong>{item.label}:</strong> {item.value(selectedFeature || hoveredFeature)} {item.unit || ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          {((selectedFeature || hoveredFeature)?.properties?.id) && (
            <>
            </>
          )}
        </Accordion>
      </div>
    )}
      <style jsx>{`
        .map {
          width: 100%;
          height: 100%;
          background: #85ccf9;
          position: absolute;
          top: 0;
          left: 0;
        }

        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }

        .spinner:after {
          content: "";
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          margin-top: -20px;
          margin-left: -20px;
          border-radius: 50%;
          border: 5px solid rgba(180, 180, 180, 0.6);
          border-top-color: rgba(0, 0, 0, 0.6);
          animation: spinner 0.6s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default OpenLayersMap;