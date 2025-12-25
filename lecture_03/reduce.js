const arrayofnumbers = [1,2,3,4];

const sum = arrayofnumbers.reduce((accumulator, currenvalue) => {
    return accumulator + currenvalue;
});

console.log(sum);