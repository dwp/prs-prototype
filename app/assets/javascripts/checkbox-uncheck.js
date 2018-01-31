(function () {
  function ancestorSelector (element, selector) {
    var result = element.msMatchesSelector
      ? element.msMatchesSelector(selector)
      : element.matches(selector)
    return result ? element : ancestorSelector(element.parentNode, selector)
  }

  function getCheckboxWithUncheckClickHandler (checkbox) {
    var neighbourCheckboxes = ancestorSelector(checkbox, '.form-group').querySelectorAll('input[type="checkbox"]')
    return function handleCheckboxWithUncheckClick (e) {
      for (var i = 0; i < neighbourCheckboxes.length; i++) {
        if (e.target.dataset.uncheck.indexOf(neighbourCheckboxes[i].value) !== -1) {
          neighbourCheckboxes[i].checked = false
        }
      }
    }
  }

  function setup () {
    var allCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    for (var i = 0; i < allCheckboxes.length; i++) {
      if (allCheckboxes[i].dataset.uncheck) {
        allCheckboxes[i].addEventListener('click', getCheckboxWithUncheckClickHandler(allCheckboxes[i]))
      }
    }
  }

  function attach (clickElementSelector, checkboxContainerSelector) {
    if (!clickElementSelector) { throw new Error('no click element selector was passed') }
    if (!checkboxContainerSelector) { throw new Error('no checkbox container selector was passed') }

    var clickElements = document.querySelectorAll(clickElementSelector)
    var checkboxElements = document.querySelectorAll(checkboxContainerSelector + ' input[type="checkbox"]')

    for (var i = 0; i < clickElements.length; i++) {
      clickElements[i].addEventListener('click', function handleUncheckAllClick (e) {
        for (var j = 0; j < checkboxElements.length; j++) {
          checkboxElements[j].checked = false
        }
      })
    }
  }

  window.CHECKBOX_UNCHECK = {
    setup: setup,
    attach: attach
  }
})()
