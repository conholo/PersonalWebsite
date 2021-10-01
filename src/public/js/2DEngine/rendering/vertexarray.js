import {Shader} from './shader.js'

export class VertexArray {

    constructor(gl) {

        this._vertexBuffers = [];
        this._indexBuffer = null;

        this._gl = gl;
        this._rendererID = gl.createVertexArray();
        this.bind();
    }

    addVertexBuffer(vertexBuffer) {
        this.bind()
        vertexBuffer.bind();

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer._rendererID);

        let attributeIndex = 0;

        for(let i = 0; i < vertexBuffer._layout._elements.length; i++) {

            const element = vertexBuffer._layout._elements[i];
            this._gl.enableVertexAttribArray(i);
            this._gl.vertexAttribPointer(
                i,
                element.getComponentCount(),
                Shader.GetGLTypeFromEngineType(this._gl, element.getEngineType()),
                element.shouldNormalize(),
                vertexBuffer._layout._stride,
                element.getOffset());

        }

        this._vertexBuffers.push(vertexBuffer);
    }

    setIndexBuffer(indexBuffer) {
        this.bind();
        indexBuffer.bind();

        this._indexBuffer = indexBuffer;
    }

    bind() {
        this._gl.bindVertexArray(this._rendererID);
    }

    unbind() {
        this._gl.bindVertexArray(0);
    }
}