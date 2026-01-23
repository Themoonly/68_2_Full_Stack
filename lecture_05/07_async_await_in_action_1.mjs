function promiseTimeout(ms){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function longRunningOperation() {
    return 42;
}

async function run() {
    console.log("Start!!"); // start
    await promiseTimeout(2000);
    const response = await longRunningOperation(); 
    //ถ้าไม่มี await ของตัวที่ return ค่่า จะไม่ได้ค่าที่ return ของตัวมัน
    console.log(response); // 42

    console.log("Stop!!"); // stop
}
run();