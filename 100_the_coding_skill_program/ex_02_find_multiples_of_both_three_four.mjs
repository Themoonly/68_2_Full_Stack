function findmultiples_of_three_four(start,end){
    if(start > end){
        return [];
    }

    let result = [];

    for (let i = start; i <= end; i++){
        if (i % 3 === 0 && i % 4 === 0){
            result.push(i);
        }
    }

    return result;
};

console.log(findmultiples_of_three_four(10,50));
// Output: [12, 24, 36, 48]