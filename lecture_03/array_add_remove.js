// เพิ่มข้อมูลหนึ่งตัว หรือมากกว่า ไปยังท้าย array
let arr1 = ['A', true, 2];
arr1.push("new value");

console.log(arr1);

// ลบข้อมูลตัวสุดท้ายออกจาก array และคืนค่าที่ลบออกมา
let removevalue = arr1.pop();
console.log(removevalue)