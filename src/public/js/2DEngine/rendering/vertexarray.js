import {Shader} from './shader.js'

export class VertexArray {

    constructor(gl) {
        this.vertexBuffer = null;
        this.indexBuffer = null;

        this.gl = gl;
        this.rendererID = gl.createVertexArray();
        this.bind();
    }

    setVertexBuffer(vertexBuffer) {
        this.bind()
        vertexBuffer.bind();

        const layout = vertexBuffer.getLayout();
        for(let i = 0; i < layout.getElements().length; i++) {

            const element = layout.getElements()[i];
            this.gl.enableVertexAttribArray(i);
            this.gl.vertexAttribPointer(
                i,
                element.getComponentCount(),
                Shader.GetGLTypeFromEngineType(this.gl, element.getEngineType()),
                element.shouldNormalize(),
                layout.getStride(),
                element.getOffset());

        }

        this.vertexBuffer = vertexBuffer;
    }

    getIndexBuffer() {
        return this.indexBuffer;
    }

    getVertexBuffer() {
        return this.vertexBuffer;
    }

    setIndexBuffer(indexBuffer) {
        this.bind();
        indexBuffer.bind();

        this.indexBuffer = indexBuffer;
    }

    bind() {
        this.gl.bindVertexArray(this.rendererID);
    }

    unbind() {
        this.gl.bindVertexArray(null);
    }
}