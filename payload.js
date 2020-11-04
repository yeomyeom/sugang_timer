var currentUrl = location.href; // current url
chrome.runtime.sendMessage({'url': currentUrl})