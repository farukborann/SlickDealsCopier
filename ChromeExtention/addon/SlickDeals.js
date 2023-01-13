let mainColum, copyDealButton

const SetCopiedDeal = async (deal) => {
  await chrome.storage.local.set({ copied_deal: deal })
}

const imageUrlToBase64 = async (url) => {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((onSuccess, onError) => {
    try {
      const reader = new FileReader() 
      reader.onload = function(){ onSuccess(this.result) }
      reader.readAsDataURL(blob)
    } catch(e) {
      onError(e)
    }
  })
}

const CopyDeal = async () => {
  let deal = {}
  
  deal.title = mainColum.querySelector('div[id*="dealTitle"]>h1').innerText
  deal.price = mainColum.querySelector('div[class*="dealPrice"]').innerText

  let oldListPriceSpan = mainColum.querySelector('span[class*="oldListPrice"]')
  deal.oldListPrice = oldListPriceSpan ? oldListPriceSpan.innerText : ''

  let buyNowButton = mainColum.querySelector('div[class*="buyNowButton"]>a')
  deal.storeName = buyNowButton.getAttribute('data-storename')
  deal.buyNowUrl = 'https://slickdeals.net/?tid=' + buyNowButton.getAttribute('data-product-products')

  deal.mainImageUrl = mainColum.querySelector('div[class*="mainImageContainer"]>a>img').src
  deal.detailsDescription = mainColum.querySelector('div[id*="detailsDescription"]').innerHTML
  deal.cuponsLink = mainColum.querySelector('span[class*="blueprint"]>button').dataset.href
  
  deal.mainImageB64 = await imageUrlToBase64(mainColum.querySelector('div[class*="mainImageContainer"]>a>img').src)
  await SetCopiedDeal(deal)

  let copiedAlertDiv = document.querySelector('div[id*="copiedAlertDiv"]')
  copiedAlertDiv.hidden = false
  setTimeout(() => { copiedAlertDiv.hidden = true }, 3000)

  console.log('Copied Values => ')
  console.log(deal)

  copyDealButton.disabled = true
  copyDealButton.style = "border: 1px solid Gray; border-radius: 10px; width: 125px; height: 50px; background-color: #f6f6f6;"
}

const AddCopyDealButton = () => {
  copyDealButton = document.createElement('button')
  copyDealButton.style = "border: 2px solid DodgerBlue; border-radius: 10px; width: 125px; height: 50px; background-color: #f6f6f6;"
  copyDealButton.innerText = "Copy Deal"
  copyDealButton.onclick = () => {
    CopyDeal()
  }

  let alert = document.createElement("div")
  alert.innerText = 'Copied!'
  alert.id = 'copiedAlertDiv'
  alert.hidden = true

  let headDiv = mainColum.querySelector('div[id="headings"]>div')
  if(!headDiv) return
  headDiv.appendChild(document.createElement('br'))
  headDiv.appendChild(copyDealButton)
  headDiv.appendChild(document.createElement('br'))
  headDiv.appendChild(alert)
}

if (!mainColum) {
  mainColum = document.querySelector('div[id*="mainColumn"]')
  if (mainColum) {
    AddCopyDealButton()
  }
}