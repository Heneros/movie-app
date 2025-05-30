var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Person = /** @class */ (function () {
    function Person(name, age) {
        this.name = name;
        this.year = this.setYear(age);
    }
    Person.prototype.printPerson = function () {
        console.log("\u0418\u043C\u044F: ".concat(this.name, "  \u0413\u043E\u0434 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F: ").concat(this.year));
    };
    Person.prototype.setYear = function (age) {
        return new Date().getFullYear() - age;
    };
    return Person;
}());
var Employee = /** @class */ (function (_super) {
    __extends(Employee, _super);
    function Employee(name, age, company) {
        var _this = _super.call(this, name, age) || this;
        _this.company = company;
        return _this;
    }
    Employee.prototype.printEmployee = function () {
        //console.log("Year: " + this.year);    // поле year недоступно, так как private
        // setYear(25);                         // метод setYear недоступен, так как private
        this.printPerson(); // метод printPerson доступен, так как protected
        console.log("\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F: ".concat(this.company));
    };
    return Employee;
}(Person));
var sam = new Employee('Sam', 31, 'Microsoft');
sam.printEmployee();
