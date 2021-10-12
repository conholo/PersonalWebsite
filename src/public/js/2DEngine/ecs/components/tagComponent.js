

import {Component} from "./component.js"

export class TagComponent extends Component {

    constructor(properties) {
        super(properties);
    }

    drawComponent(parent) {

        const entityTag = document.createElement("div");
        entityTag.innerText = this.getTag();
        entityTag.style.textAlign = 'center';
        entityTag.style.backgroundColor = "grey"
        entityTag.style.border = "solid 2px white"
        entityTag.style.borderRadius = "10px";
        entityTag.style.color = "white"

        parent.appendChild(entityTag);
    }

    getTag() {
        return this.properties.tag;
    }

    setTag(name) {
        this.properties.tag = name;
    }
}