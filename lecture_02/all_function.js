const a = 5;
const b = 10;

// regular function 
const xadd = function (x, y) {
  return x + y;
};
console.log(`the sum of ${a} and ${b} is: ${xadd(a, b)}`);


// arrow function
const add = (x, y) => x + y;
console.log(`the sum of ${a} and ${b} is: ${add(a, b)}`);

// multiple line use
const subtract = (x, y) => {
  return x - y;
};
console.log(`the difference of ${b} and ${a} is: ${subtract(b, a)}`);
