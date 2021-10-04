import {Component} from "./component.js"
import {Vector3, Matrix4} from '../../math/math.js'


export class TransformComponent extends Component {

    constructor(properties) {
        super(properties);
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