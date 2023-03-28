import { MyFocus } from "./src/utils";
import './style.css'

const focus = new MyFocus({
  keys: {
    left: [37, 65],
    right: [39, 68],
    up: [38, 87],
    down: [40, 83],
  }
})

focus.bindEvent()


function initTest() {
  let content = ''
  for (let j = 0; j < 2; j++) {
    content += `<div class="container clearfix">`
    for (let i = 0; i < 24; i++) {
      content += `<div
      class="item"
      ${focus.itemName}
      >${j}-${i}</div>`
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

const app = document.querySelector('#app')

app.addEventListener('onBlur', e => {
  // console.log('onBlur', e.detail.innerText);
})

app.addEventListener('onFocus', e => {
  // console.log('onFocus', e.detail.innerText);
})

const all = document.querySelectorAll('.item')

all[2].addEventListener('right', e => {
  // console.log(e);
  focus.requestFocus(all[10])
})


window.addEventListener('keyup', e => {
  console.log(e.key, e.keyCode);
})