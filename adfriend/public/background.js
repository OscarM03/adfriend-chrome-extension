chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: "index.html"
    })
});

chrome.tabs.onCreated.addListener((tab) => {
    const url = tab.url;
    if (tab.id && url) {
        if (url.startsWith("chrome-extension://")) {
            console.log('Extension page');
            return;
        }
        injectContentScript(tab.id, url);
    } else {
        console.log('Tab id or url not found');
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith("chrome-extension://")) {
        injectContentScript(tabId);
    }
});

const injectContentScript = (tabId) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
    });
}