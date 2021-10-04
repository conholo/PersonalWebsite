export class VertexBuffer {

    constructor(gl, size, vertices, usage) {
        this.gl = gl;
        this.size = size;
        this.vertices = vertices;
        this.layout = null;

        this.rendererID = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, vertices, usage);
    }

    getLayout() {
        return this.layout;
    }

    setBufferLayout(layout) {
        this.layout = layout;
    }

    bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.rendererID);
    }

    unbind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
}

export class IndexBuffer {

    constructor(gl, size, count, indices, usage) {

        this.gl = gl;
        this.size = size;
        this.count = count;
        this.indicies = indices;

        this.rendererID = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, usage);
    }

    getCount() {
        return this.count;
    }

    bind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.rendererID);
    }

    unbind() {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}