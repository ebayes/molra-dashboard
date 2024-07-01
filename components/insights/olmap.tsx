"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';
import { useStudySubsite } from "@/components/context/siteContext";
import { fetchSites, fetchLayers } from '@/utils/molra';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { getOrthomosaicLayer } from '@/components/insights/components/layers/ortho';
import { useInsights } from "@/components/context/insightsContext";
import { getDSMLayer } from '@/components/insights/components/layers/dsm';
import { getSpeciesDetectionLayer } from '@/components/insights/components/layers/vector';
import { getBorderLayer } from '@/components/insights/components/layers/border';

const layerNameMapping: { [key: string]: string } = {
  "Canopy mosaic": "Orthomosaic",
  "DSM": "DSM"
};

function OpenLayersMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { selectedSubsite } = useStudySubsite();
  const [map, setMap] = useState<Map | null>(null);
  const { checkedInsights, toggleInsight } = useInsights();
  const [insightLayers, setInsightLayers] = useState<{ [key: string]: TileLayer<XYZ> }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;
  
    const key = 'kz7JcWA0duN5sxz7zyRG';
    const attributions = '...'; // Your existing attributions
  
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
    
    initialMap.updateSize();
  
    setMap(initialMap);
  
    return () => initialMap.setTarget(undefined);
  }, []);

  const updateLayerVisibility = useCallback(() => {
    if (!map) return;

    Object.entries(insightLayers).forEach(([layerName, layer]) => {
      const isLayerVisible = map.getLayers().getArray().includes(layer);
      const shouldBeVisible = checkedInsights.includes(layerName);

      if (shouldBeVisible && !isLayerVisible) {
        map.addLayer(layer);
      } else if (!shouldBeVisible && isLayerVisible) {
        map.removeLayer(layer);
      }
    });
  }, [map, insightLayers, checkedInsights]);

  useEffect(() => {
    if (!map || !selectedSubsite) return;
  
    const fetchAndDisplaySiteAndLayers = async () => {
      setIsLoading(true);
      try {
        const layers = await fetchLayers(selectedSubsite);
        
        // Remove any existing vector layers
        map.getLayers().getArray()
          .filter(layer => layer instanceof VectorLayer)
          .forEach(layer => map.removeLayer(layer));
  
        const borderLayer = await getBorderLayer(selectedSubsite);
        if (borderLayer) {
          map.addLayer(borderLayer);
        }
  
        // Add insight layers
        const newInsightLayers: { [key: string]: any } = {
          "Border": borderLayer as any
        };

        layers.forEach((layer: any) => {
          const mappedLayerName = layerNameMapping[layer.layer_name];
          if (mappedLayerName) {
            let insightLayer;
            if (layer.layer_name === "Canopy mosaic") {
              insightLayer = getOrthomosaicLayer([layer]);
            } else if (layer.layer_name === "DSM") {
              insightLayer = getDSMLayer([layer]);
            }
            if (insightLayer) {
              newInsightLayers[mappedLayerName] = insightLayer;
            }
          }
        });

        const speciesDetectionLayer = await getSpeciesDetectionLayer(selectedSubsite);
        newInsightLayers["Species Detection"] = speciesDetectionLayer;

        // Now, add layers to the map in the desired order
        if (newInsightLayers["DSM"]) {
          map.addLayer(newInsightLayers["DSM"]);
        }
        if (newInsightLayers["Orthomosaic"]) {
          map.addLayer(newInsightLayers["Orthomosaic"]);
        }
        if (newInsightLayers["Species Detection"]) {
          map.addLayer(newInsightLayers["Species Detection"]);
        }

        setInsightLayers(newInsightLayers);
      
        if (borderLayer) {
          const source = borderLayer.getSource();
          if (source) {
            const extent = source.getExtent();
            if (extent) {
              map.getView().fit(extent, { 
                padding: [50, 50, 50, 50],
                callback: () => setIsLoading(false)
              });
            } else {
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching site and layers:', error);
        setIsLoading(false);
      }
    };
  
    fetchAndDisplaySiteAndLayers();
  }, [map, selectedSubsite]);


  useEffect(() => {
    updateLayerVisibility();
  }, [updateLayerVisibility, checkedInsights, insightLayers]);

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div ref={mapRef} className="map">
        <style jsx>{`
          .map {
            width: 100%;
            height: 100%;
            background: #85ccf9;
            position: absolute;
            top: 0;
            left: 0;
          }

          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 5px solid rgba(180, 180, 180, 0.6);
            border-top-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            animation: spinner 0.6s linear infinite;
          }

          @keyframes spinner {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default OpenLayersMap;