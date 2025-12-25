// โจทย์นี้ต้องการให้เรานำสตริงที่เป็นสมการทางคณิตศาสตร์ 
// (เช่น "7*4-2") มาประมวลผลและคืนค่าผลลัพธ์ที่เป็นตัวเลข 
// JavaScript มีฟังก์ชันในตัวที่ยอดเยี่ยมสำหรับการทำงานนี้คือ eval()

function equation(equationstring){
    try{
        return eval(equationstring);
    }
    catch (e){
        console.error("error evaluatiing equation:",e);
        return NaN;
    }
}

console.log(`equation("1+1")  ${equation("1+1")}`); //2
console.log(`equation("7*4-2")  ${equation("7*4-2")}`); //26
console.log(`equation("1+1+1+1+1")  ${equation("1+1+1+1+1")}`); //5
console.log(`equation("100/5")  ${equation("100/5")}`); //20