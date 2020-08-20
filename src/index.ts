/// https://paleobiodb.org/data1.2/colls/summary.json?show=time&min_ma=10&max_ma=12&level=3
import h from "@macrostrat/hyper";
import { render } from "react-dom";
import { App } from "./app";

const el = document.getElementById("root");
render(h(App), el);
