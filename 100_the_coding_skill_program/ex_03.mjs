function findNonMultiples(start,end){
    if(start > end){
        return [];
    }

    let result = [];

    for(let i = start; i <= end;i++){
        if (i % 3 !== 0 && i % 4 !== 0 && i % 5 !== 0){
            result.push(i);
        }
    }

    return result;
}

console.log(findNonMultiples(10, 25))
// output: [11, 13, 14, 17, 19, 22, 23]