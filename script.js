/* global HTMLOListElement */
import {render, html} from './lit-extended.js'

class DraggableList extends HTMLOListElement {
  constructor () {
    super()
    this.elements = Array.from(this.children).map(li => ({
      text: li.innerText,
      classname: li.classList.value
    }))
    this.render()
  }

  noDragImage (event) {
    event.dataTransfer.setDragImage(new window.Image(0, 0), 0, 0)
  }

  dndEvent (eventname, element, event) {
    switch (eventname) {
      case 'start':
        this.dragged = element
        this.noDragImage(event)
        break
      case 'enter':
        if (this.dragged === element) {
          return false
        }
        const targetIndex = this.elements.indexOf(element)
        this.elements.splice(this.elements.indexOf(this.dragged), 1)
        this.elements = [].concat(
          this.elements.slice(0, targetIndex),
          [this.dragged],
          this.elements.slice(targetIndex)
        )
        this.render()
        break
      case 'drop':
        event.stopPropagation()
        break
      case 'end':
        this.dragged = undefined
        break
    }
  }

  render () {
    render(html`${this.elements.map(le => html`<li class$=${le.classname}
      on-dragstart=${ev => this.dndEvent('start', le, ev)}
      on-dragenter=${ev => this.dndEvent('enter', le, ev)}
      on-dragdrop=${ev => this.dndEvent('drop', le, ev)}
      on-dragend=${ev => this.dndEvent('end', le, ev)}
      draggable="true">
      ${le.text}
      </li>`)}`,
      this
    )
  }
}

window.customElements.define('draggable-ol', DraggableList, { extends: 'ol' })
