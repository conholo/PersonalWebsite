import {HeapItem} from './heap.js'


export class GridDisplay {

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
    }

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
    }

    inGridBounds(x, y) {

        const bounds = this.canvas.getBoundingClientRect();

        return x < bounds.right - this.padding && x > bounds.left + this.padding && y < bounds.bottom - this.padding && y > bounds.top + this.padding;
    }

    drawGrid() {

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

    resetAllCells() {
        this.grid.gridItems.forEach(t => { t.drawAsNeighbor = false; t.isObstacle = false;})

        if(this.currentSourceCell !== null)
            this.currentSourceCell.toggleSourceCell();
        if(this.currentDestinationCell !== null)
            this.currentDestinationCell.toggleDestinationCell();

        this.fillCells();
    }

    toggleCellAsObstacle(x, y) {

        const gridItem = this.getGridCellFromMousePosition(x, y);

        gridItem.toggleIsObstacle();

        this.fillCells();
    }

    toggleDrawAllNeighbors(x, y) {

        const gridItem = this.getGridCellFromMousePosition(x, y);

        const neighbors = this.grid.getNeighborCells(gridItem);

        neighbors.forEach(t => t.toggleIsNeighbor());

        this.fillCells();
    }

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

        this.fillCells();
    }

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

        this.fillCells();
    }

    fillCells() {

        // Clear then redraw.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();

        // Iterate over all of the grid items, filling their cells depending on their state.
        // Red if obstacle, black if not.
        for(let i = 0; i < this.grid.gridItems.length; i++) {

            let gridItem = this.grid.gridItems[i];
            let row = this.grid.gridItems[i].row;
            let column = this.grid.gridItems[i].column;

            const cellBottomLeftX = this.canvasBottomLeftX + column * this.cellSize;
            const cellBottomLeftY = this.canvasBottomLeftY - row * this.cellSize;

            let color = gridItem.drawAsNeighbor ? 'green' : gridItem.isObstacle ? 'red' : 'black';

            color = !gridItem.isSource && !gridItem.isDestination ? color : gridItem.isSource ? 'cyan' : 'magenta';

            this.fillCell(cellBottomLeftX, cellBottomLeftY, row, column, color);
        }
    }

    fillCell(cellBottomLeftX, cellBottomLeftY, row, column, color) {

        this.context.beginPath();
        this.context.fillStyle = color;
        //TODO:: Change this: cellBottomLeftX + this.cellSize * .135 is hardcoded to fit the rect inside the cell.  It won't look nice for all cell sizes.
        this.context.rect(cellBottomLeftX + this.cellSize * .135, cellBottomLeftY - this.cellSize * .135, this.cellSize * .75, -this.cellSize * .75);
        this.context.fill();
        this.context.closePath();
    }
}


export class Grid {

    constructor(rowCount, columnCount) {

        this.rowCount = rowCount;
        this.columnCount = columnCount;

        this.gridItems = [];

        this.initializeGridItems();
    }

    initializeGridItems() {
        for(let y = 0; y < this.rowCount; y++) {
            for(let x = 0; x < this.columnCount; x++) {
                this.gridItems[y * this.columnCount + x] = new GridItem(y, x);
            }
        }
    }

    getGridItem(row, column) {
        if(row >= this.rowCount || column >= this.columnCount || row < 0 || column < 0)
            return null;

        return this.gridItems[row * this.columnCount + column];
    }

    getAllObstacleCells() {

        const obstacleCells = [];

        for(let i = 0; i < this.rowCount * this.columnCount; i++) {

            if(!this.gridItems[i].isObstacle) continue;

            obstacleCells.push(this.gridItems[i]);
        }

        return obstacleCells;
    }

    getNeighborCells(gridItem) {

        const neighbors = [];

        for(let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {

                // Same cell as input.
                if(x === 0 && y === 0) continue;

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

    constructor(row, column) {

        this.heapItem = new HeapItem(0);
        this.row = row;
        this.column = column;
        this.isObstacle = false;
        this.drawAsNeighbor = false;
        this.isSource = false;
        this.isDestination = false;
    }

    toggleIsObstacle() {
        this.isObstacle = !this.isObstacle;
    }

    toggleIsNeighbor() {
        this.drawAsNeighbor = !this.drawAsNeighbor;
    }

    toggleSourceCell() {
        this.isSource = !this.isSource;
    }

    toggleDestinationCell() {
        this.isDestination = !this.isDestination;
    }
}