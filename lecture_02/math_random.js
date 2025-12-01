function generatempID(){
    const randompart = Math.random().toString(36).substring(2, 8) 
    console.log(`random part: ${randompart}`);
    // create random string;
    return randompart.toUpperCase();
}

const orderID = generatempID();
console.log(`id order: ${orderID}`);