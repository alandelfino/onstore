import { embedStyles } from "./embed/styles.js";
import { layout3DCard } from "./embed/layout-3d-card.js";
import { layoutSlider } from "./embed/layout-slider.js";
export const publicScript = `
(function() {
  var API_ORIGIN = "__API_ORIGIN__";

  function escAttr(s) { return String(s).replace(/"/g,"&quot;"); }
  var __name = function(n, t) { return n; };

${embedStyles}

${layout3DCard}

${layoutSlider}

  function buildCarousel(el, data) {
    var layout = data.carousel.layout || "3d-card";
    if (layout === "3d-card") {
      build3DCard(el, data);
    } else if (layout === "slider") {
      buildSlider(el, data);
    } else {
      console.warn("[Vidshop] Modelo de carrossel não suportado:", layout);
    }
  }

  function init() {
    injectStyles();
    var els = document.querySelectorAll("[data-vidshop-carousel], [data-onstore-carousel]");
    els.forEach(function(el) {
      var cid = el.getAttribute("data-vidshop-carousel") || el.getAttribute("data-onstore-carousel");
      if (!cid || el.dataset.vidshopLoaded) return;
      el.dataset.vidshopLoaded = "1";
      fetch(API_ORIGIN + "/api/public/carousels/" + cid)
        .then(function(r) { return r.json(); })
        .then(function(data) { buildCarousel(el, data); })
        .catch(function(e) { console.warn("[Vidshop] Erro carrossel #" + cid, e); });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
`;
