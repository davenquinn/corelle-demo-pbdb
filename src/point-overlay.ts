/// https://paleobiodb.org/data1.2/colls/summary.json?show=time&min_ma=10&max_ma=12&level=3

import { useAPIResult } from "@macrostrat/ui-components";
import { PlateFeatureLayer } from "@macrostrat/corelle";

function useFeatures(...args: Parameters<typeof useAPIResult>) {
  const res = useAPIResult(...args);
}
