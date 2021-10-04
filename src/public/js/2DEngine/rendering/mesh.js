
import {VertexBuffer, IndexBuffer} from "./buffer.js";
import {BufferElement, BufferLayout, ShaderAttributeType} from "./bufferlayout.js";


export class Mesh{

    constructor(gl, vertices, indices) {
        this.vertices = vertices;
        this.indices = indices;

        const layout =
        [
            new BufferElement("a_Position", ShaderAttributeType.Vector3),
            new BufferElement("a_Color", ShaderAttributeType.Vector3),
        ];

        this.bufferLayout = new BufferLayout(layout);

        this.vertexBuffer = new VertexBuffer(gl, vertices.BYTES_PER_ELEMENT * vertices.length, vertices, gl.STATIC_DRAW);
        this.vertexBuffer.setBufferLayout(this.bufferLayout);

        this.indexBuffer = new IndexBuffer(gl, indices.BYTES_PER_ELEMENT * indices.length, indices.length, indices, gl.STATIC_DRAW);
    }

    getVertices() {
        return this.vertices;
    }

    getIndices() {
        return this.indices;
    }

    getIndexBuffer() {
        return this.indexBuffer;
    }

    getVertexBuffer() {
        return this.vertexBuffer;
    }

    bind() {
        this.vertexBuffer.bind();
        this.indexBuffer.bind();
    }

    unbind() {
        this.vertexBuffer.unbind();
        this.indexBuffer.unbind();
    }
}