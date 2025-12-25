// โค้ดที่คุณส่งมาเป็นการใช้เมธอด .map() ร่วมกับเทคนิคการทำ Object Destructuring และ Computed Property Names เพื่อเปลี่ยนรูปแบบโครงสร้างของ Object ใน Array
const KvArray = [
    {key: 1, value: 10},
    {key: 1, value: 20},
    {key: 3, value: 30},
];

const reformattedArray = KvArray.map(
    ({key, value}) => ({ [key]: value})
);
    // การใช้เครื่องหมายก้ามปู [] ล้อมรอบตัวแปร key หมายถึงการนำ ค่าที่อยู่ในตัวแปรนั้น มาตั้งเป็นชื่อ Property ของ Object

console.log(reformattedArray);
    // [ { '1': 10 }, { '1': 20 }, { '3': 30 } ]
console.log(KvArray);
    // [ { key: 1, value: 10 }, { key: 1, value: 20 }, { key: 3, value: 30 } ]