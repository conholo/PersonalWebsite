
export class System {

    constructor(world, attributes) {

        this.world = world;

        this.priority = 0;

        if(attributes && attributes.priority)
            this.priority = attributes.priority;

        this.attributes = attributes;
        this.requiredComponents = attributes.requiredComponents;
        this.entities = {}
    }

    tryAddEntityToSystem(entity) {

        for(let i = 0; i < this.requiredComponents.length; i++) {
            if(!entity.hasComponent(this.requiredComponents[i]))
                return;
        }

        this.entities[entity.id] = entity;
    }

    getEntityFromSystem(entityID) {
        if(this.entities.hasOwnProperty(entityID))
            return this.entities.entityID;

        return null;
    }

    tryRemoveEntity(entityID) {
        if(this.entities.hasOwnProperty(entityID))
            delete this.entities.entityID;
    }
}

