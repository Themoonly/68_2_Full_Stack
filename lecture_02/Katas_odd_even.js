function checkEventOrOdd(number){
    if (number % 2 === 0){
        return "Even";
    }else {
        return "Odd";
    }
}

console.log(checkEventOrOdd(10));
console.log(checkEventOrOdd(7));