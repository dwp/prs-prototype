// import '../../vendor/polyfills/Element/prototype/classList'
// import '../../vendor/polyfills/Function/prototype/bind'
// import '../../vendor/polyfills/Event' // addEventListener and event.target

// Workaround for missing NodeList.forEach in legacy browsers
// https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/common.js#L6
function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

function ModalDialogue ($module) {
  this.$module = $module
  this.$dialogBox = $module.querySelector('dialog')
  this.$container = document.documentElement

  // Check for browser support
  this.hasNativeDialog = 'showModal' in this.$dialogBox

  // Allowed focussable elements
  this.focussable = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])'
  ]
}

// Initialize component
ModalDialogue.prototype.init = function (options) {
  this.options = options || {}

  this.open = this.handleOpen.bind(this)
  this.close = this.handleClose.bind(this)
  this.focus = this.handleFocus.bind(this)
  this.boundKeyDown = this.handleKeyDown.bind(this)

  // Elements to allow focus on
  this.$focussable = this.$dialogBox.querySelectorAll(this.focussable.toString())
  this.$focusableLast = this.$focussable[this.$focussable.length - 1]
  this.$focusElement = this.options.focusElement || this.$dialogBox

  // Close button
  this.$buttonClose = this.$dialogBox.querySelector('.govuk-modal-dialogue__close')

  // Default open state
  this.isOpen = this.$dialogBox.hasAttribute('open')

  // Optional trigger element
  if (this.options.triggerElement) {
    this.options.triggerElement.addEventListener('click', this.open)
  }

  // Close dialogue on close button click
  this.$buttonClose.addEventListener('click', this.close)

  return this
}

// Open modal
ModalDialogue.prototype.handleOpen = function (event) {
  if (event) {
    event.preventDefault()
  }

  // Skip open if already open
  if (this.isOpen) {
    return
  }

  // Save last-focussed element
  this.$lastActiveElement = document.activeElement

  // Disable scrolling, show wrapper
  this.$container.classList.add('govuk-!-scroll-disabled')
  this.$module.classList.add('govuk-modal-dialogue--open')

  // Show modal
  this.hasNativeDialog
    ? this.$dialogBox.show()
    : this.$dialogBox.setAttribute('open', '')

  // Mark open, handle focus
  this.isOpen = true
  this.focus()

  // Close on escape key, trap focus
  document.addEventListener('keydown', this.boundKeyDown, true)

  // Optional 'onOpen' callback
  if (typeof this.options.onOpen === 'function') {
    this.options.onOpen.call(this)
  }
}

// Close modal
ModalDialogue.prototype.handleClose = function (event) {
  if (event) {
    event.preventDefault()
  }

  // Skip close if already closed
  if (!this.isOpen) {
    return
  }

  // Hide modal
  this.hasNativeDialog
    ? this.$dialogBox.close()
    : this.$dialogBox.removeAttribute('open')

  // Hide wrapper, enable scrolling
  this.$module.classList.remove('govuk-modal-dialogue--open')
  this.$container.classList.remove('govuk-!-scroll-disabled')

  // Mark as closed
  this.isOpen = false

  // Restore focus to last active element
  this.$lastActiveElement.focus()

  // Optional 'onClose' callback
  if (typeof this.options.onClose === 'function') {
    this.options.onClose.call(this)
  }

  // Remove escape key and trap focus listener
  document.removeEventListener('keydown', this.boundKeyDown, true)
}

// Lock scroll, focus modal
ModalDialogue.prototype.handleFocus = function () {
  this.$dialogBox.scrollIntoView()
  this.$focusElement.focus({ preventScroll: true })
}

// Listen for key presses
ModalDialogue.prototype.handleKeyDown = function (event) {
  var KEY_TAB = 9
  var KEY_ESCAPE = 27

  switch (event.keyCode) {
    case KEY_TAB:
      var $focusElement

      // Check for tabbing outside dialog
      var hasFocusEscaped = document.activeElement !== this.$dialogBox

      // Loop inner focussable elements
      if (hasFocusEscaped) {
        nodeListForEach(this.$focussable, function (element) {
          // Actually, focus is on an inner focussable element
          if (hasFocusEscaped && document.activeElement === element) {
            hasFocusEscaped = false
          }
        })

        // Wrap focus back to first element
        $focusElement = hasFocusEscaped
          ? this.$dialogBox
          : undefined
      }

      // Wrap focus back to first/last element
      if (!$focusElement) {
        if ((document.activeElement === this.$focusableLast && !event.shiftKey) || !this.$focussable.length) {
          $focusElement = this.$dialogBox
        } else if (document.activeElement === this.$dialogBox && event.shiftKey) {
          $focusElement = this.$focusableLast
        }
      }

      // Wrap focus
      if ($focusElement) {
        event.preventDefault()
        $focusElement.focus({ preventScroll: true })
      }

      break

    case KEY_ESCAPE:
      this.close()
      break
  }
}
