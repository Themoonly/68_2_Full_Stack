function findLongestRepeateSubstring(inputStr){
    // longest Repeated Substring
    let longest = "";
    let n = inputStr.length;

    // รูปแบบ Substring 
    // ลูปชั้นที่ 1: กำหนดความยาวของ Substring ที่เราจะหา (เริ่มจากยาวสุดถอยลงมา)
    for (let len = n - 1;len > 0;len--){
        // ลูปชั้นที่ 2: เลื่อนตำแหน่งเริ่มต้นไปทีละตำแหน่ง
        for (let i = 0;i <= n - len; i++){
            let sub = inputStr.substring(i, i + len);

            // ตรวจสอบว่ามี substring นี้ซ้ำอยู่ในส่วนอื่นของข้อความหรือไม่
            // ใช้ lastIndexOf เพื่อหาตำแหน่งสุดท้าย ถ้าไม่เท่ากับ i แปลว่ามีซ้ำ
            if (inputStr.indexOf(sub) !== inputStr.lastIndexOf(sub)){
                return sub;
                // เพราะเราเริ่มเช็คจากความยาวมากสุด เจอแล้วคือคำตอบเลย
            }
        }
    }

    // กรณีพิเศษ 
    return "";
}

console.log(findLongestRepeateSubstring("banana"));
console.log(findLongestRepeateSubstring("abcd"));
console.log(findLongestRepeateSubstring("ababa"));