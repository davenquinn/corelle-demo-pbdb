/// https://paleobiodb.org/data1.2/colls/summary.json?show=time&min_ma=10&max_ma=12&level=3

import { useMemo } from "react";
import { useAPIResult } from "@macrostrat/ui-components";
import {
  useRotations,
  usePathGenerator,
  usePlatePolygons,
} from "@macrostrat/corelle";
import { geoContains } from "d3-geo";
import { scalePow } from "d3-scale";
import h from "@macrostrat/hyper";

function usePBDBFeatures(...args: Parameters<typeof useAPIResult>) {
  /** Get features and assign to plates */
  const res = useAPIResult<{ records: any[] }>(...args);

  const polygons = usePlatePolygons();

  const platePoints = useMemo(() => {
    /** Memoized computation of polygon-point intersections */
    if (res == null || polygons == null) return [];

    let output = [];
    for (const rec of res.records) {
      for (const plate of polygons) {
        if (geoContains(plate, [rec.lng, rec.lat])) {
          const { old_lim, plate_id, young_lim } = plate.properties;
          output.push({
            ...rec,
            old_lim,
            plate_id,
            young_lim,
          });
          break;
        }
      }
    }
    return output;
  }, [res, polygons]);

  return platePoints;
}

const radiusScale = scalePow([0, 30], [1, 10]).exponent(0.5).clamp(true);
const opacityScale = scalePow([0, 30], [0.8, 0.2]).exponent(0.5).clamp(true);

function PBDBPoint({ feature }) {
  /** Render a single PBDB point */
  const proj = usePathGenerator(feature.plate_id);
  const { time } = useRotations();
  if (proj == null) return null;
  if (time < feature.young_lim || time > feature.old_lim) return null;

  const { noc, nco, lng, lat } = feature;
  const radius = radiusScale(nco + noc);
  const pt = proj.pointRadius(radius)({
    coordinates: [lng, lat],
    type: "Point",
  });

  if (pt == null) return null;
  return h("path.pbdb-collection", {
    opacity: opacityScale(nco + noc),
    d: pt,
    fill: "purple",
    stroke: "violet",
  });
}

export function PBDBCollectionLayer() {
  const { time } = useRotations();
  const features = usePBDBFeatures(
    "https://paleobiodb.org/data1.2/colls/summary.json",
    {
      show: "time",
      min_ma: time - 2,
      max_ma: time + 2,
      level: 3,
    }
  );

  return h(
    "g.pbdb-collections",
    {},
    features.map((d, i) => {
      return h(PBDBPoint, { feature: d });
    })
  );
}
