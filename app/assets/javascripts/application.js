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
            return fetch.call(this, data, { headers: headers });
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
