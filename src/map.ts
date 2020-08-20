import hyper from "@macrostrat/hyper";
import { Component, useContext } from "react";
import { useAPIResult } from "@macrostrat/ui-components";
import { ResizeSensor } from "@blueprintjs/core";
import { useState } from "react";
import {
  PlateFeature,
  PlateFeatureLayer,
  RotationsContext,
} from "@macrostrat/corelle";
import {
  geoOrthographic,
  geoStereographic,
  geoGnomonic,
  geoNaturalEarth1,
} from "d3-geo";

import {
  Globe,
  MapContext,
  MapCanvasContext,
  FeatureLayer,
} from "@macrostrat/map-components";

import "@macrostrat/map-components/dist/esm/index.css";
import styles from "./main.styl";

const h = hyper.styled(styles);

function Map(props) {
  const [size, setSize] = useState({
    width: 1100,
    height: 800,
  });

  function onResize(entries) {
    const { width, height } = entries[0].contentRect;
    return setSize({ width, height });
  }

  const { width, height } = size;
  const projection = geoGnomonic().precision(0.5);

  return h(
    ResizeSensor,
    { onResize },

    h(
      "div.world-map",
      null,
      h(
        Globe,
        {
          keepNorthUp: true,
          projection,
          width,
          height,
          scale: Math.max(width, height) / 2 - 20,
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
    )
  );
}

export { Map };
