import {Component} from "./component.js"
import {Vector3, Matrix4} from '../../math/math.js'
import {TypePropertyDrawer} from "../../ui/typePropertyDrawer.js";

export class TransformComponent extends Component {

    constructor(properties) {
        super(properties);
    }

    drawComponent(parent) {

        const translationElement = TypePropertyDrawer.createVector3Drawer("Translation", this.properties.translation);
        translationElement.style.marginTop = "10px";
        translationElement.style.marginBottom = "10px";
        const rotationElement = TypePropertyDrawer.createVector3Drawer("Rotation", this.properties.rotation);
        rotationElement.style.marginBottom = "10px";
        const scaleElement = TypePropertyDrawer.createVector3Drawer("Scale", this.properties.scale);
        scaleElement.style.marginBottom = "10px";

        parent.appendChild(translationElement);
        parent.appendChild(rotationElement);
        parent.appendChild(scaleElement);
    }

    getTransform() {
        const translation = this.properties.translation;
        const rotation = this.properties.rotation;
        const scale = this.properties.scale;

        return new Matrix4().translate(translation).rotateXYZ(rotation).scale(scale);
    }

    setTranslation(translation) {
        this.properties.translation = translation;
    }

    setRotation(rotation) {
        this.properties.rotation = rotation;
    }

    setScale(scale) {
        this.properties.scale = scale;
    }
}