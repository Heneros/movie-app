var Example = /** @class */ (function () {
    function Example() {
        Example.count++;
    }
    Example.prototype.getCount = function () {
        return Example.count;
    };
    Example.count = 0;
    return Example;
}());
console.log(Example.count); // 0
var ex1 = new Example();
console.log(Example.count); // 1
var ex2 = new Example();
console.log(Example.count); // 2
