function genarateTempID(){
    const randomPart = Math.random().toString(36).substring(2, 8);
    return randomPart.toUpperCase();
}

const orderID = genarateTempID();
console.log(`ID : ${orderID}`);
// ID : Q4X2BG