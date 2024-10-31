// src/components/globe/GlobeVisualization.js
import Globe from "globe.gl";
import { markerSvg, getTooltipHTML } from "./MarkerUtils";

export function initGlobe(container, onClickHandler, onHoverHandler) {
  const globe = Globe()
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
    .htmlElement((d) => {
      const el = document.createElement("div");
      el.className = "marker-container";
      el.innerHTML = markerSvg;
      el.style.width = "24px";
      el.style.height = "36px";
      el.style.position = "relative";
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";
      el.style.pointerEvents = "auto";

      const tooltip = document.createElement("div");
      tooltip.innerHTML = getTooltipHTML(d.label || "Unknown");
      tooltip.style.position = "absolute";
      tooltip.style.top = "-40px";
      tooltip.style.left = "50%";
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.whiteSpace = "nowrap";
      tooltip.style.zIndex = "1000";
      el.appendChild(tooltip);

      el.addEventListener("mouseenter", () => onHoverHandler(d));

      return el;
    })
    .htmlAltitude(0.01)
    .onGlobeClick(onClickHandler);

  globe(container);
  return globe;
}

export function updateGlobe(globe, places) {
  if (globe) {
    globe.htmlElementsData(places);
  }
}