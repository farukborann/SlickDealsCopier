let mainForm

const GetDeal = async () => {
  return (await chrome.storage.local.get(['copied_deal'])).copied_deal
}

// function Base64ToBlob(b64Data, contentType, sliceSize) {
//   contentType = contentType || 'image/png';
//   sliceSize = sliceSize || 512;

//   var byteCharacters = atob(b64Data);
//   var byteArrays = [];

//   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     var slice = byteCharacters.slice(offset, offset + sliceSize);

//     var byteNumbers = new Array(slice.length);
//     for (var i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     var byteArray = new Uint8Array(byteNumbers);

//     byteArrays.push(byteArray);
//   }
    
//   var blob = new Blob(byteArrays, {type: contentType});
//   return blob;
// }

const PasteDeal = async () => {
  let deal = await GetDeal()

  let title = mainForm.querySelector('input[id*="title"]')
  let price = mainForm.querySelector('input[id*="price"]')
  let oldListPrice = mainForm.querySelector('input[id*="oldListPrice"]')
  let mainImage = mainForm.querySelector('[id*="mainImage"]')
  let buyNowUrl = mainForm.querySelector('input[id*="buyNowUrl"]')
  let detailsDescription = mainForm.querySelector('div[id*="detailsDescription"]>p')
  let cuponsLink = mainForm.querySelector('input[id*="cuponsLink"]')

  title.value = deal.title
  price.value = deal.price
  oldListPrice.value = deal.oldListPrice
  buyNowUrl.value = deal.buyNowUrl
  detailsDescription.innerHTML = deal.detailsDescription
  cuponsLink.value = deal.cuponsLink
  
  // let imgBlob = convertBase64ToBlob(deal.mainImageBuffer)
  // let imgUrl = URL.createObjectURL(imgBlob)
  mainImage.src = deal.mainImageB64

  let pastedAlertDiv = document.querySelector('div[id*="pastedAlertDiv"]')
  pastedAlertDiv.hidden = false
  setTimeout(() => { pastedAlertDiv.hidden = true }, 3000)

  console.log('Pasted Values => ')
  console.log(deal)
}

const AddPasteDealButton = () => {
  let button = document.createElement('button')
  button.style = "border: 1px solid green; border-radius: 10px; width: 125px; height: 50px; background-color: #f6f6f6;"
  button.innerText = "Paste Deal"
  button.onclick = () => {
    PasteDeal()
  }

  let alert = document.createElement("div")
  alert.innerText = 'Pasted!'
  alert.id = 'pastedAlertDiv'
  alert.hidden = true

  // let headDiv = mainForm.querySelector('div[id="headings"]>div')
  mainForm.appendChild(document.createElement('br'))
  mainForm.appendChild(button)
  mainForm.appendChild(document.createElement('br'))
  mainForm.appendChild(alert)
}

if (!mainForm) {
  mainForm = document.querySelector('div[id*="mainForm"]')
  if (mainForm) {
    AddPasteDealButton()
  }
}