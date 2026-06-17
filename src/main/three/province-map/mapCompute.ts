import type { MapComputeResponse, MapComputeResult } from "./mapCompute.worker";

let worker: Worker | null = null;
let requestId = 0;
const pending = new Map<
  number,
  {
    resolve: (result: MapComputeResult) => void;
    reject: (error: Error) => void;
  }
>();

function getWorker() {
  if (!worker) {
    worker = new Worker(
      new URL("./mapCompute.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (e: MessageEvent<MapComputeResponse>) => {
      const { id, result, error } = e.data;
      const request = pending.get(id);
      if (!request) {
        return;
      }
      pending.delete(id);
      if (error || !result) {
        request.reject(new Error(error ?? "compute failed"));
        return;
      }
      request.resolve(result);
    };
  }
  return worker;
}

export function computeMapData(
  map: any,
  prvince: string,
): Promise<MapComputeResult> {
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, map, prvince });
  });
}

export function terminateMapComputeWorker() {
  worker?.terminate();
  worker = null;
  pending.clear();
}
