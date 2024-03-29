import h from "@macrostrat/hyper";
import { version } from "../package.json"

function Credits() {
  return h("div.credits", [
    h("h1", "Corelle"),
    h("p", "Client-side rotation of PBDB collections."),
    h("p", [h("a.author", { href: "https://davenquinn.com" }, "Daven Quinn")]),
    h("p", [h("span.version", `v${version}`), ", ", h("span.date", "August 2021")]),
    h("p", [
      h(
        "a",
        { href: "https://github.com/davenquinn/corelle-demo-pbdb" },
        "Code on GitHub"
      ),
    ]),
    h("p", [
      "Rotations: ",
      h(
        "i",
        null,
        h(
          "a",
          { href: "https://dx.doi.org/10.5194/bg-10-1529-2013" },
          "Wright et al., 2013"
        )
      ),
    ]),
  ]);
}

export { Credits };
