import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const vertexShader = `
   
    varying vec3 v_HitPosition;
    varying vec3 v_ViewPosition;
    varying vec3 v_RayOrigin;

    void main()
    {
        v_ViewPosition = (modelViewMatrix * vec4(position, 1)).xyz;
        v_HitPosition = position;
        v_RayOrigin = (inverse(modelMatrix) * vec4(cameraPosition, 1)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `

    varying vec3 v_HitPosition;
    varying vec3 v_ViewPosition;
    varying vec3 v_RayOrigin;

    uniform vec3 u_LightPosition;
    uniform vec3 u_SpherePosition;
    
    const int Steps = 30;
    const float MaxDistance = 100.0;
    const float MinDistance = 0.001;
    

    float SphereSDF(vec3 rayPosition, vec3 spherePosition, float radius)
    {
        return length(spherePosition - rayPosition) - radius;
    }

    float Blend(float d1, float d2, float a)
    {
        return a * d1 + (1.0 - a) * d2;
    }
    
    float SDFSmoothUnion(float a, float b, float k)
    {
        float res = exp(-k*a) + exp(-k*b);
        return -log(max(0.0001,res)) / k;
    }

    float GetDistance(vec3 position)
    {
        float center = SphereSDF(position, vec3(0.0), 0.5);
        float right = SphereSDF(position, vec3(u_SpherePosition.x, 0.0, 0.0), .2);
        float left = SphereSDF(position, vec3(-u_SpherePosition.x, 0.0, 0.0), .2);
        float top = SphereSDF(position, vec3(0.0, u_SpherePosition.y, 0.0), .2);
        float bottom = SphereSDF(position, vec3(0.0, -u_SpherePosition.y, 0.0), .2);
        
        float centerRight = Blend(center, right, .9);
        float centerLeft = SDFSmoothUnion(centerRight, left, 5.0);
        float centerTop = Blend(centerLeft, top, .9);
        float centerBottom = SDFSmoothUnion(centerTop, bottom, 5.0);
        
        return centerBottom;
    }
    
    float RayMarch(vec3 rayOrigin, vec3 rayDirection)
    {
        float distanceFromOrigin = 0.0;
        
        for(int i = 0; i < Steps; i++)
        {
            vec3 rayPosition = rayOrigin + rayDirection * distanceFromOrigin;
        
            float distanceFromScene = GetDistance(rayPosition);
            
            distanceFromOrigin += distanceFromScene;
            
            if(distanceFromScene < MinDistance || distanceFromOrigin > MaxDistance)
                break;
        }

        return distanceFromOrigin;
    }
    
    vec3 Normal(vec3 point)
    {
        float epsilon = 0.0001;
        vec3 normal = GetDistance(point) - vec3(
                GetDistance(point - vec3(epsilon, 0.0, 0.0)),
                GetDistance(point - vec3(0.0, epsilon, 0.0)),
                GetDistance(point - vec3(0.0, 0.0, epsilon))
            );
        return normalize(normal);
    }

    void main()
    {
        vec3 color = vec3(0.0, 0.0, 0.0);
        vec3 rayOrigin = v_RayOrigin;
        vec3 rayDirection = normalize(v_HitPosition - rayOrigin);
        
        float distance = RayMarch(rayOrigin, rayDirection);
        
        if(distance < MaxDistance)
        {   
            vec3 rayPosition = rayOrigin + rayDirection * distance;
            vec3 normal = Normal(rayPosition);
            vec3 lightDirection = normalize(u_LightPosition - v_ViewPosition); 
            float lambertian = max(dot(normal, lightDirection), 0.0);
            
            color = vec3(lambertian);
        }
    
        gl_FragColor = vec4(color, 1.0);
    }
`;

class DemoScene {

    constructor(container) {
        this.width = container.clientWidth;
        this.height = container.clientHeight;


        this.aspect = this.width / this.height;
        this.fov = 60;
        this.nearClip = 1.0;
        this.farClip = 1000.0;

        this.boxPosition = new THREE.Vector3(0, 0, 0);
        this.boxScale = new THREE.Vector3(5, 5, 5);
        this.boxMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});

        this.spherePosition = new THREE.Vector3(0.0, 0, 0);

        this.clock = new THREE.Clock();
        this.elapsed = 0.0;

        this.initialize(container);
    }

    initialize(container){
        this.renderer = new THREE.WebGLRenderer( { antialias: true} );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.nearClip, this.farClip);
        this.camera.position.set(0.0, 0.0, -5);

        this.scene = new THREE.Scene();

        this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.light.position.set(0, 100, -50);
        this.light.target.position.set(0, 0, 0);
        this.light.castShadow = true;
        this.scene.add(this.light);


        const viewSpaceLightPosition = this.light.position.applyMatrix4(this.camera.matrixWorldInverse);

        this.rayMarch = new THREE.ShaderMaterial(
            {
                uniforms: {
                    u_LightPosition : {
                        type: "v3",
                        value: viewSpaceLightPosition
                    },
                    u_SpherePosition: {
                        type: "v3",
                        value: this.spherePosition
                    }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            }
        );

        this.box = this.createBox(this.boxPosition, this.boxScale, this.rayMarch);
        this.scene.add(this.box);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.animate();
    }

    createBox(position, scale, material) {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(scale.x, scale.y, scale.z),
            material
        );

        box.position.set(position.x, position.y, position.z);
        box.castShadow = true;
        box.receiveShadow = true;
        return box;
    }

    animate() {
        requestAnimationFrame(() => {
            this.renderer.render(this.scene, this.camera);

            let delta = this.clock.getDelta();
            this.elapsed += delta;

            this.spherePosition.x = Math.sin(this.elapsed);
            this.spherePosition.y = Math.sin(this.elapsed);
            this.spherePosition.z = Math.sin(this.elapsed);
            this.rayMarch.uniforms.u_SpherePosition.value = this.spherePosition;

            this.animate();
        });
    }
}


function playVisualization() {

    const container = document.getElementById('home-demo-container');
    const demo = new DemoScene(container);
}



window.addEventListener('load', () => playVisualization());