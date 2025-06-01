class Example{
    static count: number = 0

    constructor(){
        Example.count++
    }

    getCount():number{
        return Example.count
    }
}


console.log(Example.count); // 0
const ex1 = new Example();
console.log(Example.count); // 1
const ex2 = new Example();
console.log(Example.count); // 2
