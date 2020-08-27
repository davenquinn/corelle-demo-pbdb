import { geoNaturalEarth1 } from "d3-geo";
import { PlateFeatureLayer } from "@macrostrat/corelle";
import { hyperStyled } from "@macrostrat/hyper";
import { Globe } from "@macrostrat/map-components";

import "@macrostrat/map-components/dist/esm/index.css";
import styles from "./main.styl";

const h = hyperStyled(styles);

function Map(props) {
  const { width, height } = props;
  const projection = geoNaturalEarth1().precision(0.5);

  return h(
    "div.world-map",
    null,
    h(
      Globe,
      {
        keepNorthUp: true,
        projection,
        width,
        height,
        allowZoom: false,
        //allowDrag: false,
        scale: Math.min(width / 5.5, height / 3) - 10,
      },
      [
        //h(PlatePolygons),
        h(PlateFeatureLayer, {
          name: "ne_110m_land",
          style: {
            fill: "#E9FCEA",
            stroke: "#9dc99f",
          },
        }),
      ]
    )
  );
}

export { Map };
