export class HeapItem {

    constructor(heapItemContainer) {
        this.heapIndex = 0;
        this.gCost = 0;
        this.hCost = 0;
        this.fCost = this.gCost + this.hCost;
        this.parentItem = null;
        this.heapItemContainer = heapItemContainer;
    }

    setGCost(gCost) {
        this.gCost = gCost;
        this.fCost = this.gCost + this.hCost;
    }

    setHCost(hCost) {
        this.hCost = hCost;
        this.fCost = this.gCost + this.hCost;
    }

    compareTo(other) {
        /*
        Priority is descending.  1 if greater priority, 0 if equivalent priority and -1 if lower priority.
         */

        if(this.fCost === other.fCost)
            return this.hCost < other.hCost ? 1 : -1;

        return this.fCost < other.fCost ? 1 : -1;
    }
}


export class Heap {

    constructor() {

        this.items = [];
        this.itemCount = 0;
    }

    isEmpty() {
        return this.itemCount === 0;
    }

    update(item) {
        this.sortUp(item);
    }

    add(item) {

        this.items[this.itemCount] = item;
        item.heapIndex = this.itemCount;
        this.itemCount++;
        this.sortUp(item);
    }

    remove() {

        this.itemCount--;
        const first = this.items[0];
        this.items[0] = this.items[this.itemCount];
        this.items[0].heapIndex = 0;
        this.sortDown(this.items[0]);
        return first;
    }

    contains(item) {
        return this.items[item.heapIndex] === item;
    }

    sortUp(item) {

        let parentIndex = Math.floor((item.heapIndex - 1) / 2);

        while(parentIndex >= 0) {

            const parentItem = this.items[parentIndex];

            // If the parent has a higher priority, the sort is finished.
            if(parentItem.compareTo(item) > 0)
                break;

            this.swap(this.items[parentIndex], item);
            parentIndex = Math.floor((item.heapIndex - 1) / 2);
        }
    }

    sortDown(item) {

        let childLeftIndex = item.heapIndex * 2 + 1;

        while(childLeftIndex < this.itemCount) {

            let childRightIndex = item.heapIndex * 2 + 2;

            // Initialize swap index to left - it's a valid element.
            let swapIndex = childLeftIndex;
            const leftChildItem = this.items[childLeftIndex];

            if(childRightIndex < this.itemCount) {
                // If the right child has a higher priority, set the swap index to it.
                if(this.items[childRightIndex].compareTo(leftChildItem) > 0)
                    swapIndex = childRightIndex;
            }

            const swapItem = this.items[swapIndex];

            // Both children had a lower priority, nothing to swap.
            if(swapItem.compareTo(item) < 0)
                break;

            this.swap(item, swapItem);

            childLeftIndex = item.heapIndex * 2 + 1;
            childRightIndex = item.heapIndex * 2 + 2;
        }
    }


    swap(itemA, itemB) {

        this.items[itemA.heapIndex] = itemB;
        this.items[itemB.heapIndex] = itemA;
        const itemAIndex = itemA.heapIndex;
        itemA.heapIndex = itemB.heapIndex;
        itemB.heapIndex = itemAIndex;
    }
}

