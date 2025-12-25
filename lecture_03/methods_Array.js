let arr1 = ["A",true,2];

// push and pop
console.log("\n***push and pop***\n");
// เพิ่มข้อมูลหนึ่งตัว หรือมากกว่า ไปยังท้าย array
console.log(arr1.push("New value : "));
console.log(arr1);
// ลบข้อมูลตัวสุดท้ายออกจาก array และคืนค่าที่ลบออกมา
console.log(arr1.pop())
console.log(arr1);

// shift and unshift
console.log("\n***shift and unshift***\n");
// เพิ่มข้อมูลหนึ่งตัว หรือมากกว่า ไปยังด้านหน้าสุด array
console.log(arr1.unshift("new value"));  
console.log(arr1); //[ 'new value', 'A', true, 2 ]
// ลบข้อมูลตัวแรกออกจาก array และคืนค่าที่ลบออกมา
console.log(arr1.shift()); //new value
console.log(arr1); //[ 'A', true, 2 ]


// นำสอง array มารวมกันเพื่อสร้างเป็นน array ใหม่
console.log("\n***concat***\n");
let arr2 = ["B",false, 3];
let newArr = arr1.concat(arr2);
let newArr2 = arr2.concat([1,2,3]);
console.log(newArr); //[ 'A', true, 2, 'B', false, 3 ]
console.log(newArr2); //[ 'B', false, 3, 1, 2, 3 ]

