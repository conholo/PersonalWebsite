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
        this._name = name;
        this._size = this.sizeInBytes();
        this._componentCount = this.componentCount();
    }


    sizeInBytes() {
        switch(this._name) {
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
                throw ("Unable to determine size in bytes for Unknown Shader Attribute Type: " + this._name);
        }
    }

    componentCount() {
        switch(this._name) {
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
                throw ("Unable to determine component count for Unknown Shader Attribute Type: " + this._name);
        }
    }
}


export class BufferElement {

    constructor(name, shaderAttributeType, normalize = false) {

        this._name = name;
        this._shaderAttributeType = shaderAttributeType;
        this._offset = 0;
        this._normalize = normalize;
    }

    getBufferElementName() {
        return this._name;
    }

    getEngineType() {
        return this._shaderAttributeType._name;
    }

    getSize() {
        return this._shaderAttributeType._size;
    }

    getOffset() {
        return this._offset;
    }

    getComponentCount() {
        return this._shaderAttributeType._componentCount;
    }

    shouldNormalize() {
        return this._normalize;
    }
}


export class BufferLayout {
    /**
     * Defines the layout to enabled in a glVertexAttributeArray.
     * @constructor
     * @param elements [ShaderAttributeType[]]
     */
    constructor(elements) {
        this._stride = 0;
        this._elements = elements;
        let currentOffset = 0;

        for(let i = 0; i < elements.length; ++i) {
            const element = elements[i];

            this._stride += element.getSize();
            element._offset = currentOffset;
            currentOffset += element.getSize();
        }
    }
}