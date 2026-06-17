export type MapDataLevel = "national" | "province" | "city";

export type NavItem = {
  adcode: string;
  name: string;
};

/** 当前加载的 GeoJSON 对应层级 */
export function getMapDataLevel(adcode: string): MapDataLevel {
  if (adcode === "100000") return "national";
  if (adcode.endsWith("0000")) return "province";
  return "city";
}

/** 是否还能继续下钻（全国→省→市，市级为止） */
export function canDrillDown(currentAdcode: string): boolean {
  return getMapDataLevel(currentAdcode) !== "city";
}

export function getGeoJsonUrl(adcode: string, full = true): string {
  const suffix = full && adcode !== "710000" ? "_full" : "";
  return `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}${suffix}`;
}

export function getBorderGeoJsonUrl(adcode: string): string {
  return `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}`;
}
