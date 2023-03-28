import { MyFocus } from "./src/utils";
import './style.css'

const focus = new MyFocus()

focus.bindEvent()

const app = document.querySelector('#app')

function initTest() {
  let content = ''
  for (let i = 0; i < 50; i++) {
    content += `<div
      class="item"
      ${focus.itemName}
    ></div>`
  }
  app.innerHTML = content
}

initTest()
