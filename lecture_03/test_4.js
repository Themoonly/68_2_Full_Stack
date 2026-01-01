const message = 'Hello';
let sara = ['a','e','i','o','u'];
let iterator = message[Symbol.iterator]();
// บรรทัดนี้คือการเรียกใช้ Method พิเศษที่ชื่อว่า Symbol.iterator เพื่อสร้าง Iterator Object ขึ้นมา

while(true){
    let result = iterator.next();
    // Method .next() จะคืนค่าเป็น Object ที่มีหน้าตาแบบนี้: { value: "...", done: false }
    // value: คือข้อมูลในตำแหน่งปัจจุบัน (เช่น "H", "e", "l"...)
    // done: คือสถานะบอกว่า "อ่านจบหรือยัง?" (จะเป็น true เมื่อไม่มีข้อมูลเหลือแล้ว)
    for (text of sara){
        if (text === message){
            console.log(text);
        }
    }
   
    // if (result.done) break;
    // ถ้า done เป็น true (แปลว่าอ่านครบทุกตัวอักษรแล้ว) ให้หยุดทำงานและออกจากลูปทันที
    // console.log(result.value);
}