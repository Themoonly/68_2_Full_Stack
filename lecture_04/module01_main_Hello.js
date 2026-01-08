const hello = require('./module01_lib_Hello')  // เรียกใช้ข้อมูลจากไฟล์อื่น

hello.sayHello();
console.log(hello.person.name); //name = teerayut
console.log(hello.cube(3)); // 3*3*# = 27
console.log(hello.add(5,4)) // 5 + 4 = 9
console.log(hello.status) //status = true