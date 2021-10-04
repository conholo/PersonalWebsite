
import {Vector2, Vector3, Matrix3, Matrix4, Quaternion} from '../math/math.js'



export class Camera {

    constructor(cameraParameters) {
        this._projectionMatrix = new Matrix4();
        this._viewMatrix = new Matrix4();

        this._cameraParameters = cameraParameters;

        this._aspectRatio = cameraParameters.aspectRatio;
        this._fov = cameraParameters.fov;
        this._nearClip = cameraParameters.nearClip;
        this._farClip = cameraParameters.farClip;

        this._pitch = 0.0;
        this._yaw = 0.0;
        this._pitchDelta = 0.0;
        this._yawDelta = 0.0;

        this._position = new Vector3(0, 0, 2);
        this._positionDelta = new Vector3(0,0,0);
        this._focalPoint = new Vector3(0, 0, 0);

        this._aspectRatio = 1.0
        this._distanceFromFocalPoint = this._position.z;
        this._zoomLevel = 1.0;

        this._panSpeed = 1.0;
        this._rotationSpeed = 50.0;
        this._zoomSpeed = .15;
        this._lastMousePosition = new Vector2(0,0);

        this.setCameraType(cameraParameters.type);
    }

    setCameraType(type) {
        this._cameraParameters.type = type;

        if(type === "perspective") {
            this._distanceFromFocalPoint = 10;
            this._focalPoint = new Vector3(0, 0,0);
            this._position = new Vector3().subVectors(this._focalPoint, this.forward().multiplyScalar(this._distanceFromFocalPoint));
            this._positionDelta = new Vector3(0, 0, 0);
            this._yaw = 0.0;
            this._pitch = 0.0;
            this._pitchDelta = 0.0;
            this._yawDelta = 0.0;

            this.updatePerspectiveViewMatrix();
            this.updatePerspectiveProjection(this._fov, this._aspectRatio, this._nearClip, this._farClip);
        }
        else if (type === "orthographic") {
            this._position = new Vector3(0.0, 0.0, 0.5);
            this._positionDelta = new Vector3(0, 0, 0);
            this._yaw = 0.0;
            this._pitch = 0.0;
            this._pitchDelta = 0.0;
            this._yawDelta = 0.0;

            this.updateOrthographicViewMatrix();
            this.updateOrthographicProjection(-this._aspectRatio * this._zoomLevel, this._aspectRatio * this._zoomLevel, -this._zoomLevel, this._zoomLevel, -this._zoomLevel, this._zoomLevel);
        }
    }

    getViewProjectionMatrix() {

        return this.getProjectionMatrix().multiplyRight(this.getViewMatrix());
    }

    getViewMatrix() {
        return new Matrix4().copy(this._viewMatrix);
    }

    getProjectionMatrix() {
        return new Matrix4().copy(this._projectionMatrix);
    }

    onScroll(deltaX, deltaY) {

        if(this._cameraParameters.type === "orthographic") {
            this._zoomLevel += deltaY > 0 ? this._zoomSpeed : -this._zoomSpeed;

            if(this._zoomLevel < this._zoomSpeed)
                this._zoomLevel = this._zoomSpeed;

            this.updateOrthographicProjection(-this._aspectRatio * this._zoomLevel, this._aspectRatio * this._zoomLevel, -this._zoomLevel, this._zoomLevel, 0.1, 10.0);
        }
        else if(this._cameraParameters.type === "perspective") {

            const zoomAmount = deltaY > 0 ? -this._zoomSpeed : +this._zoomSpeed;
            this._distanceFromFocalPoint += zoomAmount;
            this._position = new Vector3().subVectors(this._focalPoint, this.forward().multiplyScalar(this._distanceFromFocalPoint));

            this._positionDelta = new Vector3().addVectors(this._positionDelta, this.forward().multiplyScalar(zoomAmount));

            this.updatePerspectiveViewMatrix();
        }
    }

    receiveInput(input, deltaTime) {
        if(this._cameraParameters.type === "perspective") {

            if(input.getActiveMouseButton() === 1) {
                const yawSign = this.up().y < 0 ? -1.0 : 1.0;

                const mouseDelta = new Vector2().subVectors(input.getMousePosition(), this._lastMousePosition);
                mouseDelta.multiplyScalar(0.0015);

                this._yawDelta += mouseDelta.x * this._rotationSpeed * deltaTime;
                this._pitchDelta += mouseDelta.y * yawSign * this._rotationSpeed * deltaTime;

                this._yaw += this._yawDelta;
                this._pitch += this._pitchDelta;

                if(input.getActiveKeyCode() === "KeyW") {
                    let delta = this.forward().multiplyScalar(this._panSpeed * deltaTime);
                    this._positionDelta = this._positionDelta.addVectors(this._positionDelta, delta);
                }
                if(input.getActiveKeyCode() === "KeyS") {
                    let delta = this.forward().multiplyScalar(this._panSpeed * deltaTime);
                    this._positionDelta = this._positionDelta.subVectors(this._positionDelta, delta);
                }
            }
            else {
                if(input.getActiveKeyCode() === "KeyW") {
                    let delta = this.up().multiplyScalar(this._panSpeed * deltaTime);
                    this._positionDelta = this._positionDelta.addVectors(this._positionDelta, delta);
                }
                if(input.getActiveKeyCode() === "KeyS") {
                    let delta = this.up().multiplyScalar(this._panSpeed * deltaTime);
                    this._positionDelta = this._positionDelta.subVectors(this._positionDelta, delta);
                }
            }

            if(input.getActiveKeyCode() === "KeyA") {
                let delta = this.right().multiplyScalar(this._panSpeed * deltaTime);
                this._positionDelta = this._positionDelta.subVectors(this._positionDelta, delta);
            }
            // d
            if(input.getActiveKeyCode() === "KeyD") {
                let delta = this.right().multiplyScalar(this._panSpeed * deltaTime);
                this._positionDelta = this._positionDelta.addVectors(this._positionDelta, delta);
            }
        }
        else {
            if(input.getActiveKeyCode() === "KeyA") {
                let delta = this.right().multiplyScalar(this._panSpeed * deltaTime);
                this._positionDelta = this._positionDelta.subVectors(this._positionDelta, delta);
            }
            // d
            if(input.getActiveKeyCode() === "KeyD") {
                let delta = this.right().multiplyScalar(this._panSpeed * deltaTime);
                this._positionDelta = this._positionDelta.addVectors(this._positionDelta, delta);
            }
            // w
            if(input.getActiveKeyCode() === "KeyW") {
                let delta = this.up().multiplyScalar(this._panSpeed * deltaTime);
                this._positionDelta = this._positionDelta.addVectors(this._positionDelta, delta);
            }
            //s
            if(input.getActiveKeyCode() === "KeyS") {
                let delta = this.up().multiplyScalar(this._panSpeed * deltaTime);
                this._positionDelta = this._positionDelta.subVectors(this._positionDelta, delta);
            }
        }

        this._lastMousePosition = input.getMousePosition();
        this._position = this._position.addVectors(this._position, this._positionDelta);
    }

    updateOrthographicViewMatrix() {
        let lookAt = new Vector3().addVectors(this.forward(), this._position);

        this._pitchDelta *= 0.8;
        this._yawDelta *= 0.8;
        this._positionDelta = this._positionDelta.multiplyScalar(0.9);

        this._viewMatrix = new Matrix4().lookAt(this._position, lookAt, new Vector3(0, 1, 0));
    }

    updateOrthographic(input, deltaTime) {

        this.receiveInput(input, deltaTime);
        this.updateOrthographicViewMatrix();
    }

    updatePerspectiveViewMatrix() {
        const lookAt = new Vector3().addVectors(this._position, this.forward());
        const focalDifference = new Vector3().subVectors(this._focalPoint, this._position);
        this._distanceFromFocalPoint = Math.sqrt((focalDifference.x * focalDifference.x + focalDifference.y * focalDifference.y + focalDifference.z * focalDifference.z));
        this._focalPoint = new Vector3().addVectors(this._position, this.forward().multiplyScalar(this._distanceFromFocalPoint));

        this._pitchDelta *= 0.8;
        this._yawDelta *= 0.8;
        this._positionDelta = this._positionDelta.multiplyScalar(0.9);

        const yawSign = this.up().y < 0 ? -1.0 : 1.0;

        this._viewMatrix = new Matrix4().lookAt(this._position, lookAt, new Vector3(0, yawSign, 0));
    }

    updateOrthographicProjection(left, right, bottom, top, near, far) {
        this.orthographicParameters = {
            left: left,
            right: right,
            bottom: bottom,
            top: top,
            near: near,
            far: far
        }

        this._projectionMatrix = new Matrix4().ortho(this.orthographicParameters);
    }

    updatePerspectiveProjection(fov, aspect, nearClip, farClip) {
        const fovRadians = fov * Math.PI / 180.0;
        this.perspectiveParameters = {
            fov: fovRadians,
            aspect : aspect,
            nearClip : nearClip,
            farClip : farClip
        }

        this._projectionMatrix = new Matrix4().perspective(this.perspectiveParameters);
    }

    updatePerspective(input, deltaTime) {

        this.receiveInput(input, deltaTime);
        this.updatePerspectiveViewMatrix();
    }

    updateCamera(input, deltaTime) {
        if(this._cameraParameters.type === "orthographic")
            this.updateOrthographic(input, deltaTime);
        else if (this._cameraParameters.type === "perspective")
            this.updatePerspective(input, deltaTime);
    }

    up() {

        let up = new Vector3(0, 1, 0);
        return up.transformByQuaternion(this.orientation());
    }

    right() {

        let right = new Vector3(1, 0, 0);
        right = right.transformByQuaternion(this.orientation());
        return right;
    }

    forward() {

        let forward = new Vector3(0, 0, -1);
        return forward.transformByQuaternion(this.orientation());
    }

    orientation() {

        const rotationX = new Matrix3
        (
            [
                1.0,  0.0, 0.0,
                0.0,  Math.cos(this._pitch), -Math.sin(this._pitch),
                0.0,  Math.sin(this._pitch),  Math.cos(this._pitch)
            ]
        );

        const rotationY = new Matrix3
        (
            [
                Math.cos(this._yaw),  0, Math.sin(this._yaw),
                0, 1, 0,
                -Math.sin(this._yaw), 0, Math.cos(this._yaw)
            ]
        );

        const rotationZ = new Matrix3
        (
            [
                Math.cos(0), -Math.sin(0), 0,
                Math.sin(0), Math.cos(0), 0,
                0, 0, 1
            ]
        );

        const rotationMatrix = rotationX.multiplyLeft(rotationY).multiplyLeft(rotationZ);

        let rotation = new Quaternion().fromMatrix3(rotationMatrix);
        rotation = rotation.normalize();

        return rotation;
    }
}
