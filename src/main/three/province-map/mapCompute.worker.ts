import * as d3 from "d3";

export type MapComputePayload = {
  id: number;
  map: any;
  prvince: string;
};

export type MapComputeResult = {
  depth: number;
  center: [number, number];
  scale: number;
};

export type MapComputeResponse = {
  id: number;
  result?: MapComputeResult;
  error?: string;
};

function computeMapData(map: any, prvince: string): MapComputeResult {
  const center = map.features[0].properties.centroid;
  const projection = d3
    .geoMercator()
    .center([center[0], center[1]])
    .scale(80)
    .translate([0, 0]);
  let minX = 0;
  let maxX = 0;
  let minZ = 0;
  let maxZ = 0;
  let totalX = 0;
  let totalZ = 0;
  let total = 0;

  map.features
    .filter((i: any) => !!i.properties.name)
    .forEach((elem: any) => {
      const coordinates = elem.geometry.coordinates;
      coordinates.forEach((multiPolygon: any) => {
        if (Array.isArray(coordinates[0][0][0])) {
          multiPolygon.forEach((polygon: any) => {
            for (let i = 0; i < polygon.length; i++) {
              const [x, z] = projection(polygon[i]) as [number, number];
              if (!isNaN(x) && !isNaN(z)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minZ = Math.min(minZ, z);
                maxZ = Math.max(maxZ, z);
                totalX += polygon[i][0];
                totalZ += polygon[i][1];
                total += 1;
              }
            }
          });
        } else {
          for (let i = 0; i < multiPolygon.length; i++) {
            const [x, z] = projection(multiPolygon[i]) as [number, number];
            if (!isNaN(x) && !isNaN(z)) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minZ = Math.min(minZ, z);
              maxZ = Math.max(maxZ, z);
              totalX += multiPolygon[i][0];
              totalZ += multiPolygon[i][1];
              total += 1;
            }
          }
        }
      });
    });

  const crossX = maxX - minX;
  const crossZ = maxZ - minZ;
  const compScale =
    (26 / Math.max(crossX, crossZ)) * (prvince === "100000" ? 1.5 : 1);
  const depth = (0.12 * Math.max(crossX, crossZ)) / 2.96;

  return {
    center: [totalX / total, totalZ / total],
    depth,
    scale: compScale,
  };
}

self.onmessage = (e: MessageEvent<MapComputePayload>) => {
  const { id, map, prvince } = e.data;
  try {
    const result = computeMapData(map, prvince);
    const response: MapComputeResponse = { id, result };
    self.postMessage(response);
  } catch (err) {
    const response: MapComputeResponse = {
      id,
      error: err instanceof Error ? err.message : "compute failed",
    };
    self.postMessage(response);
  }
};
