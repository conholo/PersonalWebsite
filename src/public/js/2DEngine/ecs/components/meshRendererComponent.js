
import {TypePropertyDrawer} from "../../ui/typePropertyDrawer.js";
import {Component} from "./component.js"

export class MeshRendererComponent extends Component {

    constructor(properties) {
        super(properties);
    }

    drawComponent(parentElement) {

        const meshRendererParent = document.createElement("div");

        if(this.properties.hasOwnProperty("uniforms")) {

            for(const uniform in this.properties["uniforms"]) {

                if(!this.properties["uniforms"].hasOwnProperty(uniform)) continue;

                switch(uniform.getType()) {
                    case "Float": {
                        const floatDrawerParent = TypePropertyDrawer.createFloatDrawer(uniform.getName(), uniform.getValue());
                        meshRendererParent.appendChild(floatDrawerParent);
                        break;
                    }
                }
            }
        }

        parentElement.appendChild(meshRendererParent);
    }

    getMesh() {

        if(!this.properties.hasOwnProperty("mesh")) {
            console.log("Incomplete MeshRendererComponent!  Ensure that the Entity's Mesh has been properly initialized.")
            return null;
        }

        return this.properties.mesh;
    }

    getMaterial() {
        if(!this.properties.hasOwnProperty("material")) {
            console.log("Incomplete MeshRendererComponent!  Ensure that the Entity's Material has been properly initialized.")
            return null;
        }

        return this.properties.material;
    }

    bind() {
        this.properties.mesh.bind();
        this.properties.material.bind();
    }

    unbind() {
        this.properties.mesh.unbind();
        this.properties.material.unbind();
    }
}