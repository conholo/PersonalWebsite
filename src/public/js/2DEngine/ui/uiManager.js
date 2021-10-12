

export class UIManager {

    constructor(application) {
        this.application = application;

        this.mainViewportContainer = document.getElementById("main-editor-container");
        this.sceneHierarchyPanel = document.getElementById("scene-hierarchy");
        this.sceneHierarchyEntityList = document.getElementById("scene-hierarchy-entities");

        this.mainViewportContainer.onmousedown = this.onMouseDown.bind(this);
        this.sceneHierarchyContextPopup = document.getElementById("scene-hierarchy-context-popup");

        this.inspectorPanelComponentParent = document.getElementById('properties-inspector-components');

        const sceneHierarchyDropDownOptions = {
            "Create Entity": () => this.application.world.createEntity()
        };

        for(let optionDisplayName in sceneHierarchyDropDownOptions) {

            const option = document.createElement("div");
            option.classList.add('dropdown-item', 'noselect');
            option.innerText = optionDisplayName;
            this.sceneHierarchyContextPopup.appendChild(option);
            option.onclick = sceneHierarchyDropDownOptions[optionDisplayName].bind(this);
        }

        this.sceneHierarchyPanel.onmouseleave = (event) => {this.sceneHierarchyPopupActive.active = false;}
        this.sceneHierarchyPanel.onmouseenter = (event) => {this.mouseOverSceneHierarchy = true};
        this.sceneHierarchyPanel.onmouseleave = (event) => {this.mouseOverSceneHierarchy = false;};
        this.sceneHierarchyContextPopup.onmouseleave = () => this.sceneHierarchyContextPopup.style.display = "none";
        document.body.oncontextmenu = () => this.mouseOverSceneHierarchy;
    }

    onEntityCreated(entity) {

        if(this.activeEntityListItem) {
            this.activeEntityListItem.classList.remove('list-group-item-light');
            this.activeEntityListItem.classList.add('list-group-item-dark');
        }

        const entityListItem = document.createElement("div");
        entityListItem.classList.add('list-group-item', 'list-group-item-light', 'list-group-item-action');
        entityListItem.innerText = entity.getComponent("Tag").getTag();
        entityListItem.id = entity.id;
        entityListItem.onclick = () => this.selectEntity(entityListItem);
        this.activeEntityListItem = entityListItem;
        this.sceneHierarchyEntityList.appendChild(entityListItem);
    }

    selectEntity(listItem) {
        if(this.activeEntityListItem) {
            this.activeEntityListItem.classList.remove('list-group-item-light');
            this.activeEntityListItem.classList.add('list-group-item-dark');
        }

        this.activeEntityListItem = listItem
        listItem.classList.add('list-group-item-light');
        listItem.classList.remove('list-group-item-dark');
        this.drawEntityInspector(parseInt(this.activeEntityListItem.id));
    }

    drawEntityInspector(entityID) {

        if(this.activeEntityListItem) {
            while(this.inspectorPanelComponentParent.firstChild)
                this.inspectorPanelComponentParent.removeChild(this.inspectorPanelComponentParent.firstChild);
        }

        const entity = this.application.world.getEntity(entityID);

        const components = entity.getComponents();

        if(components.length <= 0) return;

        for(const componentName in components) {

            if(!components.hasOwnProperty(componentName)) continue;

            components[componentName].drawComponent(this.inspectorPanelComponentParent);
        }
    }

    onCreateEntitySelected(event) {
        this.application.world.create();
    }

    onMouseDown(event) {

        if(event.button === 2) {
            if(this.mouseOverSceneHierarchy) {
                this.sceneHierarchyContextPopup.style.left = `${event.pageX - 10}px`;
                this.sceneHierarchyContextPopup.style.top = `${event.pageY - 10}px`
            }

            this.sceneHierarchyPopupActive = this.mouseOverSceneHierarchy;
            this.sceneHierarchyContextPopup.style.display = this.mouseOverSceneHierarchy ? "block" : "none";
        }
    }
}