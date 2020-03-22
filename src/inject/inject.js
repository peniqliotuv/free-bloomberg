async function clearApplicationStorage() {
  await clearIndexedDB();
  clearLocalStorage();
  clearSessionStorage();
  clearCookies();
}

function clearCookies() {
  const allCookies = document.cookie.split(';');

  // The "expire" attribute of every cookie is
  // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
  for (let i = 0; i < allCookies.length; i++) {
    document.cookie = allCookies[i] + '=;expires=' + new Date(0).toUTCString();
  }
}

function clearLocalStorage() {
  window.localStorage.clear();
}

function clearSessionStorage() {
  window.sessionStorage.clear();
}

function removePaywallBanner() {
  const paywallBanner = document.getElementById('paywall-banner');
  paywallBanner.parentNode.removeChild(paywallBanner);

  const bannerOutlet = document.getElementById('banner-outlet');
  bannerOutlet.parentNode.removeChild(bannerOutlet);
}

async function clearIndexedDB() {
  const dbs = await window.indexedDB.databases();
  dbs.forEach(db => {
    window.indexedDB.deleteDatabase(db.name);
  });
}

chrome.extension.sendMessage({}, response => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      clearApplicationStorage().then(removePaywallBanner);
    }
  }, 10);
});
