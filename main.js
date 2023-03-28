import { MyFocus } from "./src/utils";
import './style.css'

const focus = new MyFocus()

focus.bindEvent()


function initTest() {
  let content = ''
  for (let i = 0; i < 2; i++) {
    content += `<div class="container clearfix">`
    for (let i = 0; i < 24; i++) {
      content += `<div
      class="item"
      ${focus.itemName}
      ></div>`
    }
    content += `</div>`
  }
  document.querySelector('.wrapper').innerHTML = content
}

window.setLimitingEl = function(index) {
  const all = document.querySelectorAll('.container')
  focus.setLimitingElement(all[index])
}

window.resetLimiting = function() {
  focus.setLimitingElement(null)
}

initTest()
