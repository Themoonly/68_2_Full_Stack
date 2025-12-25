// เมธอด .map() จะทำการ วนลูป ไปยังสมาชิกทุกตัวใน Array และนำสมาชิกแต่ละตัวไปเข้าฟังก์ชันที่เราเขียนไว้ จากนั้นจะเก็บผลลัพธ์ที่ได้จากฟังก์ชันนั้นมาสร้างเป็น Array ใหม่ที่มีขนาดเท่าเดิม โดยไม่กระทบกับ Array ต้นฉบับ

const finalParicipants = ["Taylor", "Donald", "Don", "Natasha", "Bobby"];

const annoucement = finalParicipants.map((member) => {
    return member + " joined the contest.";
}); 

console.log(annoucement);


// [
//   'Taylor joined the contest.',
//   'Donald joined the contest.',
//   'Don joined the contest.',
//   'Natasha joined the contest.',
//   'Bobby joined the contest.'
// ]
