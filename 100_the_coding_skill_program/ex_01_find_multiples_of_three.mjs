function findmultiplesthree(start,end){
    if (start > end){
        return [];
    }

    let result = [];

    for (let i = start; i <= end; i++){
        // ตรวจสอบว่าหาร 3 ลงตัวหรือไม่ (เศษเท่ากับ 0)
        if (i % 3 === 0){
            result.push(i)
            // Return Result: เก็บเลขนั้นลงใน Array
        }
    }
    return result
};

console.log(findmultiplesthree(10,25));
// ผลลัพธ์ที่ได้: [12, 15, 18, 21, 24]