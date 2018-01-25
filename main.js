/**
 * @constructor
 * @param {number} difficulty
 */
var Sudoko = function(difficulty) {
    /**
     * @type {number}
     */
    this.difficulty = difficulty * difficulty;
};

/**
 * Window have loaded
 */
Sudoko.prototype.onWindowLoad = function() {
    var parent = document.getElementById("sudoku");
    for (var row = 0; row < this.difficulty; row++) {
        for (var col = 0; col < this.difficulty; col++) {
            var field = document.createElement('div');

            field.classList.add("field");

            field.id = row + "x" + col;
            field.innerText = "1";
            parent.appendChild(field);
        }
    }
    this.onResize();
};

Sudoko.prototype.onResize = function() {
    var fields = document.getElementsByClassName("field");

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        field.style.cssText = "display:inline-block; width:100px; height:100px;text-align:center; vertical-align: middle;";
    }
};

var sudoku = new Sudoko(2);
window.addEventListener('load', sudoku.onWindowLoad.bind(sudoku));