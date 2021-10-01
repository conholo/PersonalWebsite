import {Shader} from './rendering/shader.js';
import {BufferLayout, BufferElement, ShaderAttributeType} from './rendering/bufferlayout.js';
import {VertexBuffer, IndexBuffer} from "./rendering/buffer.js";
import {VertexArray} from "./rendering/vertexarray.js";
import {Vector3, Matrix4} from "./math/math.js";

class Application {

    constructor() {
        this._canvas = document.querySelector("#glCanvas");
        this._gl = this._canvas.getContext("webgl2");

        if(!this._gl) {
            alert("Problem initializing WebGL context.  Your browser may not support WebGL.")
            throw("Failure to initialize WebGL context.");
        }

        const triangleVertices = new Float32Array(
                [-0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
                  0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
                  0.0,  0.5, 0.0, 0.0, 0.0, 1.0]
        );

        const triangleIndices = new Uint32Array([0, 2, 1]);

        const layout =
            [
                new BufferElement("a_Position", ShaderAttributeType.Vector3),
                new BufferElement("a_Color", ShaderAttributeType.Vector3),
            ];
        this._bufferLayout = new BufferLayout(layout);

        this._vertexArray = new VertexArray(this._gl);

        this._vertexBuffer = new VertexBuffer(this._gl, triangleVertices.BYTES_PER_ELEMENT * triangleVertices.length, triangleVertices, this._gl.STATIC_DRAW);
        this._vertexBuffer.setBufferLayout(this._bufferLayout);

        this._indexBuffer = new IndexBuffer(this._gl, triangleIndices.BYTES_PER_ELEMENT * triangleIndices.length, 3, triangleIndices, this._gl.STATIC_DRAW);

        this._vertexArray.addVertexBuffer(this._vertexBuffer);
        this._vertexArray.setIndexBuffer(this._indexBuffer);
        this._shader = new Shader(this._gl, ["vertex-shader-2d", "fragment-shader-2d"]);
        this.drawScene();
    }

    drawScene() {
        this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);

       const orthoParameters = {left: -1.0, right:1.0, bottom:-1.0, top:1.0, near:.1, far:10.0}
       const orthographicMatrix = new Matrix4().ortho(orthoParameters);

       const modelEulerAngles = new Vector3(0, 0, 0);
       const modelTranslation =  new Vector3(0, 0, 0);
       const modelScale =  new Vector3(1, 1, 1);
       const modelMatrix = new Matrix4().translate(modelTranslation).rotateXYZ(modelEulerAngles).scale(modelScale);

       const viewOrigin = new Vector3(0, 0, 10);
       const viewLookAt = new Vector3(0, 0, 0);
       const viewUp = new Vector3(0, 1, 0);
       const viewMatrix = new Matrix4().lookAt(viewOrigin, viewLookAt, viewUp);

       const mvp = orthographicMatrix.multiplyRight(viewMatrix).multiplyRight(modelMatrix);

       this._shader.bind();
       this._shader.uploadMat4("u_MVP", mvp);

        this._gl.drawElements(this._gl.TRIANGLES, this._indexBuffer._count, this._gl.UNSIGNED_INT, null);
    }
}


window.onload = () => {
    const app = new Application();
}