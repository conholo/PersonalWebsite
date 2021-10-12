
import {TransformComponent} from "./components/transformComponent.js"
import {TagComponent} from "./components/tagComponent.js"
import {Vector3} from "../math/math.js";
import {Component} from "./components/component.js";


export class SystemManager {

    constructor(world) {
        this.world = world;
        this.systems = {};
        this.prioritySorted = [];
    }

    execute(dt){
        for(const systemName in this.systems) {
            if(!this.systems.hasOwnProperty(systemName)) continue;
            this.systems[systemName].instance.execute(dt);
        }
    }

    registerSystem(systemName, instance, priority = 0) {
        this.systems[systemName] = {instance: instance, priority: priority};

        this.systems = Object.fromEntries(
            Object.entries(this.systems).sort(([,a], [,b]) => a.priority < b.priority ? -1 : 1)
        );
    }

    removeSystem(systemName) {
        if(!this.systems.hasOwnProperty(systemName)) return;

        delete this.systems[systemName];
    }

    onComponentAdded(entity) {
        for(const systemName in this.systems) {
            if(!this.systems.hasOwnProperty(systemName)) continue;
            this.systems[systemName].instance.tryAddEntityToSystem(entity);
        }
    }

    onRemoveEntity(entityID) {

        for(const systemName in this.systems) {
            if(!this.systems.hasOwnProperty(systemName)) continue;
            this.systems[systemName].instance.tryRemoveEntity(entityID);
        }
    }
}


export class EntityManager {

    constructor(world) {

        this.world = world;
        this.entityID = 0;
        this.entities = {};
    }

    createEntity(name) {
        const entity = new Entity(this, this.entityID);

        const defaultTransformProperties = {
            translation: new Vector3(0,0,0),
            rotation: new Vector3(0,0,0),
            scale: new Vector3(1,1,1)
        };

        this.entities[this.entityID++] = entity;

        const tagComponent = new TagComponent({tag: name || "Entity"});
        entity.addComponent(Component.Tag, tagComponent);
        const transformComponent = new TransformComponent(defaultTransformProperties);
        entity.addComponent(Component.Transform, transformComponent)

        return entity;
    }

    getEntity(id) {
        return this.entities[id];
    }

    removeEntity(id) {
        if(this.entities.hasOwnProperty(id)) {
            delete this.entities.id;
        }
    }

    onAddComponent(entity) {
        this.world.onComponentAdded(entity);
    }

    onRemoveComponent(entity) {
        this.world.onComponentRemoved(entity);
    }
}


export class Entity {

    constructor(entityManager, id) {

        this.entityManager = entityManager;
        this.id = id;
        this.components = {};
    }

    addComponent(componentName, component) {
        if(this.components[componentName]) {
            console.log(`Entity: ${this.id} already has a component of type: ${componentName}.`)
            return;
        }

        this.components[componentName] = component;

        this.entityManager.onAddComponent(this);
    }

    removeComponent(componentName) {
        if(this.components.hasOwnProperty(componentName)) {
            delete this.components[componentName];
            this.entityManager.onRemoveComponent(this, componentName);
        }
    }

    getComponents() {
        return this.components;
    }

    getComponent(componentName) {
        return this.hasComponent(componentName) ? this.components[componentName] : null;
    }

    hasComponent(componentName) {
        return this.components.hasOwnProperty(componentName)
    }
}

export class World {

    constructor() {
        this.entityManager = new EntityManager(this);
        this.systemManager = new SystemManager(this);

        this.onCreateEntityCallSubscribers = [];
    }

    getEntity(entityID) {
        return this.entityManager.getEntity(entityID);
    }

    createEntity(name) {

        const entity = this.entityManager.createEntity(name);

        this.onCreateEntityCallSubscribers.forEach(t => t(entity));
        return entity;
    }

    removeEntity(id) {
        this.systemManager.onRemoveEntity(id);
        this.entityManager.removeEntity(id);
    }

    onComponentAdded(entity) {
        this.systemManager.onComponentAdded(entity);
    }

    onComponentRemoved(entity) {
        this.systemManager.onComponentRemoved(entity);
    }

    registerSystem(systemName, instance, priority = 0) {
        this.systemManager.registerSystem(systemName, instance, priority);
    }

    removeSystem(systemName) {
        this.systemManager.removeSystem(systemName);
    }

    execute(dt) {
        this.systemManager.execute(dt);
    }
}
