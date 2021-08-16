import {Heap, HeapItem} from './heap.js'
import {Grid, GridDisplay} from './grid.js'

let gridDisplay, grid;

window.onload = () => {
    const testItemA = new HeapItem(6);
    const testItemB = new HeapItem(4);
    const testItemC = new HeapItem(8);
    const testItemD = new HeapItem(3);

    const heap = new Heap();
    heap.add(testItemA);
    heap.add(testItemB);
    heap.add(testItemC);
    heap.add(testItemD);

    const width = 500;
    const height = 500;
    const cellSize = 50;

    const rowCount = width / cellSize;
    const columnCount = height / cellSize;

    grid = new Grid(rowCount, columnCount);
    gridDisplay = new GridDisplay(grid, cellSize, width, height);

    drawGrid();

    document.onmousedown = onClick;
}

function onClick(event) {
    const inBounds = gridDisplay.inGridBounds(event.clientX, event.clientY);

    if(!inBounds) return;

    if(event.shiftKey && event.ctrlKey){
        gridDisplay.resetAllCells();
        return;
    }

    // Neighbors and Obstacles
    if(event.button === 0){
        if(event.shiftKey)
            gridDisplay.toggleDrawAllNeighbors(event.clientX, event.clientY);
        else
            gridDisplay.toggleCellAsObstacle(event.clientX, event.clientY);
    }

    // Source & Destination cells
    else if (event.button === 1){
        if(event.shiftKey){
            gridDisplay.toggleSourceCell(event.clientX, event.clientY);
        }
        else if(event.ctrlKey) {
            gridDisplay.toggleDestinationCell(event.clientX, event.clientY);
        }
    }
}


function drawGrid() {
    gridDisplay.drawGrid();
}


function aStar() {

}

