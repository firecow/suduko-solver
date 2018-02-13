/**
 * Gets called when One Step button is pressed, or x times every second if Auto is enabled.
 */
Sudoko.prototype.step = function() {
    var x, y;
    var direction = this.direction;
    var size = this.difficulty * this.difficulty;

    // Calculate x and y from index.
    var index = this.stepIndex;
    x = (index % size);
    y = Math.floor(index / size);

    if (index === 81) {
        this.print(x, y, "GREAT SUCCESS");
        return;
    }

    // If it is a given number, bypass it by going in the direction, we are coming from.
    if (this.isGiven(x, y)) {
        this.print(x, y, "given");
        return direction === 1 ? this.doNextStep(1) : this.doNextStep(-1);
    }

    // Is it a valid number horizontally, vertically and in the box.
    if (this.isChecksValid(x, y) && direction > -1) {
        this.print(x, y, "valid");
        return this.doNextStep(1);
    }

    // Increment by one.
    this.incrementValue(x, y);

    // Is the new value valid.
    if (!this.isValueValid(x, y)) {
        this.print(x, y, "invalidvalue");
        this.setValue(x, y, "");
        return this.doNextStep(-1);
    }

    this.print(x, y, "inc");
    return this.doNextStep(0);
};