

export class Material {

    constructor(shader, baseUniforms) {
        this.shader = shader;
        this.baseUniforms = baseUniforms;
    }

    getBaseUniforms() {
        return this.baseUniforms;
    }

    getShader() {
        return this.shader;
    }

    bind() {
        this.shader.bind();
    }

    unbind() {
        this.shader.unbind();
    }
}