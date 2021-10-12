import {VertexArray} from "../../rendering/vertexarray.js"
import {System} from "./system.js";
import {Component} from "../components/component.js";

export class RenderSystem extends System {

    constructor(world, attributes, gl) {
        super(world, attributes);

        this.gl = gl;
        this.vertexArray = new VertexArray(gl);
    }

    execute(dt) {

        if(this.entities.size <= 0) return;

        for(let entityID in this.entities) {

            if(!this.entities.hasOwnProperty(entityID)) continue;

            const entity = this.entities[entityID];

            const meshRendererComponent = entity.getComponent(Component.MeshRenderer);
            const transformComponent = entity.getComponent(Component.Transform);

            this.vertexArray.bind();
            this.vertexArray.setIndexBuffer(meshRendererComponent.getMesh().getIndexBuffer());
            this.vertexArray.setVertexBuffer(meshRendererComponent.getMesh().getVertexBuffer());

            meshRendererComponent.getMaterial().getShader().bind();

            const mvp = this.attributes.camera.getViewProjectionMatrix().multiplyRight(transformComponent.getTransform());

            meshRendererComponent.getMaterial().getShader().uploadMat4("u_MVP", mvp);

            this.gl.drawElements(this.gl.TRIANGLES, this.vertexArray.getIndexBuffer().getCount(), this.gl.UNSIGNED_INT, null);

            meshRendererComponent.unbind();
            this.vertexArray.unbind();
        }
    }
}
