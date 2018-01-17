function handlePostcodeLookup(pickers) {
    function getButtonHandler(picker) {
        return function(e) {
            e.preventDefault()
            var postcode = picker.querySelector('input').value
            if (!postcode || postcode.length === 0) {
                return
            }
            postcode = postcode.toUpperCase()
            window.fetch('/postcode/' + postcode).then(function(raw) {
                return raw.json()
            }).then(function(response) {
                picker.querySelector('#input').className = 'hidden'
                var output = picker.querySelector('#output')
                output.querySelector('span').innerText = postcode
                output.querySelector('select').innerHTML = '<option value="">1 address found</option>'
                output.querySelector('select').innerHTML += '<option value="' + response.address + '">' + response.address + '</option>'
                output.className = ''
            })
        }
    }

    function getLinkHandler(picker) {
        return function(e) {
            e.preventDefault()
            picker.querySelector('#output').className += ' hidden'
            var input = picker.querySelector('#input')
            input.className = ''
        }
    }

    function getManualHandler(picker) {
        return function(e) {
            e.preventDefault()
            picker.querySelector('#input').className += ' hidden'
            var input = picker.querySelector('#manual')
            input.className = ''
        }
    }


    if (!pickers) { return }
    for (var i = 0; i < pickers.length; i++) {
        pickers[i].querySelector('button').addEventListener('click', getButtonHandler(pickers[i]))
        pickers[i].querySelector('a#change').addEventListener('click', getLinkHandler(pickers[i]))
        pickers[i].querySelector('a#address-manual').addEventListener('click', getManualHandler(pickers[i]))

    }
}

handlePostcodeLookup(document.querySelectorAll('div.address-picker'))