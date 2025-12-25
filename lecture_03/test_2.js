let values1 = ["apple", 1, false];
let values2 = ["fries", 2, true, "apple"];
let values3 = ["mars", 1, "apple"];

let bucket = [];

// ***************** 0 ***************

for (item_v1 of values1){
    for (item_v2 of values2){
        for (item_v3 of values3){
            if (item_v1 === item_v2 && item_v1 === item_v3){
                bucket.push(item_v1)
            }
        }
    }
}
console.log(bucket)

// ***************** 1 ***************

// for (i of values1){
//     for(x of values2){
//         if (i === x){
//             // console.log(i)
//             for (y of values3){
//                 if (i === y){
//                     bucket.push(i);
//                 }
//             }
//         }
//     }
// }
// console.log(bucket)

// ***************** 2 ***************

// ***************** 3 ***************