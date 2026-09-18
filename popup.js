const API = "https://exantrix.com/api/v1";
const $ = id => document.getElementById(id);
let fiche = {};
function message(t, ok) { $("message").innerHTML = '<div class="' + (ok ? "ok" : "ko") + '">' + t + "</div>"; }
async function config() { return (await chrome.storage.local.get(["jeton", "categorie"])); }
async function lirePage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https?:/.test(tab.url || "")) return null;
  try { return await chrome.tabs.sendMessage(tab.id, { type: "lire_fiche" }); }
  catch (e) {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["contenu.js"] });
    try { return await chrome.tabs.sendMessage(tab.id, { type: "lire_fiche" }); } catch (e2) { return null; }
  }
}
async function afficher() {
  const c = await config();
  if (!c.jeton) { $("config").hidden = false; $("fiche").hidden = true; return; }
  $("config").hidden = true; $("fiche").hidden = false;
  $("cat2").value = c.categorie || "3d";
  fiche = (await lirePage()) || {};
  $("titre").value = (fiche.titre || "").slice(0, 60);
  $("reference").value = (fiche.reference || "").slice(0, 50);
  $("prix").value = fiche.prix_ttc || "";
  $("description").value = (fiche.description || "").slice(0, 160);
  $("images").innerHTML = (fiche.images || []).map(u => '<img src="' + u.replace(/"/g, "") + '" alt="">').join("");
  if (!fiche.titre) message("Aucune fiche produit détectée sur cette page : remplissez les champs à la main.", false);
}
$("enregistrer").onclick = async () => {
  await chrome.storage.local.set({ jeton: $("jeton").value.trim(), categorie: $("categorie").value });
  $("message").innerHTML = ""; afficher();
};
$("regler").onclick = async e => { e.preventDefault(); const c = await config(); $("jeton").value = c.jeton || ""; $("categorie").value = c.categorie || "3d"; $("config").hidden = false; $("fiche").hidden = true; };
$("envoyer").onclick = async () => {
  const c = await config();
  const produit = { reference: $("reference").value.trim(), titre: $("titre").value.trim(), categorie: $("cat2").value, prix_ttc: $("prix").value.replace(",", "."), stock: parseInt($("stock").value || "0", 10), description: $("description").value.trim(), information: (fiche.description || "").slice(0, 1255), marque: fiche.marque || "", images: fiche.images || [], url_boutique: fiche.url_boutique || "" };
  if (!produit.reference || !produit.titre || !produit.prix_ttc) { message("Référence, titre et prix sont obligatoires.", false); return; }
  $("envoyer").disabled = true;
  try {
    const r = await fetch(API + "/produits", { method: "PUT", headers: { "Authorization": "Bearer " + c.jeton, "Content-Type": "application/json" }, body: JSON.stringify({ produits: [produit] }) });
    const j = await r.json();
    if (r.ok && j.produits && j.produits.length) {
      const p = j.produits[0];
      message((p.cree ? "Produit créé, en attente de validation par Exantrix." : "Produit mis à jour.") + (p.url ? ' <a href="' + p.url + '" target="_blank">Voir</a>' : ""), true);
    } else message("Refusé : " + ((j.erreurs && j.erreurs[0] && j.erreurs[0].erreur) || j.erreur || r.status), false);
  } catch (e) { message("Exantrix injoignable : " + e.message, false); }
  $("envoyer").disabled = false;
};
afficher();
