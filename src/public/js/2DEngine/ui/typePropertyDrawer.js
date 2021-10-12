
export class TypePropertyDrawer {

    static createFloatDrawer(label, value) {
        const parent = document.createElement('div');

        parent.style.display = 'flex';
        parent.style.flexDirection = 'row';

        const labelElement = document.createElement('div');
        labelElement.innerText = label;
        const valueElement = document.createElement('input');
        valueElement.setAttribute('type', 'number');

        parent.appendChild(labelElement);
        parent.appendChild(valueElement);

        return parent;
    }

    static createVector3Drawer(label, vector3) {

        const parent = document.createElement('div');
        parent.style.display = 'flex';
        parent.style.flexDirection = 'row';

        const labelElement = document.createElement('div');
        labelElement.innerText = label;
        labelElement.style.minWidth = "100px";

        const xElement = document.createElement('input');
        xElement.setAttribute('type', 'number');
        xElement.id = label + 'x';
        xElement.setAttribute('step', '0.1');
        xElement.value = vector3.x;
        xElement.oninput = (event) => vector3.x = Number(event.target.value);
        xElement.style.maxWidth = "50px";

        const yElement = document.createElement('input');
        yElement.setAttribute('type', 'number');
        yElement.id = label + 'y';
        yElement.setAttribute('step', '0.1');
        yElement.value = vector3.y;
        yElement.oninput = (event) => vector3.y = Number(event.target.value);
        yElement.style.maxWidth = "50px";

        const zElement = document.createElement('input');
        zElement.setAttribute('type', 'number');
        zElement.id = label + 'z';
        zElement.setAttribute('step', '0.1');
        zElement.value = vector3.z;
        zElement.oninput = (event) => vector3.z = Number(event.target.value);
        zElement.style.maxWidth = "50px";

        parent.appendChild(labelElement);
        parent.appendChild(xElement);
        parent.appendChild(yElement);
        parent.appendChild(zElement);

        return parent;
    }

}