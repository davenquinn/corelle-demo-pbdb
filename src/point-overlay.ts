/// https://paleobiodb.org/data1.2/colls/summary.json?show=time&min_ma=10&max_ma=12&level=3

import { useContext, useMemo } from "react";
import { useAPIResult } from "@macrostrat/ui-components";
import {
  useRotations,
  useRotationsAPI,
  RotationsContext,
  PlateFeatureLayer,
} from "@macrostrat/corelle";
import { geoContains } from "d3-geo";
import { scalePow } from "d3-scale";
import h from "@macrostrat/hyper";

import { geoTransform, geoPath } from "d3-geo";
import {
  MapContext,
  MapCanvasContext,
  FeatureLayer,
} from "@macrostrat/map-components";

function useProjection(plateId, context = null) {
  // Filter out features that are too young
  const { geographyRotator } = useContext(RotationsContext);
  const { projection } = useContext(MapContext);
  if (projection == null || geographyRotator == null) return null;

  const rotate = geographyRotator(plateId);
  if (rotate == null) return null;

  const trans = geoTransform({
    point(lon, lat) {
      const [x, y] = rotate([lon, lat]);
      return this.stream.point(x, y);
    },
  });

  // This ordering makes no sense but whatever
  const stream = (s) =>
    // https://stackoverflow.com/questions/27557724/what-is-the-proper-way-to-use-d3s-projection-stream
    trans.stream(projection.stream(s));

  // Make it work in canvas
  return geoPath({ stream }, context);
}

function usePlatePolygons(modelOverride: string | null = null) {
  const { model } = useContext<any>(RotationsContext);
  return useRotationsAPI("/plates", { model: modelOverride ?? model });
}

function useFeatures(...args: Parameters<typeof useAPIResult>) {
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
  const proj = useProjection(feature.plate_id);
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
  const features = useFeatures(
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
