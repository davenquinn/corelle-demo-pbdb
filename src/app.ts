import h from "@macrostrat/hyper";

import { useState, useEffect } from "react";
import { Map } from "./map";
import { RotationsProvider } from "@macrostrat/corelle";

function App(props) {
  const model = "Wright2013";
  const time = 300;

  return h("div", [
    h(RotationsProvider, { model, time, debounce: 1000 }, h(Map)),
  ]);
}

export { App };
