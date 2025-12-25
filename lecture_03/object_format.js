// Object format
const book = {
    title: "1984",
    author: "Georage orwell",
    isAvailable: false
};

// converted to json
// แปลง Object เป็น JSON (เพื่อส่งไปที่อื่น)
const bookjson = JSON.stringify(book);
console.log(bookjson);
    //# {"title":"1984","author":"Georage orwell","isAvailable":false}

// แปลง JSON กลับเป็น Object (เพื่อนำมาใช้งานในโค้ด)
const backtoObject = JSON.parse(bookjson);
console.log(backtoObject.title);
    //# 1984

const booksjson = `[
    {"title": "Book A", "author": "Witer x"},
    {"title": "Book B", "author": "Witer y"},
    {"title": "Book C", "author": "Witer z"}
]`;

const booksArray = JSON.parse(booksjson);
booksArray.forEach((book,index) => {
    console.log(`เล่มที่ ${index + 1}: ${book.title}: ${book.author}`);    
    //# เล่มที่ 1: Book A: Witer x
    //# เล่มที่ 2: Book B: Witer y
    //# เล่มที่ 3: Book C: Witer z
});

var copies = [book, book];
var json = JSON.stringify(copies);
console.log(json);
    //# [{"title":"1984","author":"Georage orwell","isAvailable":false},{"title":"1984","author":"Georage orwell","isAvailable":false}]