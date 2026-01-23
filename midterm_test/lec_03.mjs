const a = 5;
const b = 10;

const add = function (a, b){
    return (a + b);
};
console.log(`the sum of ${a} and ${b} is ${add(a, b)}`);

const add_1 = (a, b) => (a + b);
console.log(`the sum of ${a} and ${b} is ${add_1(a, b)}`);

const substract = (a, b) => {
    const result = a-b;
    return result;
}

console.log(a, b, substract(a,b))
// the sum of 5 and 10 is 15
// the sum of 5 and 10 is 15
// 5 10 -5