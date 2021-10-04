

import {Component} from "./component.js"

export class TagComponent extends Component {

    constructor(properties) {
        super(properties);
    }

    getTag() {
        return this.properties.tag;
    }

    setTag(name) {
        this.properties.tag = name;
    }
}