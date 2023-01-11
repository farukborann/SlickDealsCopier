let mainColum

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
  });
};


// function imgToBuffer(e){
//   fetch(e.src).then(async (res) => console.log(await res.blob()))
//   // var imgObj = new Image()
//   // imgObj.src = e.src
//   // imgObj.setAttribute('crossOrigin', '')
//   // imgObj.onload = function(){
//   //     let cnv = document.createElement("canvas")

//   //     let w = cnv.width = e.naturalWidth
//   //     let h = cnv.height = e.naturalHeight
//   //     // console.log('width : ' + e.naturalWidth)
//   //     // console.log('height : ' + e.naturalHeight)
//   //     let ctx = cnv.getContext("2d")
//   //     ctx.drawImage(imgObj,0,0)
    
//   //     console.log(cnv.toDataURL())
//   //     return ctx.getImageData(0,0,w,h)
//   // }
// }

const CopyDeal = async () => {
  let deal = {}

  deal.title = mainColum.querySelector('div[id*="dealTitle"]>h1').innerText
  deal.price = mainColum.querySelector('div[class*="dealPrice"]').innerText

  let oldListPriceSpan = mainColum.querySelector('span[class*="oldListPrice"]')
  deal.oldListPrice = oldListPriceSpan ? oldListPriceSpan.innerText : ''

  deal.mainImageUrl = mainColum.querySelector('div[class*="mainImageContainer"]>a>img').src
  deal.buyNowUrl = mainColum.querySelector('div[class*="buyNowButton"]>a').href
  deal.detailsDescription = mainColum.querySelector('div[id*="detailsDescription"]').innerHTML
  deal.cuponsLink = mainColum.querySelector('span[class*="blueprint"]>button').dataset.href
  
  deal.mainImageB64 = await imageUrlToBase64(mainColum.querySelector('div[class*="mainImageContainer"]>a>img').src)
  await SetCopiedDeal(deal)

  let copiedAlertDiv = document.querySelector('div[id*="copiedAlertDiv"]')
  copiedAlertDiv.hidden = false
  setTimeout(() => { copiedAlertDiv.hidden = true }, 3000)

  console.log('Copied Values => ')
  console.log(deal)
}

const AddCopyDealButton = () => {
  let button = document.createElement('button')
  button.style = "border: 1px solid green; border-radius: 10px; width: 125px; height: 50px; background-color: #f6f6f6;"
  button.innerText = "Copy Deal"
  button.onclick = () => {
    CopyDeal()
  }

  let alert = document.createElement("div")
  alert.innerText = 'Copied!'
  alert.id = 'copiedAlertDiv'
  alert.hidden = true

  let headDiv = mainColum.querySelector('div[id="headings"]>div')
  headDiv.appendChild(document.createElement('br'))
  headDiv.appendChild(button)
  headDiv.appendChild(document.createElement('br'))
  headDiv.appendChild(alert)
}

if (!mainColum) {
  mainColum = document.querySelector('div[id*="mainColumn"]')
  if (mainColum) {
    AddCopyDealButton()
  }
}