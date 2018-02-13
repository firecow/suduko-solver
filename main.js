/**
 * @constructor
 */
var Sudoko = function() {

    this.given = [
        [0, 0, 0,  2, 6, 0,  7, 0, 1],
        [6, 8, 0,  0, 7, 0,  0, 9, 0],
        [1, 9, 0,  0, 0, 4,  5, 0, 0],

        [8, 2, 0,  1, 0, 0,  0, 4, 0],
        [0, 0, 4,  6, 0, 2,  9, 0, 0],
        [0, 5, 0,  0, 0, 3,  0, 2, 8],

        [0, 0, 9,  3, 0, 0,  0, 7, 4],
        [0, 4, 0,  0, 5, 0,  0, 3, 6],
        [7, 0, 3,  0, 1, 8,  0, 0, 0]
    ];

    // this.given = [
    //     [0, 0, 8, 3, 0, 0, 4, 0, 2],
    //     [0, 0, 0, 4, 0, 0, 3, 0, 0],
    //     [2, 0, 0, 6, 0, 0, 5, 9, 1],
    //     [6, 1, 9, 0, 0, 4, 0, 0, 0],
    //     [0, 0, 0, 0, 9, 0, 0, 0, 0],
    //     [0, 0, 0, 2, 0, 0, 9, 1, 5],
    //     [1, 4, 3, 0, 0, 7, 0, 0, 9],
    //     [0, 0, 6, 0, 0, 3, 0, 0, 0],
    //     [9, 0, 2, 0, 0, 5, 8, 0, 0]
    // ];

    /**
     * @type {number}
     */
    this.difficulty = Math.sqrt(this.given[0].length);

    /**
     * @type {number}
     */
    this.direction = 0;

    /**
     * @type {number}
     */
    this.stepIndex = 0;

    /**
     * @type {boolean}
     */
    this.auto = false;
};

Sudoko.prototype.isGiven = function(x, y) {
    return this.given[y][x] !== 0;
};

Sudoko.prototype.isEmpty = function(x, y) {
    return document.getElementById(x + "x" + y).dataset.value === "";
};

Sudoko.prototype.setColor = function(x, y, color) {
    var element = document.getElementById(x + "x" + y);
    if (element != null) {
        element.style.background = color;
    }

};

Sudoko.prototype.setValue = function(x, y, value) {
    var element = document.getElementById(x + "x" + y);
    element.dataset.value = value !== 0 ? value : "";

    var span = element.querySelector("span");
    span.innerText = value !== 0 ? value : "";
};


Sudoko.prototype.incrementValue = function(x, y) {
    var value = this.getValue(x, y);
    if (value !== 0) {
        value++;
    } else {
        value = 1;
    }

    this.setValue(x, y, value);
};

Sudoko.prototype.getValue = function(x, y) {
    var element = document.getElementById(x + "x" + y);
    return element != null ? document.getElementById(x + "x" + y).dataset.value : "";
};

Sudoko.prototype.isChecksValid = function(x, y) {
    return this.isBoxCheckValid(x, y) && this.isHorizontalCheckValid(x, y) && this.isVerticalCheckValid(x, y);

};

Sudoko.prototype.isVerticalCheckValid = function(x, y) {
    var value = this.getValue(x, y);
    for (var i = 0; i < this.difficulty * this.difficulty; i++) {
        if (i === y) {
            continue;
        }
        if (value === this.getValue(x, i)) {
            return false;
        }
    }
    return value !== "";
};

Sudoko.prototype.isHorizontalCheckValid = function(x, y) {
    var value = this.getValue(x, y);
    for (var i = 0; i < this.difficulty * this.difficulty; i++) {
        if (i === x) {
            continue;
        }
        if (value === this.getValue(i, y)) {
            return false;
        }
    }
    return value !== "";
};

Sudoko.prototype.isBoxCheckValid = function(x, y) {
    var value = this.getValue(x, y);

    var boxX = Math.floor(x / this.difficulty);
    var boxY = Math.floor(y / this.difficulty);

    for (var by = boxY * this.difficulty; by < boxY * this.difficulty + this.difficulty; by++) {
        for (var bx = boxX * this.difficulty; bx < boxX * this.difficulty + this.difficulty; bx++) {
            if (bx === x && by === y) {
                continue;
            }
            if (value === this.getValue(bx, by)) {
                return false;
            }
        }
    }
    return value !== "";
};

Sudoko.prototype.isValueValid = function(x, y) {
    return this.getValue(x, y) <= this.difficulty * this.difficulty;
};

Sudoko.prototype.doNextStep = function(direction) {
    this.stepIndex += direction;
    this.direction = direction;

    if (this.auto) {
        setTimeout(function() {
            this.step();
        }.bind(this), 200);
    }
};

Sudoko.prototype.onRestartClicked = function() {
    window.location.reload(true);
};

Sudoko.prototype.onAutoClicked = function() {
    if (this.auto) {
        this.auto = false;
    } else {
        this.auto = true;
        this.step();
    }
};

Sudoko.prototype.onOneStepClicked = function() {
    this.step();
};


Sudoko.prototype.print = function(x, y, text) {
    console.log("x", x, "y", y, "index", this.stepIndex, "value", this.getValue(x, y), text);
};

/**
 * Window have loaded
 */
Sudoko.prototype.onWindowLoad = function() {
    var parent = document.getElementById("sudoku");

    for (var i = 0; i < this.difficulty * this.difficulty; i++) {
        var block = document.createElement('div');
        block.classList.add("block");
        block.style.boxShadow = "inset 0.4px 0.4px 0.4px 0.4px #000";
        parent.appendChild(block);
    }

    i = 0;
    for (var y = 0; y < this.difficulty * this.difficulty; y++) {
        for (var x = 0; x < this.difficulty * this.difficulty; x++) {
            var field = document.createElement('div');
            var span = document.createElement('span');
            var spanIndex = document.createElement('span');
            spanIndex.innerText = i + "";
            span.innerText = "0";


            field.appendChild(span);
            field.appendChild(spanIndex);

            parent.appendChild(field);

            field.classList.add("field");
            field.dataset.x = x + "";
            field.dataset.y = y + "";
            field.dataset.given = String(this.given[y][x] !== 0);
            field.id = x + "x" + y;
            field.style.verticalAlign = "middle";

            span.style.transformOrigin = "0 0 0";
            span.style.transform = "translate(-50%, -50%)";
            span.style.top = "50%";
            span.style.left = "50%";
            span.style.position = "absolute";

            spanIndex.style.background = "rgba(0, 0, 0, 0)";
            spanIndex.style.color = "rgba(0, 0, 0, 0.5)";
            spanIndex.style.fontSize = "10px";
            spanIndex.style.fontWeight = "normal";
            spanIndex.style.transformOrigin = "0 0 0";
            spanIndex.style.transform = "translate(0%, 0%)";
            spanIndex.style.top = "5%";
            spanIndex.style.left = "5%";
            spanIndex.style.position = "absolute";

            this.setValue(x, y, this.given[y][x]);

            i++;
        }
    }

    this.onResize();
};

/**
 * Window have been resized.
 */
Sudoko.prototype.onResize = function() {
    var fields = document.getElementsByClassName("field");
    var blocks = document.getElementsByClassName("block");
    var bodyWidth = document.body.offsetWidth;
    var bodyHeight = document.body.offsetHeight;
    var cellSize = Math.min(bodyWidth, bodyHeight) / (this.difficulty * this.difficulty);
    var i, posX, posY;

    for (i = 0; i < fields.length; i++) {
        var field = fields[i];
        posX = field.dataset.x * cellSize;
        posY = field.dataset.y * cellSize;
        field.style.position = "absolute";
        field.style.left = posX + "";
        field.style.top = posY + "";
        field.style.width = cellSize + "px";
        field.style.height = cellSize + "px";
        field.style.textAlign = "center";
        field.style.verticalAlign = "middle";
        field.style.boxShadow = "inset 0.1px 0.1px 0.1px 0.1px #000";
        field.style.fontFamily = "Roboto";
        if (field.dataset.given === "true") {
            field.style.fontWeight = "bold";
            field.style.color = "red";
        }
    }

    for (i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        posX = (i % this.difficulty) * this.difficulty * cellSize;
        posY = Math.floor(i / this.difficulty) * this.difficulty * cellSize;

        block.style.width = (this.difficulty * cellSize) + "px";
        block.style.height = (this.difficulty * cellSize) + "px";
        block.style.left = posX + "";
        block.style.top = posY + "";
        block.style.position = "absolute";
    }

};

var sudoku = new Sudoko();
window.addEventListener('load', sudoku.onWindowLoad.bind(sudoku));
window.addEventListener('resize', sudoku.onResize.bind(sudoku));

