import h from "@macrostrat/hyper";

import { useState, useEffect } from "react";
import { Map } from "./map";
import { ResizeSensor } from "@blueprintjs/core";
import { RotationsProvider } from "@macrostrat/corelle";
import { Timescale } from "@macrostrat/timescale";
import "@macrostrat/timescale/dist/timescale.css";

function App(props) {
  const model = "Wright2013";
  const [time, setTime] = useState(300);

  const [size, setSize] = useState({
    width: 1100,
    height: 800,
  });

  function onResize(entries) {
    const { width, height } = entries[0].contentRect;
    return setSize({ width, height });
  }

  const { width, height } = size;

  return h(ResizeSensor, { onResize }, [
    h("div.app", [
      h(RotationsProvider, { model, time, debounce: 1000 }, [
        h(Map, { width, height: height - 100 }),
      ]),
      h(Timescale, {
        ageRange: [542, 0],
        orientation: "horizontal",
        length: size.width - 20,
        absoluteAgeScale: true,
        rootInterval: 751,
        levels: [2, 3],
        cursorPosition: time,
        axisProps: {
          orientation: "top",
          tickLength: 4,
          hideAxisLine: true,
          labelOffset: 10,
        },
        onClick(event, age) {
          setTime(age);
        },
      }),
    ]),
  ]);
}

export { App };
