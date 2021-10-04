
export class Shader {

    static GetGLTypeFromEngineType(gl, engineType) {
        switch(engineType) {
            case 'Int'      : return gl.INT;
            case 'Vector2':
            case 'Vector3':
            case 'Vector4':
            case 'Float'    : return gl.FLOAT;
            case 'Matrix3x3': return gl.FLOAT_MAT3;
            case 'Matrix4x4': return gl.FLOAT_MAT4;
            case 'Bool'     : return gl.BOOL;
            default :
                throw("No valid GL Type found from Engine Type: " + engineType);
        }
    }

    constructor(gl, shaderScriptIds) {
        this._gl = gl;

        this._vertexShader = this.createShaderFromScript(this._gl, shaderScriptIds[0], gl.VERTEX_SHADER)
        this._fragmentShader = this.createShaderFromScript(this._gl, shaderScriptIds[1], gl.FRAGMENT_SHADER)
        this._rendererID = this.createProgram(this._gl, this._vertexShader, this._fragmentShader);
    }

    bind() {
        this._gl.useProgram(this._rendererID);
    }

    unbind() {
        this._gl.useProgram(null);
    }

    uploadInt(name, value) {
        const location = this._gl.getUniformLocation(this._rendererID, name);
        this._gl.uniform1i(location, value);
    }

    uploadFloat(name, value) {
        const location = this._gl.getUniformLocation(this._rendererID, name);
        this._gl.uniform1f(location, value);
    }

    uploadMat3(name, matrix) {
        const location = this._gl.getUniformLocation(this._rendererID, name);
        this._gl.uniformMatrix3fv(location, false, matrix);
    }

    uploadMat4(name, matrix) {
        const location = this._gl.getUniformLocation(this._rendererID, name);
        this._gl.uniformMatrix4fv(location, false, matrix);
    }

    compileShader(gl, shaderSource, shaderType) {
        const shader = this._gl.createShader(shaderType);

        this._gl.shaderSource(shader, shaderSource);
        this._gl.compileShader(shader);

        const success = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS);
        if (!success)
            throw "could not compile shader:" + this._gl.getShaderInfoLog(shader);

        return shader;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        const program = this._gl.createProgram();

        this._gl.attachShader(program, vertexShader);
        this._gl.attachShader(program, fragmentShader);
        this._gl.linkProgram(program);

        const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
        if (!success)
            throw ("program failed to link:" + this._gl.getProgramInfoLog (program));

        return program;
    }

    createShaderFromScript(gl, scriptId, opt_shaderType) {
        const shaderScript = document.getElementById(scriptId);
        if (!shaderScript)
            throw("*** Error: unknown script element" + scriptId);

        const shaderSource = shaderScript.text;
        return this.compileShader(this._gl, shaderSource, opt_shaderType);
    }

    createProgramFromScripts(gl, shaderScriptIds) {
        this._vertexShader = this.createShaderFromScript(this._gl, shaderScriptIds[0], this._gl.VERTEX_SHADER);
        this._fragmentShader = this.createShaderFromScript(this._gl, shaderScriptIds[1], this._gl.FRAGMENT_SHADER);
        return this.createProgram(this._gl, this._vertexShader, this._fragmentShader);
    }
}

