const promise = new Promise((resolve, reject) => { //ใช้สำหรับ phase 2 parameter
    const res = true;
    if (res){
        resolve("resolved");
    }
    else {
        reject(Error("ftal Error"));
    }
});

// promise.then(
//     (res) => console.log(res),
//     (err) => console.log(err),
// )

promise.then((res)=> console.log(res), (err)=>alert(err));