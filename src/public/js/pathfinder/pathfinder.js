import {Heap, HeapItem} from './heap.js'
import {Grid, GridDisplay} from './grid.js'

let gridDisplay, grid;
let currentCellSelectionIndex = 0;

const selectionOptions = ["Obstacle", "Neighbors", 'Source', 'Destination'];
const selectionColors = ['red', 'green', 'cyan', 'magenta'];

window.onload = () => {

    initializeGrid();
    initializeTools();

    document.onmousedown = onClickCell;
}

function initializeTools() {
    const cellSelectorButton = document.getElementById('cell-selector-button');
    cellSelectorButton.style.backgroundColor = 'red';
    cellSelectorButton.innerText = 'Obstacle';

    cellSelectorButton.onclick = () => {
        currentCellSelectionIndex = currentCellSelectionIndex >= selectionOptions.length - 1 ? 0 : currentCellSelectionIndex + 1;
        cellSelectorButton.style.backgroundColor = selectionColors[currentCellSelectionIndex];
        cellSelectorButton.innerText = selectionOptions[currentCellSelectionIndex];
    }

    const findPathButton = document.getElementById('run-astar-button');
    findPathButton.onclick = runAStar;
}

function runAStar() {

    if (gridDisplay.currentSourceCell === null || gridDisplay.currentDestinationCell === null) return;

    const path = aStar(gridDisplay.currentSourceCell, gridDisplay.currentDestinationCell);

    if (path === undefined) {
        console.log("No path available!")
        return;
    }

    gridDisplay.displayPath(path, .5);
}

function onClickCell(event) {
    const inBounds = gridDisplay.inGridBounds(event.clientX, event.clientY);

    if (!inBounds) return;

    gridDisplay.toggleCell(event.clientX, event.clientY, selectionOptions[currentCellSelectionIndex]);
}

function initializeGrid() {
    const width = 500;
    const height = 500;
    const cellSize = 50;

    const rowCount = width / cellSize;
    const columnCount = height / cellSize;

    grid = new Grid(rowCount, columnCount);
    gridDisplay = new GridDisplay(grid, cellSize, width, height);

    gridDisplay.drawGridLines();
}


function retracePath(sourceCell, destinationCell) {

    const path = [];

    let currentCell = destinationCell;

    while (currentCell !== sourceCell) {

        path.push(currentCell);
        currentCell = currentCell.heapItem.parentItem.heapItemContainer;
    }

    path.push(sourceCell);

    reverseArray(path);
    return path;
}

function reverseArray(array) {

    for (let i = 0; i < Math.floor(array.length / 2); i++) {

        const swap = array[array.length - 1 - i];
        const temp = array[i];

        array[i] = swap;
        array[array.length - 1 - i] = temp;
    }
}

function aStar(source, destination) {

    const openSet = new Heap();
    openSet.add(source.heapItem);

    const closedSet = [];

    while (!openSet.isEmpty()) {

        const currentHeapItem = openSet.remove();
        closedSet.push(currentHeapItem);

        if (currentHeapItem.heapItemContainer === destination) {
            return retracePath(source, destination);
        }

        const neighborCells = grid.getNeighborCells(currentHeapItem.heapItemContainer);

        for (let i = 0; i < neighborCells.length; i++) {

            const neighborCell = neighborCells[i];

            let closedSetContains = false;

            for (let i = 0; i < closedSet.length; i++) {

                if (closedSet[i] === neighborCell.heapItem) {

                    closedSetContains = true;
                    break;
                }
            }

            if (closedSetContains || neighborCell.isObstacle) continue;

            const tentativeGCost = currentHeapItem.gCost + aStarDistance(currentHeapItem.heapItemContainer, neighborCell);

            if (tentativeGCost < currentHeapItem.gCost || !openSet.contains(neighborCell.heapItem)) {

                neighborCell.heapItem.setGCost(tentativeGCost);
                neighborCell.heapItem.setHCost(aStarDistance(neighborCell, destination));
                neighborCell.heapItem.parentItem = currentHeapItem;

                if (!openSet.contains(neighborCell.heapItem))
                    openSet.add(neighborCell.heapItem);
                else
                    openSet.update(neighborCell.heapItem);
            }
        }
    }
}


function aStarDistance(cellA, cellB) {

    const distanceColumn = Math.abs(cellA.column - cellB.column);
    const distanceRow = Math.abs(cellA.row - cellB.row);

    if (distanceColumn > distanceRow)
        return 14 * distanceRow + 10 * (distanceColumn - distanceRow);

    return 14 * distanceColumn + 10 * (distanceRow - distanceColumn);
}

