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

    this.handleDown = this.handleDown.bind(this)
    this.handleUp = this.handleUp.bind(this)
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

  handleUp(event) {
    const key = event.key
    if (!valid.includes(key)) return


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
    }

    el.setAttribute(this.focused, true)
    el.classList.add(this.className)
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