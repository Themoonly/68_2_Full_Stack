function yayOrNay(){ // yes or no
    return new Promise((resolve, reject) => {
        const val = Math.round(Math.random() * 1);
        console.log("genarated :", val)
        // math.round  คือการปัดเศษ 
        // math.random return 0 กับ 1
        val ? resolve("☻☻☻☻") : reject("☺☺☺☺");
        // ? curnary คือ if และ else แบบสั้น
    });
}

async function msg() {
    try{ // ทำค่า resolve เมื่อไม่มี error 
        const result = await yayOrNay();
        console.log(result);
    } // ทำ reject เมื่อมี error
    catch (err){
        console.log(err);
    }
}

msg();
msg();
msg();
msg();
msg();
msg();
msg();