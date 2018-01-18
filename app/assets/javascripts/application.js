/* global $ */
/* global GOVUK */

// add basic auth to all fetched resources - this is needed in heroku
// see https://github.com/revilossor/addauth
function addauth(username, password) {
  var value = 'Basic ' + btoa(username + ":" + password);

  (function(send) {
    XMLHttpRequest.prototype.send = function(data) {
      this.setRequestHeader('Authorization', value);
      send.call(this, data);
    };
  })(XMLHttpRequest.prototype.send);

  (function(fetch) {
    var headers = new Headers();
    headers.set('Authorization', value);
    window.fetch = function(data) {
      fetch.call(this, data, { headers: headers });
    };
  })(window.fetch);
};

var nameMetaTag = document.querySelector('meta[name="dwp-prs"]');
addauth(nameMetaTag.dataset.username, nameMetaTag.dataset.password)

// Warn about using the kit in production
if (window.console && window.console.info) {
    window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function() {
    // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
    // with role="button" when the space key is pressed.
    GOVUK.shimLinksWithButtonRole.init()

    // Show and hide toggled content
    // Where .multiple-choice uses the data-target attribute
    // to toggle hidden content
    var showHideContent = new GOVUK.ShowHideContent()
    showHideContent.init()
})




$(document).on('click', '.button-add-another', function(e) {
    var beforeThis = $(this).parents('.grid-row');
    e.preventDefault();
    insertFields(beforeThis);
    sortFields();
});

$(document).on('click', '.remove-list-item', function(e) {
    e.preventDefault();
    $(this).parents('.list-item-wrapper').remove();
    sortFields();
});

function insertFields(element) {
    element.before(
        '<div class="grid-row">' +
        '<div class="form-group-compound list-item-wrapper">' +
        '<h2 class="heading-medium">Item 1</h2>' +
        '<fieldset>' +
        '<div class="column-one-third no-padding">' +
        '<div class="form-group list-item">' +
        '<label class="form-label" for="field-x">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-x" name="field-x">' +
        '</div>' +
        '</div>' +
        '<div class="column-one-third no-padding">' +
        '<div class="form-group list-item">' +
        '<label class="form-label" for="field-x">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-x" name="field-x">' +
        '</div>' +
        '</div>' +
        '<div class="column-one-third no-padding">' +
        '<div class="list-item">' +
        '</div>' +
        '</div>' +
        '</fieldset>' +
        '<hr />' +
        '</div>' +
        '</div>'
    );
}

function sortFields() {
    var listCounter = 1;
    var inputCounter = 1;

    $(document).find('.list-item-wrapper').each(function() {
        $(this).find('h2').text('Item ' + listCounter);

        if ($(this).find('.remove-list-item').length === 0) {
            $(this).find('.list-item:last').append('<a id="remove-item-' + listCounter + '" class="remove-list-item" href="#">Remove this</a>');
        } else {
            $(this).find('.remove-list-item').attr('id', 'remove-item-' + listCounter);
        }

        $(this).find('.list-item').children('label').each(function() {
            $(this).attr('for', 'field-' + inputCounter);
            inputCounter++;
        });

        $(this).find('.list-item').children('input').each(function() {
            var labelNo = $(this).parent().find('label').attr('for').split('-').pop();
            $(this).attr('id', 'field-' + labelNo);
            $(this).attr('name', 'field-' + labelNo);
        });

        listCounter++;
    });

    if ($(document).find('.list-item-wrapper').length === 1) {
        $('.remove-list-item').remove();
    }
}

$(document).on('click', '.button-add-another-vertical', function(e) {
    e.preventDefault();
    var beforeThis = $(this).parents('.list-item-wrapper-vertical').find('.grid-row').last();
    $(beforeThis).before(
        '<div class="grid-row">' +
        '<div class="column-two-thirds">' +
        '<div class="form-group-compound">' +
        '<h2 class="heading-medium">Item 1</h2>' +
        '<div class="form-group">' +
        '<label class="form-label" for="field-1">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-1" name="field-1">' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label" for="field-2">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-2" name="field-2">' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label" for="field-3">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-3" name="field-3">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="column-one-third">' +
        '</div>' +
        '</div>' +
        '<hr />'
    );
    sortFieldsVertical();
});

function sortFieldsVertical() {
    var listCounter = 1;
    var inputCounter = 1;

    $(document).find('.list-item-wrapper-vertical .grid-row').each(function() {
        $(this).find('h2').text('Item ' + listCounter);

        if ($(this).find('.remove-list-item-vertical').length === 0) {
            $(this).find('.column-one-third:last').append('<a id="remove-item-vertical-' + listCounter + '" class="remove-list-item-vertical" href="#">Remove this</a>');
        } else {
            $(this).find('.remove-list-item-vertical').attr('id', 'remove-item-vertical-' + listCounter);
        }

        $(this).find('label').each(function() {
            $(this).attr('for', 'field-' + inputCounter);
            inputCounter++;
        });

        $(this).find('input').each(function() {
            var labelNo = $(this).parent().find('label').attr('for').split('-').pop();
            $(this).attr('id', 'field-' + labelNo);
            $(this).attr('name', 'field-' + labelNo);
        });

        listCounter++;
    });

    if ($(document).find('.list-item-wrapper-vertical .grid-row').length === 2) {
        $('.remove-list-item-vertical').remove();
    }
}

$(document).on('click', '.remove-list-item-vertical', function(e) {
    e.preventDefault();
    $(this).parents('.grid-row').prev('hr').remove();
    $(this).parents('.grid-row').remove();
    sortFieldsVertical();
});




// Alternative pattern

// Use this when:

//     there is a single entry, eg a list of conditions or disabilities
// Item 1

// Field label

// Field label

// Field label

// Add another
// View code snippet
// Content and use notes

// Users don 't always see the add another button and may comma separate in a single box. Access to Work found that having 3 boxes on screen hepled to prompt '
// one thing per box '.
// Give an example of the type of thing that could be listed.
// An alternative pattern being used in Access to Work is to give a radio list of the most popular answers by data, and then have an 'Anything else?'
// question, which then allows the user to enter a list.
// Built by DWP Digital

// Open Government Licence
// All content is available under the Open Government Licence v3 .0, except where otherwise stated

// © Crown copyright
