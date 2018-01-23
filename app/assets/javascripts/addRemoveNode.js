(function () {
  function addRemoveNode (addSelector, removeSelector, nodeSelector) {  // eslint-disable-line no-unused-vars
    if (!addSelector) { throw new Error('no add element selector was passed!') }
    if (!removeSelector) { throw new Error('no remove element selector was passed!') }
    if (!nodeSelector) { throw new Error('no node element selector was passed!') }

    var addElements = document.querySelectorAll(addSelector)
    if (addElements.length === 0) { throw new Error('add element selector query returned no results!') }

    var removeElements = document.querySelectorAll(removeSelector)
    if (removeElements.length === 0) { throw new Error('remove element selector query returned no results!') }

    var nodeElements = document.querySelectorAll(nodeSelector)
    if (nodeElements.length === 0) { throw new Error('node element selector query returned no results!') }

    function ancestorSeletor (element, selector) {
      var result = element.msMatchesSelector
        ? element.msMatchesSelector(selector)
        : element.matches(selector)
      return result ? element : ancestorSeletor(element.parentNode, selector)
    }

    function getRemoveNodeHandler (removeElement) {
      return function removeNodeHandler (e) {
        e.preventDefault()
        var ancestorNode = ancestorSeletor(removeElement, nodeSelector)
        ancestorNode.parentNode.removeChild(ancestorNode)
      }
    }

    function getAddNodeHandler (addElement) {
      var parentNode = nodeElements[0].parentNode
      var templateNode = nodeElements[0].cloneNode(true)
      return function addNodeHandler (e) {
        e.preventDefault()
        var newNode = templateNode.cloneNode(true)
        parentNode.appendChild(newNode)
        var newRemove = newNode.querySelector(removeSelector)
        newRemove.addEventListener('click', getRemoveNodeHandler(newRemove))
      }
    }

    for (var i = 0; i < addElements.length; i++) {
      addElements[i].addEventListener('click', getAddNodeHandler(addElements[i]))
    }

    for (var j = 0; j < removeElements.length; j++) {
      removeElements[j].addEventListener('click', getRemoveNodeHandler(removeElements[j]))
    }
  }
  window.addRemoveNode = addRemoveNode
})()
