/// https://paleobiodb.org/data1.2/colls/summary.json?show=time&min_ma=10&max_ma=12&level=3

import { useAPIResult } from "@macrostrat/ui-components";
import { useRotations, PlateFeatureLayer } from "@macrostrat/corelle";

function useFeatures(...args: Parameters<typeof useAPIResult>) {
  const res = useAPIResult(...args);
  return res;
}

export function PBDBCollectionLayer() {
  // const { time } = useRotations();
  // const features = useFeatures(
  //   "https://paleobiodb.org/data1.2/colls/summary.json",
  //   {
  //     show: "time",
  //     min_ma: time - 1,
  //     max_ma: time + 1,
  //     level: 3,
  //   }
  // );

  //console.log(features);

  return null;
}
