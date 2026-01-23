function processAndCombineString (strings, lengthThreahold){

    //การแปลงและกรอง
    let processed = strings
    .map(s => s.toUpperCase()) // แปลงเป็นตัวพิมพ์ใหญ่
    .filter(s => s.length >= lengthThreahold); 
    // กรองเฉพาะ str ที่ยาวกว่าาหรือเท่ากับ lengthThreahold

    // ช่วยนับสระ
    const countVowels = (str) => {
        const vowels = 'AEIOU';
        return str.split('').filter(char => vowels.includes(char)).length;
    };

    // จัดเรียง sorting
    processed.sort((a, b) => {
        let vowelsA = countVowels(a);
        let vowelsB = countVowels(b);

        if (vowelsA !== vowelsB){
            return vowelsB - vowelsA; // จำนวนสระจากมากไปน้อย
        }
        return a.localeCompare(b); // ถ้าสระเท่ากัน เรียงตามตัวอักษร A-Z
    });

    //ฟังชั่นการรวม
    return processed.join(' '); 
}

const strings = ["apple","banana","cherry","data","fig","grape"];
console.log(processAndCombineString(strings, 5)); 
//BANANA APPLE GRAPE CHERRY
console.log(processAndCombineString(strings, 6)); 
//BANANA CHERRY
console.log(processAndCombineString(["hi","hello","world"], 2)); 
//HELLO HI WORLD