// Menu contextuel "Faire fabriquer sur Exantrix" : ouvre le formulaire de devis pre-rempli avec ce qui est vu.
const DEVIS = "https://exantrix.com/a2/de1";
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "fabriquer", title: "Faire fabriquer sur Exantrix", contexts: ["page", "selection", "link", "image"] });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "fabriquer") return;
  const parts = [];
  if (info.selectionText) parts.push(info.selectionText.trim());
  if (info.srcUrl) parts.push("Image : " + info.srcUrl);
  if (info.linkUrl) parts.push("Lien : " + info.linkUrl);
  parts.push("Vu sur : " + (info.pageUrl || (tab && tab.url) || ""));
  const information = parts.join("\n").slice(0, 1200);
  chrome.tabs.create({ url: DEVIS + "?information=" + encodeURIComponent(information) });
});
