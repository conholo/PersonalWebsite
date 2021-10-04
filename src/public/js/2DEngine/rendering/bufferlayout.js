export class ShaderAttributeType {

    static Float = new ShaderAttributeType('Float');
    static Vector2 = new ShaderAttributeType('Vector2');
    static Vector3 = new ShaderAttributeType('Vector3');
    static Vector4 = new ShaderAttributeType('Vector4');
    static Matrix3x3 = new ShaderAttributeType('Matrix3x3');
    static Matrix4x4 = new ShaderAttributeType('Matrix4x4');
    static Int = new ShaderAttributeType('Int');
    static Vector2Int = new ShaderAttributeType('Vector2Int');
    static Vector3Int = new ShaderAttributeType('Vector3Int');
    static Vector4Int = new ShaderAttributeType('Vector4Int');
    static Bool = new ShaderAttributeType('Bool');

    constructor(name) {
        this.name = name;
        this.size = this.sizeInBytes();
        this.componentCount = this.componentCount();
    }

    getShaderAttributeName() {
        return this.name;
    }

    getSize() {
        return this.size;
    }

    getComponentCount() {
        return this.componentCount;
    }

    sizeInBytes() {
        switch(this.name) {
            case 'Float'       : return 1 * 4;
            case 'Vector2'      : return 2 * 4;
            case 'Vector3'      : return 3 * 4;
            case 'Vector4'      : return 4 * 4;
            case 'Matrix3x3'    : return 4 * 3 * 3;
            case 'Matrix4x4'    : return 4 * 4 * 4;
            case 'Int'          : return 1 * 4;
            case 'Vector2Int'   : return 2 * 4;
            case 'Vector3Int'   : return 3 * 4;
            case 'Vector4Int'   : return 4 * 4;
            case 'Bool'         : return 1;
            default:
                throw ("Unable to determine size in bytes for Unknown Shader Attribute Type: " + this.name);
        }
    }

    componentCount() {
        switch(this.name) {
            case 'Float'       : return 1;
            case 'Vector2'      : return 2;
            case 'Vector3'      : return 3;
            case 'Vector4'      : return 4;
            case 'Matrix3x3'    : return 3 * 3;
            case 'Matrix4x4'    : return 4 * 4;
            case 'Int'          : return 1;
            case 'Vector2Int'   : return 2;
            case 'Vector3Int'   : return 3;
            case 'Vector4Int'   : return 4;
            case 'Bool'         : return 1;
            default:
                throw ("Unable to determine component count for Unknown Shader Attribute Type: " + this.name);
        }
    }
}


export class BufferElement {

    constructor(name, shaderAttributeType, normalize = false) {

        this.name = name;
        this.shaderAttributeType = shaderAttributeType;
        this.offset = 0;
        this.normalize = normalize;
    }

    getBufferElementName() {
        return this.name;
    }

    getEngineType() {
        return this.shaderAttributeType.getShaderAttributeName();
    }

    getSize() {
        return this.shaderAttributeType.getSize();
    }

    getOffset() {
        return this.offset;
    }

    getComponentCount() {
        return this.shaderAttributeType.getComponentCount();
    }

    shouldNormalize() {
        return this.normalize;
    }
}


export class BufferLayout {
    /**
     * Defines the layout to enabled in a glVertexAttributeArray.
     * @constructor
     * @param elements [ShaderAttributeType[]]
     */
    constructor(elements) {
        this.stride = 0;
        this.elements = elements;
        let currentOffset = 0;

        for(let i = 0; i < elements.length; ++i) {
            const element = elements[i];

            this.stride += element.getSize();
            element.offset = currentOffset;
            currentOffset += element.getSize();
        }
    }

    getElements() {
        return this.elements;
    }

    getStride() {
        return this.stride;
    }
}