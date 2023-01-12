let mainForm

const GetDeal = async () => {
  return (await chrome.storage.local.get(['copied_deal'])).copied_deal
}

function WaitUntilElementLoad(selector, func, delay) {
  if(document.querySelector(selector) != null){
      func()
  } else setTimeout(()=>WaitUntilElementLoad(selector, func, delay), delay)
}

function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

  return new Blob([ia], { type: mimeString })
}

const LoadImage = async (b64, fileName) => {
  let formData = new FormData()
  formData.append('name', fileName)
  formData.append('action', 'upload-attachment')
  formData.append('_wpnonce', '105c5f9a43')
  formData.append('post_id', '379')
  formData.append('async-upload', DataURIToBlob(b64), fileName + '.jpeg')
  
  let result = await fetch("/wp-admin/async-upload.php",
    {
        body: formData,
        method: "post"
    }
  )

  return await result.json()
}
  

const PasteDeal = async () => {
  let deal = await GetDeal()

  let titlePlaceHolder = mainForm.querySelector('label[id*="title-prompt-text"]')
  let title = mainForm.querySelector('input[id*="title"]')

  let contentHTMLButton = mainForm.querySelector('button[id*="content-html"]')
  let contentTMCEButton = mainForm.querySelector('button[id*="content-tmce"]')
  let contentArea = mainForm.querySelector('textarea[id*="content"]')

  let originalPriceInput = mainForm.querySelector('div[data-name="original_price"] input')
  let salesPriceInput = mainForm.querySelector('div[data-name="sale_price"] input')
  let linkInput = mainForm.querySelector('div[data-name="link"] input')

  let setThumbnailButton = document.querySelector('a[id="set-post-thumbnail"]')
  let stores = document.querySelectorAll('li[id^="stores"]')

  title.value = deal.title
  titlePlaceHolder.classList.add("screen-reader-text")

  contentHTMLButton.click()
  deal.detailsDescription.replaceAll('</br>', '\n')
  contentArea.value = deal.detailsDescription
  contentTMCEButton.click()

  originalPriceInput.value = deal.oldListPrice
  salesPriceInput.value = deal.price
  linkInput.value = deal.buyNowUrl

  stores.forEach((store) => {
    let storeName = store.querySelector('label').innerText.trim()
    if(storeName === deal.storeName){
      store.querySelector('input').click()
    }
  })

  await LoadImage(deal.mainImageB64, deal.title)
  setThumbnailButton.click()

  WaitUntilElementLoad('div[class*="attachments-wrapper"] li', function () {
    document.querySelector('div[class*="attachments-wrapper"] li').click()
    document.querySelector('div[class*="media-toolbar"] button').click()

    let pastedAlertDiv = document.querySelector('div[id*="pastedAlertDiv"]')
    pastedAlertDiv.hidden = false
    setTimeout(() => { pastedAlertDiv.hidden = true }, 3000)
  
    console.log('Pasted Values => ')
    console.log(deal)
  }, 500)
}

const AddPasteDealButton = () => {
  let button = document.createElement('button')
  button.style = "border: 1px solid green; border-radius: 10px; width: 125px; height: 50px; background-color: #f6f6f6;"
  button.innerText = "Paste Deal"
  button.type = 'button'
  button.onclick = () => {
    PasteDeal()
  }

  let alert = document.createElement("div")
  alert.innerText = 'Pasted!'
  alert.id = 'pastedAlertDiv'
  alert.hidden = true

  // let headDiv = mainForm.querySelector('div[id="headings"]>div')
  mainForm.prepend(document.createElement('br'))
  mainForm.prepend(button)
  mainForm.prepend(document.createElement('br'))
  mainForm.prepend(alert)
}

if (!mainForm) {
  mainForm = document.querySelector('form[id*="post"]')
  if (mainForm) {
    AddPasteDealButton()
  }
}