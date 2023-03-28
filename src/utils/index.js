const valid = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight'
]

class MyFocus {
  constructor(option = {}) {
    this.delta = option.delta ?? 50
    this.className = option.className ?? 'tv-focus'
    this.itemName = option.itemName ?? 'focusable'
    this.focused = option.focused ?? 'focused'
    this.focusdisable = option.focusdisable ?? 'focusdisable'

    this.handleDown = this.handleDown.bind(this)
    this.handleUp = this.handleUp.bind(this)
  }

  /**
   * 
   * @param {HTMLElement} el 
   */
  setLimitingElement(el) {
    if (el === null) {
      const all = document.querySelectorAll(`[${this.focusdisable}]`)
      for (const el of all) {
        this._setElementFocusStatus(el, true)
      }
    } else {
      // 所有都disable
      const all = document.querySelectorAll(`[${this.itemName}]`)
      for (const el of all) {
        this._setElementFocusStatus(el, false)
      }

      // 找到限定范围内disable的，变成can focus
      const canFocus = el.querySelectorAll(`[${this.focusdisable}]`)
      for (const el of canFocus) {
       this._setElementFocusStatus(el, true) 
      }
    }
  }

  bindEvent() {
    window.addEventListener('keyup', this.handleUp)
    window.addEventListener('keydown', this.handleDown)
  }

  unBindEvet() {
    window.removeEventListener('keyup', this.handleUp)
    window.removeEventListener('keydown', this.handleDown)
  }

  handleDown(event) {
    const key = event.key
    if (!valid.includes(key)) return
  }

  /**
   * 
   * @param {KeyboardEvent} event 
   * @returns 
   */
  handleUp(event) {
    const key = event.key
    if (!valid.includes(key)) return

    event.preventDefault()

    const focusEl = this._getFocus()

    // 两种情况
    // 1. 当前没有焦点
    // 默认都是左上角
    const eles = this._getCanFocusElementPosition()
    if (!focusEl) {

      // 找到最左边的
      const next = findFirst(eles, (a, b) => {
        return a.position.left - b.position.left
      })

      this._setFocus(next.el)
    } else {
      // 2. 当前有焦点

      // 分发事件
      const event = key.replace('Arrow', '').toLowerCase()
      this._skipEvent = false
      focusEl.dispatchEvent(new CustomEvent(event, {
        bubbles: true,
      }))

      // 方向移动时，已经自定义聚焦元素了
      if (this._skipEvent) return

      const {
        position
      } = this._computeElementPosition(focusEl)

      const {
        centerX,
        centerY,
        top,
        left,
        bottom,
        right
      } = position

      // 过滤出合适的元素
      const validEles = eles.filter(({ position }) => {
        let t = 0
        let f = false

        // 垂直或水平距离不能太远
        if (key === 'ArrowUp' || key === 'ArrowDown') {
          t = Math.abs(centerX - position.centerX)
        } else {
          t = Math.abs(centerY - position.centerY)
        }

        // 过滤出有效方向的
        // 例如向上，自然只需要位置在他上方的
        if (key === 'ArrowUp') {
          f = position.bottom < top
        } else if (key === 'ArrowDown') {
          f = position.bottom > bottom
        } else if (key === 'ArrowLeft') {
          f = position.left < left
        } else {
          f = position.right > right
        }

        return t <= this.delta && f
      })

      if (validEles.length === 0) return

      const next = findFirst(validEles, (a, b) => {
        // 向上
        a = a.position
        b = b.position
        if (key === 'ArrowUp') {
          return b.bottom - a.bottom
        } else if (key === 'ArrowDown') {
          return a.top - b.top
        } else if (key === 'ArrowLeft') {
          return b.right - a.right
        } else {
          return a.left - b.left
        }
      })

      this._setFocus(next.el)
    }
  }

  /**
   * 
   * @param {HTMLElement} el 
   * @returns 
   */
  requestFocus(el) {
    if (!el) return
    if (el.getAttribute(this.focusdisable)) return

    this._setFocus(el)
    this._skipEvent = true
  }

  _getCanFocusElementPosition() {
    const eles = document.querySelectorAll(`[${this.itemName}]`)
    return [...eles].map(el => this._computeElementPosition(el))
  }

  /**
   * 
   * @param {HTMLElement} el 
   */
  _computeElementPosition(el) {
    const rect = el.getBoundingClientRect()
    return {
      el,
      position: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      }
    }
  }

  /**
   * 
   * @returns {HTMLElement | null}
   */
  _getFocus() {
    return document.querySelector(`[${this.focused}]`)
  }

  /**
   * 
   * @param {HTMLElement} el 
   */
  _setFocus(el) {
    const origin = this._getFocus()
    if (origin) {
      origin.removeAttribute(this.focused)
      origin.classList.remove(this.className)
      origin.dispatchEvent(new CustomEvent('onBlur', {
        bubbles: true,
        detail: origin
      }))
    }

    el.setAttribute(this.focused, true)
    el.classList.add(this.className)
    el.dispatchEvent(new CustomEvent('onFocus', {
      bubbles: true,
      detail: el
    }))
  }

  /**
   * 
   * @param {HTMLElement} el 
   */
  _setElementFocusStatus(el, status) {
    if (status) {
      el.removeAttribute(this.focusdisable)
      el.setAttribute(this.itemName, true)
    } else {
      el.removeAttribute(this.itemName)
      el.removeAttribute(this.focused)
      el.classList.remove(this.className)
      el.setAttribute(this.focusdisable, true)
    }
  }
}

/**
 * @template T
 * 
 * @param {T[]} arr 
 * @param {(a: T, b: T) => number} compare 
 * @returns 
 */
function findFirst(arr, compare) {
  let item = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (compare(item, arr[i]) > 0) {
      item = arr[i]
    }
  }
  return item
}

export {
  MyFocus
}