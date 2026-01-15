function promiseTimeout(ms){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function run() {
    console.log("Start!!");
    await promiseTimeout(2000); //รอเวลา 2 second การจะมี await ต้องมี async function ก่อน
    console.log("Stop!!");
}

console.log("ทำงานก่อน funtion")
run(); // async function 
console.log("ทำงานก่อน await promiseTimeout ")


// Start!!
// Stop!!