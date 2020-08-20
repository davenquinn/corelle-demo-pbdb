import h from "@macrostrat/hyper";

import { useState } from "react";
import { Map } from "./map";
import { RotationsProvider } from "@macrostrat/corelle";
import {
  APIProvider,
  APIContext,
  useAPIResult,
} from "@macrostrat/ui-components";

function App(props) {
  const model = "Seton2012";
  const [time, setTime] = useState(0);

  return h("div", [
    h(RotationsProvider, { model, time, debounce: 1000 }, [h(Map)]),
  ]);
}

export { App };
