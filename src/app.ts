import h from "@macrostrat/hyper";

import { useState, useEffect } from "react";
import { Map } from "./map";
import { ResizeSensor } from "@blueprintjs/core";
import { RotationsProvider } from "@macrostrat/corelle";
import { Timescale } from "@macrostrat/timescale";
import "@macrostrat/timescale/dist/timescale.css";

function Credits() {
  return h("div.credits", [
    h("h1", "Corelle demo"),
    h("p", "Client-side rotation of PBDB collections."),
    h("p", [h("a.author", { href: "https://davenquinn.com" }, "Daven Quinn")]),
    h("p", [h("span.version", "v1.0.0"), ", ", h("span.date", "August 2020")]),
    h("p", [
      h(
        "a",
        { href: "https://github.com/UW-Macrostrat/corelle-pbdb-demo" },
        "Code on GitHub"
      ),
    ]),
  ]);
}

function useTimeRange(range, initialValue) {
  /** A time range that can be stepped through with arrow keys */
  const [time, setTime] = useState(initialValue);

  useEffect(() => {
    function checkKey(e) {
      e = e || window.event;
      if (e.keyCode == "37") {
        // left arrow
        setTime(Math.min(time + 2, range[0]));
      } else if (e.keyCode == "39") {
        // right arrow
        setTime(Math.max(time - 2, range[1]));
      }
    }
    document.onkeydown = checkKey;
  }, [time]);

  return [time, setTime];
}

function App(props) {
  const model = "Wright2013";

  const [time, setTime] = useTimeRange([542, 0], 300);

  const [size, setSize] = useState({
    width: 1100,
    height: 800,
  });

  return h(
    ResizeSensor,
    {
      onResize(entries) {
        const { width, height } = entries[0].contentRect;
        return setSize({ width, height });
      },
    },
    [
      h("div.app", [
        h(Credits),
        h(RotationsProvider, { model, time, debounce: 1000 }, [
          h(Map, { width: size.width, height: size.height - 100 }),
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
    ]
  );
}

export { App };
