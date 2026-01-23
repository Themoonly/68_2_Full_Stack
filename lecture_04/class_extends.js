// Class Inheritance (การสืบทอดคุณสมบัติ) ใน JavaScript ซึ่งเป็นหัวใจสำคัญของการเขียนโปรแกรมเชิงวัตถุ (OOP)

class media{
    constructor(info){
        // constructor(info): คือฟังก์ชันที่จะทำงานทันทีเมื่อมีการสร้าง Object ใหม่
        this.publishData = info.publishData;
        this.name = info.name;
        // this.publishData และ this.name: เป็นการกำหนดคุณสมบัติ (Property) พื้นฐานที่ "สื่อ" ทุกชนิดควรมี เช่น วันที่เผยแพร่และชื่อ
    }
}

class song extends media{
    // extends media: คำสั่งนี้บอกว่า Class song จะขอสืบทอดทุกอย่างมาจาก media
    constructor(songdata) {
        super(songdata);
        // super(songdata): เป็นคำสั่งที่สำคัญมาก! มันคือการเรียกใช้งาน constructor ของ Class แม่ เพื่อส่งข้อมูล name และ publishData ไปจัดการให้เรียบร้อยก่อน
        this.artist = songdata.artist;
    }
}
const mysong = new song({
    artist: "Queen",
    name: "Bohemain Rhapsody",
    publishData: 1975,
});

console.log(mysong.name)
console.log(mysong);

// Bohemain Rhapsody
// song { publishData: 1975, name: 'Bohemain Rhapsody', artist: 'Queen' }

// สรุป: การใช้ Class และ Inheritance ช่วยให้โค้ดของคุณ สะอาด ลดการเขียนซ้ำ (DRY - Don't Repeat Yourself) และจัดการได้ง่ายขึ้นเมื่อโปรแกรมใหญ่ขึ้น