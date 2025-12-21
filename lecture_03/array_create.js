// แบบ literal
let fruit = ['apple','banana','cherry'];
// แบบว่างเปล่า
let emptyarr = [];
// แบบกำหนดความยาวล่วงหน้า
let sizearr = Array(5);


// การหาความยาวของ array
console.log(fruit.length);
// เข้าถึงข้อมูลตัวสุดท้าย
console.log(fruit[fruit.length - 1]);
// เข้าถึง index ที่ไม่มีอยู่
console.log(fruit[3])