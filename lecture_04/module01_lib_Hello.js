const person = {
    name: "teerayut",
    weight: 85
}

function sayHello(){
    console.log("Hello world!")
}

function cube(x){
    return x*x*x;
}


const add = (a,b) => a+b;

const status = true;

// ตัวไหนที่อยากให้สามารถเรียกใช้ได้ นำมาใส่ไว้ใต้ล่าง
module.exports = {person, sayHello, cube, add, status}