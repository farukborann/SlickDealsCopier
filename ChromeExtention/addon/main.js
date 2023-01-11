chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete') {
    if(tab.url.includes('slickdeals.net')){
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['addon/SlickDeals.js']
      })
    }
    else if(tab.url.includes('localhost:4000')){
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['addon/TestPage.js']
      })
    } 
  }
})
