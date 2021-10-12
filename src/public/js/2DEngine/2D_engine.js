import {Shader} from './rendering/shader.js';
import {Camera} from "./rendering/camera.js"
import {Input} from "./core/input.js"
import {Mesh} from "./rendering/mesh.js"
import {Material} from "./rendering/material.js"
import {UIManager} from "./ui/uiManager.js"

import {World} from "./ecs/entity.js"
import {RenderSystem} from "./ecs/systems/meshRendererSystem.js"
import {MeshRendererComponent} from "./ecs/components/meshRendererComponent.js";


class Application {

    constructor() {
        this.canvas = document.querySelector("#glCanvas");
        this.gl = this.canvas.getContext("webgl2");

        if(!this.gl) {
            alert("Problem initializing WebGL context.  Your browser may not support WebGL.")
            throw("Failure to initialize WebGL context.");
        }

        this.lastFrameTime = 0.0;

        const cameraProperties = {
            type: "perspective",
            aspectRatio: this.gl.canvas.width / this.gl.canvas.height,
            fov: 45.0,
            nearClip: 0.1,
            farClip: 1000.0
        }

        this.camera = new Camera(cameraProperties);
        this.input = new Input([this.camera.onScroll.bind(this.camera)]);
        document.onmousemove = this.input.onMouseMove.bind(this.input);
        document.onmousedown = this.input.onMouseDown.bind(this.input);
        document.onmouseup = this.input.onMouseUp.bind(this.input);
        document.onkeydown = (event) => {
            this.input.onKeyDown(event);

            if(event.code === "KeyP")
                this.camera.setCameraType("perspective");
            else if(event.code === "KeyO")
                this.camera.setCameraType("orthographic");
        }
        document.onkeyup = this.input.onKeyUp.bind(this.input);
        document.onwheel = this.input.onScroll.bind(this.input);

        const triangleVertices = new Float32Array(
                [-0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
                  0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
                  0.0,  0.5, 0.0, 0.0, 0.0, 1.0]
        );
        const triangleIndices = new Uint32Array([0, 2, 1]);

        this.uiManager = new UIManager(this);


        this.world = new World();
        this.world.onCreateEntityCallSubscribers.push(this.uiManager.onEntityCreated.bind(this.uiManager));

        this.world.registerSystem("MeshRenderer",
            new RenderSystem(
                this.world,
                {
                    requiredComponents: ["MeshRenderer", 'Transform'],
                    camera: this.camera
                },
                this.gl), 0
        );

        const triangleEntity = this.world.createEntity("Triangle");
        triangleEntity.addComponent("MeshRenderer",
            new MeshRendererComponent(
            {
                mesh: new Mesh(this.gl, triangleVertices, triangleIndices),
                material: new Material(new Shader(this.gl, ["vertex-shader-2d", "fragment-shader-2d"]))
            })
        );

        this.run();
    }

    run() {
        requestAnimationFrame(() => {

            const time = new Date().getTime();
            const deltaTime = (time - this.lastFrameTime) / 1000.0;
            this.lastFrameTime = time;

            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            this.camera.updateCamera(this.input, deltaTime);
            this.world.execute();

            this.run();
        })
    }
}


window.onload = () => {
    const app = new Application();
}