function setFontSize() {
    const doc = window.document
    const $html = doc.getElementsByTagName('html')[0]
    const windowWidth =
      doc.documentElement.clientWidth || doc.body.clientWidth || window.innerWidth
    window.fsize = windowWidth / 3.75
    $html.style.fontSize = `${window.fsize}px`
  }
  window.onload = setFontSize
  setFontSize()
  window.onresize = setFontSize