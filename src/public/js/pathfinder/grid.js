import {HeapItem} from './heap.js'


export class GridDisplay {

    /**
     * Represents the behavior and state of the rendered grid.
     * @constructor
     * @param {Grid} grid
     * @param {number} cellSize
     * @param {number} width
     * @param {number} height
     */
    constructor(grid, cellSize, width, height) {

        this.grid = grid;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.padding = 10;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pathfinding-grid-canvas';
        this.initializeCanvas();
        this.context = this.canvas.getContext('2d');

        this.currentSourceCell = null;
        this.currentDestinationCell = null;

        this.resetAllCells();
    }

    /**
     * Initializes the grid-rendering canvas with a width and height.
     * The canvas is appended to a parent div.
     * The bottom left coordinate of the canvas is stored for future use when filling grid cells.
     * A reset button is initialized so that on click the grid is effectively cleared and redrawn to display grid lines.
     */
    initializeCanvas() {
        const canvasWidth = this.width + (this.padding * 2) + 1;
        const canvasHeight = this.height + (this.padding * 2) + 1;

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        document.getElementById('pathfinder-parent').appendChild(this.canvas);

        // Get bounds after appending to parent to set the bounds.
        const bounds = this.canvas.getBoundingClientRect();
        this.canvasBottomLeftX = this.padding;
        this.canvasBottomLeftY = bounds.height - this.padding;

        const resetGridButton = document.getElementById('reset-grid-button');
        resetGridButton.onclick = () => this.resetAllCells();
    }

    /**
     * Checks whether the given coordinate is within the bounds of the canvas rect.
     * @param {number} x - The x coordinate to check if in bounds.
     * @param {number} y - The y coordinate to check if in bounds.
     * @returns {boolean} - Is the coordinate within the bounds of the canvas rect?
     */
    inGridBounds(x, y) {

        const bounds = this.canvas.getBoundingClientRect();

        return x < bounds.right - this.padding && x > bounds.left + this.padding && y < bounds.bottom - this.padding && y > bounds.top + this.padding;
    }

    /**
     * Draws the grid lines for the grid using the width, height and cell size provided to the constructor.
     */
    drawGridLines() {

        this.context.beginPath();

        // Draw horizontal lines
        for(let x = 0; x <= this.width; x+= this.cellSize) {
            this.context.moveTo(0.5 + x + this.padding, this.padding);
            this.context.lineTo(0.5 + x + this.padding, this.height + this.padding);
        }

        // Draw vertical lines
        for(let x = 0; x <= this.height; x+= this.cellSize) {
            this.context.moveTo(this.padding, 0.5 + x + this.padding);
            this.context.lineTo(this.width + this.padding, 0.5 + x + this.padding);
        }

        this.context.strokeStyle = 'white';
        this.context.stroke();
        this.context.closePath();
    }

    /**
     * If the given coordinate is contained in the grid bounds, returns the nearest GridItem.
     * @param x
     * @param y
     * @returns {GridItem}
     */
    getGridCellFromMousePosition(x, y) {
        // Setup
        const bounds = this.canvas.getBoundingClientRect();

        // Mouse position accounting for canvas pixels - not display size in CSS.
        const mouseX = x - bounds.left;
        const mouseY = y - bounds.top;

        const cellCount = this.width / this.cellSize;

        // Padding-adjusted bounds.
        const left = bounds.left + this.padding;
        const right = bounds.right - this.padding;
        const top = bounds.top + this.padding;
        const bottom = bounds.bottom - this.padding;

        // Find the index of the cell in the grid.
        const percentX = (x - left) / (right - left);

        // Invert y so the 0% is on the bottom of the canvas, not the top.
        const percentY = 1 - ((y - top) / (bottom - top));

        const column = Math.floor(percentX * cellCount);
        const row = Math.floor(percentY * cellCount);

        const gridItem = this.grid.getGridItem(row, column);

        return gridItem;
    }

    /**
     * Sets the "isPath" flag for each GridItem contained in the path array.
     * The flag is used when filling the cells of the grid.
     * @param {GridItem[]} path
     * @param {number} intervalSeconds
     */
    displayPath(path, intervalSeconds) {

        let currentPathIndex = 1;

        const display = setInterval(() => {

            if(currentPathIndex >= path.length - 1)
                clearInterval(display);
            else {

                const currentCell = path[currentPathIndex];

                currentCell.toggleIsPathCell();

                this.fillCells();

                currentPathIndex++;
            }
        }, intervalSeconds * 1000)
    }


    /**
     * Toggles all state members of a GridItem object to false.
     * When this occurs, a redraw of the grid will render only the grid lines and will fill each
     * cell with a black rect.
     */
    resetAllCells() {
        this.grid.gridItems.forEach(t => { t.drawAsNeighbor = false; t.isObstacle = false; t.isPathCell = false;})

        if(this.currentSourceCell !== null)
            this.currentSourceCell.toggleSourceCell();
        if(this.currentDestinationCell !== null)
            this.currentDestinationCell.toggleDestinationCell();

        this.currentSourceCell = null;
        this.currentDestinationCell = null;

        this.toggleFindPathButton(true);

        this.fillCells();
    }

    /**
     * Toggles the given flag (selectedOption) of the closest GridItem to the coordinate (x, y).
     * @param {number} x
     * @param {number} y
     * @param {string} selectedOption
     */
    toggleCell(x, y, selectedOption) {
        if(selectedOption === 'Obstacle')
            this.toggleCellAsObstacle(x, y);
        else if (selectedOption === 'Neighbors')
            this.toggleDrawAllNeighbors(x, y);
        else if (selectedOption === 'Source')
            this.toggleSourceCell(x, y);
        else if (selectedOption === 'Destination')
            this.toggleDestinationCell(x, y);
    }

    /**
     * Enables or disables the button for finding a path.
     * @param {boolean} disabled
     */
    toggleFindPathButton(disabled) {
        const findPathButton = document.getElementById('run-astar-button');

        findPathButton.disabled = disabled;
    }

    /**
     * Finds the nearest cell to the coordinate (x, y) then toggles the "Obstacle" state of the cell.
     * @param {number} x
     * @param {number} y
     */
    toggleCellAsObstacle(x, y) {

        const gridItem = this.getGridCellFromMousePosition(x, y);

        gridItem.toggleIsObstacle();

        this.fillCells();
    }

    /**
     * Finds the nearest cell to the coordinate (x, y) then toggles the "Neighbor" state of the cell.
     * @param {number} x
     * @param {number} y
     */
    toggleDrawAllNeighbors(x, y) {

        const gridItem = this.getGridCellFromMousePosition(x, y);

        const neighbors = this.grid.getNeighborCells(gridItem);

        neighbors.forEach(t => t.toggleIsNeighbor());

        this.fillCells();
    }

    /**
     * Finds the nearest cell to the coordinate (x, y) then toggles the "Source" state of the cell.
     * @param {number} x
     * @param {number} y
     */
    toggleSourceCell(x, y) {

        const gridItem = this.getGridCellFromMousePosition(x, y);

        if(this.currentSourceCell !== null) {
            this.currentSourceCell.toggleSourceCell();

            if(this.currentSourceCell === gridItem) {
                this.fillCells();
                this.currentSourceCell = null;
                return;
            }
        }

        gridItem.toggleSourceCell();

        this.currentSourceCell = gridItem;

        this.toggleFindPathButton(this.currentSourceCell === null || this.currentDestinationCell === null);

        this.fillCells();
    }

    /**
     * Finds the nearest cell to the coordinate (x, y) then toggles the "Destination" state of the cell.
     * @param {number} x
     * @param {number} y
     */
    toggleDestinationCell(x, y) {

        const gridItem = this.getGridCellFromMousePosition(x, y);

        if(this.currentDestinationCell !== null) {
            this.currentDestinationCell.toggleDestinationCell();

            if(this.currentDestinationCell === gridItem) {
                this.fillCells();
                this.currentDestinationCell = null;
                return;
            }
        }

        gridItem.toggleDestinationCell();

        this.currentDestinationCell = gridItem;

        this.toggleFindPathButton(this.currentSourceCell === null || this.currentDestinationCell === null);

        this.fillCells();
    }

    /**
     * Fills each of the cells with a rect of a given color depending on the state of each cell.
     * 'green' - neighbor flag on.
     * 'red' - obstacle flag on.
     * 'cyan' - source flag on.
     * 'magenta' - destination flag on.
     * 'yellow' - path flag on.
     * If the cell has the path flag turned on, text is filled onto the cell's rect to display the hCost, gCost
     * and fCost of the cell's heapItem.
     * hCost - top left
     * gCost - top right
     * fCost - middle
     */
    fillCells() {

        // Clear then redraw.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGridLines();

        // Iterate over all of the grid items, filling their cells depending on their state.
        // Red if obstacle, black if not.
        for(let i = 0; i < this.grid.gridItems.length; i++) {

            let gridItem = this.grid.gridItems[i];
            let row = this.grid.gridItems[i].row;
            let column = this.grid.gridItems[i].column;

            const cellBottomLeftX = this.canvasBottomLeftX + column * this.cellSize;
            const cellBottomLeftY = this.canvasBottomLeftY - row * this.cellSize;

            let color = 'white';
            let writePathText = false;

            if(gridItem.isPathCell) {
                color = 'yellow';
                writePathText = true;
            }
            else {
                color = gridItem.drawAsNeighbor ? 'green' : gridItem.isObstacle ? 'red' : 'black';

                color = !gridItem.isSource && !gridItem.isDestination ? color : gridItem.isSource ? 'cyan' : 'magenta';
            }

            this.fillCell(cellBottomLeftX, cellBottomLeftY, color);

            if(writePathText) {
                this.context.textAlign = 'center';
                this.context.fillStyle = 'black';

                const centerX = cellBottomLeftX + this.cellSize / 2;
                const centerY = cellBottomLeftY - this.cellSize / 2 + this.cellSize * .1;

                const topLeftX = centerX + this.cellSize / 4;
                const topLeftY = centerY - this.cellSize / 3.5;

                const topRightX = centerX - this.cellSize / 4.5;
                const topRightY = centerY - this.cellSize / 3.5;

                this.context.fillText(gridItem.heapItem.fCost.toString(), centerX, centerY);
                this.context.fillText(gridItem.heapItem.gCost.toString(), topLeftX, topLeftY);
                this.context.fillText(gridItem.heapItem.hCost.toString(), topRightX, topRightY);
            }
        }
    }

    /**
     * Performs the color filling of a portion of the canvas representing a grid cell.
     * @param {number} cellBottomLeftX
     * @param {number} cellBottomLeftY
     * @param {string} color
     */
    fillCell(cellBottomLeftX, cellBottomLeftY, color) {


        this.context.beginPath();
        this.context.fillStyle = color;
        //TODO:: Change this: cellBottomLeftX + this.cellSize * .135 is hardcoded to fit the rect inside the cell.  It won't look nice for all cell sizes.
        this.context.rect(cellBottomLeftX + this.cellSize * .135, cellBottomLeftY - this.cellSize * .135, this.cellSize * .75, -this.cellSize * .75);
        this.context.fill();
        this.context.closePath();
    }
}


export class Grid {

    /**
     * Represents a 2D grid.
     * @param {number} rowCount
     * @param {number} columnCount
     */
    constructor(rowCount, columnCount) {

        this.rowCount = rowCount;
        this.columnCount = columnCount;

        this.gridItems = [];

        this.initializeGridItems();
    }

    /**
     * Constructs and pushes (row * columns) GridItems into a member array.
     */
    initializeGridItems() {
        for(let y = 0; y < this.rowCount; y++) {
            for(let x = 0; x < this.columnCount; x++) {
                this.gridItems[y * this.columnCount + x] = new GridItem(y, x);
            }
        }
    }

    /**
     * Returns the GridItem located at the given row/column.
     * @param {number} row
     * @param {number} column
     * @returns {GridItem}
     */
    getGridItem(row, column) {
        if(row >= this.rowCount || column >= this.columnCount || row < 0 || column < 0)
            return null;

        return this.gridItems[row * this.columnCount + column];
    }

    /**
     * Finds all orthogonal cells to the given cell.
     * @param {GridItem} gridItem - The GridItem to find neighbors for.
     * @returns {GridItem[]} - The neighboring cells.
     */
    getNeighborCells(gridItem) {

        const neighbors = [];

        for(let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {

                // Same cell as input.
                if(x === 0 && y === 0 || Math.abs(x) === 1 && Math.abs(y) === 1) continue;

                const offsetY = gridItem.row + y;
                const offsetX = gridItem.column + x;

                // Out of bounds.
                if(offsetX < 0 || offsetX > this.columnCount - 1 || offsetY < 0 || offsetY > this.rowCount - 1)
                    continue;

                neighbors.push(this.gridItems[offsetY * this.columnCount + offsetX]);
            }
        }

        return neighbors;
    }
}


class GridItem {

    /**
     * Represents a grid cell.
     * @param {number} row
     * @param {number} column
     */
    constructor(row, column) {

        this.heapItem = new HeapItem(this);
        this.row = row;
        this.column = column;
        this.isObstacle = false;
        this.drawAsNeighbor = false;
        this.isSource = false;
        this.isDestination = false;
        this.isPathCell = false;
    }

    /**
     * Toggles the isObstacle flag.
     */
    toggleIsObstacle() {
        this.isObstacle = !this.isObstacle;
    }

    /**
     * Toggles the drawAsNeighbor flag.
     */
    toggleIsNeighbor() {
        this.drawAsNeighbor = !this.drawAsNeighbor;
    }

    /**
     * Toggles the isSource flag.
     */
    toggleSourceCell() {
        this.isSource = !this.isSource;
    }

    /**
     * Toggles the isDestination flag.
     */
    toggleDestinationCell() {
        this.isDestination = !this.isDestination;
    }

    /**
     * Toggles the isPathCell flag.
     */
    toggleIsPathCell() {
        this.isPathCell = !this.isPathCell;
    }
}