/**
 * @constructor
 * @param {number} difficulty
 */
var Sudoko = function() {

    this.given = [
        [0, 0, 8, 3, 0, 0, 4, 0, 2],
        [0, 0, 0, 4, 0, 0, 3, 0, 0],
        [2, 0, 0, 6, 0, 0, 5, 9, 1],
        [6, 1, 9, 0, 0, 4, 0, 0, 0],
        [0, 0, 0, 0, 9, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 9, 1, 5],
        [1, 4, 3, 0, 0, 7, 0, 0, 9],
        [0, 0, 6, 0, 0, 3, 0, 0, 0],
        [9, 0, 2, 0, 0, 5, 8, 0, 0]
    ];


    /**
     * @type {number}
     */
    this.difficulty = Math.sqrt(this.given[0].length);

    this.stepIndex = 0;
};

/**
 * Window have loaded
 */
Sudoko.prototype.onWindowLoad = function() {
    var parent = document.getElementById("sudoku");

    for (var i = 0; i < this.difficulty * this.difficulty; i++) {
        var block = document.createElement('div');

        block.classList.add("block");

        var posX = (i % this.difficulty) * this.difficulty * 50;
        var posY = Math.floor(i / this.difficulty) * this.difficulty * 50;

        block.style.width = (this.difficulty * 50) + "px";
        block.style.height = (this.difficulty * 50) + "px";
        block.style.left = posX + "";
        block.style.top = posY + "";
        block.style.position = "absolute";
        block.style.boxShadow = "inset 0.4px 0.4px 0.4px 0.4px #000";
        parent.appendChild(block);
    }

    for (var y = 0; y < this.difficulty * this.difficulty; y++) {
        for (var x = 0; x < this.difficulty * this.difficulty; x++) {
            var field = document.createElement('div');

            field.classList.add("field");

            field.dataset.x = x + "";
            field.dataset.y = y + "";
            field.dataset.given = String(this.given[y][x] !== 0);
            field.id = x + "x" + y;
            field.innerText = this.given[y][x] !== 0 ? this.given[y][x] : "";
            parent.appendChild(field);
        }
    }

    this.onResize();

    setTimeout(function() {
        this.doNextStep(0);
    }.bind(this), 0);
};

Sudoko.prototype.isGiven = function(x, y) {
    return this.given[y][x] !== 0;
};

Sudoko.prototype.isEmpty = function(x, y) {
    return document.getElementById(x + "x" + y).innerText === "";
};

Sudoko.prototype.setActive = function(x, y, active) {
    var element = document.getElementById(x + "x" + y);
    if (element != null) {
        element.style.background = active ? "#d8ffa7" : "";
    }

};

Sudoko.prototype.setValue = function(x, y, value) {
    document.getElementById(x + "x" + y).innerText = value !== 0 ? value : "";
};


Sudoko.prototype.incValue = function(x, y) {
    var value = Number(document.getElementById(x + "x" + y).innerText);
    value++;
    this.setValue(x, y, value);
};


Sudoko.prototype.getValue = function(x, y) {
    return document.getElementById(x + "x" + y).innerText;
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
    return true;
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
    return true;
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
    return true;
};

Sudoko.prototype.isValueValid = function(x, y) {
    return this.getValue(x, y) <= this.difficulty * this.difficulty;
};



Sudoko.prototype.step = function(direction) {
    var x = (this.stepIndex % (this.difficulty * this.difficulty));
    var y = Math.floor(this.stepIndex / (this.difficulty * this.difficulty));
    if (this.stepIndex === -1) {
        console.log(x, y, this.stepIndex, "tofarback");
        return this.doNextStep(1);
    }

    if (this.stepIndex === this.difficulty * this.difficulty * this.difficulty * this.difficulty) {
        console.log(x, y, this.stepIndex, "GREAT SUCCESS");
        return;
    }

    // Show background active
    this.setActive(x, y, true);

    // Step forward or backward.
    if (this.isGiven(x, y)) {
        console.log(x, y, this.stepIndex, "given");
        return direction === 1 ? this.doNextStep(1) : this.doNextStep(-1);
    }

    // If nothing there, start with 1.
    if (this.isEmpty(x, y)) {
        this.setValue(x, y, 1);
    }

    if (this.isChecksValid(x, y) && direction > -1) {
        console.log(x, y, this.stepIndex, "valid");
        return this.doNextStep(1);
    }

    this.incValue(x, y);
    if (!this.isValueValid(x, y)) {
        this.setValue(x, y, "");
        console.log(x, y, this.stepIndex, "invalidvalue");
        return this.doNextStep(-1);
    }
    console.log(x, y, this.stepIndex, "inc");
    return this.doNextStep(0);
};


Sudoko.prototype.doNextStep = function(direction) {
    setTimeout(function() {
        var x = (this.stepIndex % (this.difficulty * this.difficulty));
        var y = Math.floor(this.stepIndex / (this.difficulty * this.difficulty));
        this.setActive(x, y, false);

        this.stepIndex += direction;

        this.step(direction);
    }.bind(this), 1);
};



Sudoko.prototype.onResize = function() {
    var fields = document.getElementsByClassName("field");

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var posX = field.dataset.x * 50;
        var posY = field.dataset.y * 50;
        field.style.position = "absolute";
        field.style.left = posX + "";
        field.style.top = posY + "";
        field.style.width = "50px";
        field.style.height = "50px";
        field.style.textAlign = "center";
        field.style.verticalAlign = "middle";
        field.style.boxShadow = "inset 0.1px 0.1px 0.1px 0.1px #000";
        if (field.dataset.given === "true") {
            field.style.fontWeight = "bold";
        }
    }
};

var sudoku = new Sudoko();
window.addEventListener('load', sudoku.onWindowLoad.bind(sudoku));

