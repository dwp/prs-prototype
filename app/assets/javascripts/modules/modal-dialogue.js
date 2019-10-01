// import '../../vendor/polyfills/Function/prototype/bind'
// import '../../vendor/polyfills/Event' // addEventListener and event.target

function ModalDialogue ($module) {
  this.$module = $module
  this.$button = $module.querySelector('button')

  // Check for browser support
  this.hasNativeDialog = 'showModal' in this.$module
}

// Initialize component
ModalDialogue.prototype.init = function (options) {
  this.options = options || {}

  // Must have focussable button
  if (!this.$button) {
    return this
  }

  this.open = this.handleOpen.bind(this)
  this.close = this.handleClose.bind(this)
  this.focusDialog = this.handleFocusDialog.bind(this)
  this.boundKeyDown = this.handleKeyDown.bind(this)

  this.isOpen = false

  // Optional trigger element
  if (this.options.triggerElement) {
    this.options.triggerElement.addEventListener('click', this.open)
  }

  // Optional close button
  if (this.options.closeButton) {
    this.options.closeButton.addEventListener('click', this.close)
  }

  return this
}

ModalDialogue.prototype.handleOpen = function () {
  if (this.isOpen) {
    return
  }

  this.hasNativeDialog
    ? this.$module.showModal()
    : this.$module.setAttribute('open', '')

  // Close on escape key
  document.addEventListener('keydown', this.boundKeyDown, true)

  // Mark open, handle focus
  this.isOpen = true
  this.focusDialog()

  // Optional 'onOpen' callback
  if (typeof this.options.onOpen === 'function') {
    this.options.onOpen.call(this)
  }
}

ModalDialogue.prototype.handleClose = function () {
  if (!this.isOpen) {
    return
  }

  this.hasNativeDialog
    ? this.$module.close()
    : this.$module.removeAttribute('open')

  // Remove escape key listener
  document.removeEventListener('keydown', this.boundKeyDown, true)

  // Optional 'onClose' callback
  if (typeof this.options.onClose === 'function') {
    this.options.onClose.call(this)
  }
}

ModalDialogue.prototype.handleFocusDialog = function () {
  this.$module.scrollIntoView()
  this.$button.focus({ preventScroll: true })
}

ModalDialogue.prototype.handleKeyDown = function (e) {
  var KEY_ESCAPE = 27

  if (e.keyCode === KEY_ESCAPE) {
    this.close()
  }
}
