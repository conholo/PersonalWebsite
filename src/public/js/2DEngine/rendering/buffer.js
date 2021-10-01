export class VertexBuffer {

    constructor(gl, size, vertices, usage) {
        this._gl = gl;
        this._size = size;
        this._vertices = vertices;
        this._layout = null;

        this._rendererID = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, vertices, usage);
    }

    setBufferLayout(layout) {
        this._layout = layout;
    }

    bind() {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._rendererID);
    }

    unbind() {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, 0);
    }
}

export class IndexBuffer {

    constructor(gl, size, count, indices, usage) {

        this._gl = gl;
        this._size = size;
        this._count = count;
        this._indices = indices;

        this._rendererID = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, usage);
    }

    bind() {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._rendererID);
    }

    unbind() {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, 0);
    }
}