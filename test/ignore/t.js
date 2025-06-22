var users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'admin' },
    { id: 4, name: 'David', role: 'user' },
];
function groupBy(array, key) {
    return array.reduce(function (result, item) {
        var groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}
var grouped = groupBy(users, 'role');
console.log(grouped);
