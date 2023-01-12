wpnonceDiv = document.createElement('div')
wpnonceDiv.id = "wpnonce"
wpnonceDiv.setAttribute('data-value', _wpPluploadSettings.defaults.multipart_params._wpnonce)

document.head.appendChild(wpnonceDiv)
console.log(wpnonceDiv)