var currentUrl = location.href; // current url
currentUrl = JSON.parse(JSON.stringify(currentUrl))
chrome.runtime.sendMessage(currentUrl)