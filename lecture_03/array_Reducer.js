
// .reduce() ของ Array ใน JavaScript เพื่อทำการ "ยุบ" หรือ "รวม" ค่าใน Array ให้เหลือเพียงค่าเดียว (ในที่นี้คือการหาผลรวม) ครับ
// เมธอดนี้จะทำการวนลูป (Iterate) ไปตามสมาชิกใน Array โดยส่งค่าที่คำนวณได้จากรอบก่อนหน้า (accumulator) มาให้ใช้ในรอบถัดไป
const array = [15, 16, 17, 18, 19];

function reducer(accumulator, currenvalue, index){
    const returns = accumulator + currenvalue;
    console.log(
        `accumulator: ${accumulator}, currenvalue: ${currenvalue}, index: ${index}, returns: ${returns}`,
        // accumulator: ตัวสะสมผลลัพธ์ (เปรียบเสมือนตะกร้าที่เก็บผลรวมจากรอบก่อนๆ ไว้)
        // currenvalue: ค่าของสมาชิกตัวปัจจุบันใน Array ที่กำลังถูกวนลูปถึง
        // index: ลำดับตำแหน่งของสมาชิกตัวนั้น (0, 1, 2, ...)
        // returns: ตัวแปรที่คุณสร้างขึ้นเพื่อเก็บผลบวกของ accumulator + currenvalue ก่อนจะ return ออกไปเป็นค่าสะสมในรอบถัดไป
    );
    return returns;
}

// array.reduce(reducer);   //  start 15 + 16
array.reduce(reducer, 0)    //  start 0 + 15
// accumulator: 15, currenvalue: 16, index: 1, returns: 31
// accumulator: 31, currenvalue: 17, index: 2, returns: 48
// accumulator: 48, currenvalue: 18, index: 3, returns: 66
// accumulator: 66, currenvalue: 19, index: 4, returns: 85