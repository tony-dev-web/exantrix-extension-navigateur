// Lit la fiche produit de la page courante : JSON-LD Product d'abord, Open Graph et balises classiques en repli.
// Aucune donnee n'est envoyee sans un clic dans la fenetre de l'extension.
(function () {
  function texte(s) { return (s || "").toString().replace(/\s+/g, " ").trim(); }
  function prix(v) { const m = texte(v).replace(",", ".").match(/\d+(?:\.\d+)?/); return m ? m[0] : ""; }
  function lireJsonLd() {
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      let d; try { d = JSON.parse(s.textContent); } catch (e) { continue; }
      const noeuds = [].concat(d["@graph"] || d);
      for (const n of noeuds) {
        if (!n || (n["@type"] !== "Product" && !(Array.isArray(n["@type"]) && n["@type"].includes("Product")))) continue;
        const offre = [].concat(n.offers || [])[0] || {};
        const images = [].concat(n.image || []).map(i => typeof i === "string" ? i : (i && (i.url || i.contentUrl))).filter(Boolean);
        return { titre: texte(n.name), description: texte(n.description), prix_ttc: prix(offre.price || offre.lowPrice), reference: texte(n.sku || n.mpn || n.productID), marque: texte(n.brand && (n.brand.name || n.brand)), images: images };
      }
    }
    return null;
  }
  function meta(p) { const e = document.querySelector(`meta[property="${p}"], meta[name="${p}"]`); return e ? texte(e.content) : ""; }
  function lireOg() {
    const images = [meta("og:image"), meta("og:image:secure_url"), meta("twitter:image")].filter(Boolean);
    return { titre: meta("og:title") || texte(document.title), description: meta("og:description") || meta("description"), prix_ttc: prix(meta("product:price:amount") || meta("og:price:amount")), reference: meta("product:retailer_item_id") || "", marque: meta("product:brand") || "", images: images };
  }
  chrome.runtime.onMessage.addListener((msg, exp, repondre) => {
    if (msg && msg.type === "lire_fiche") {
      const f = lireJsonLd() || lireOg();
      f.url_boutique = location.href.split("#")[0];
      f.images = [...new Set(f.images)].slice(0, 5);
      repondre(f);
    }
  });
})();
