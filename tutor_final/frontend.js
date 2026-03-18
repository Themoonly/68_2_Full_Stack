const express = require("express");
const app = express();
const axios = require("axios");

const backendURL = "http://localhost:3000"; // กำหนด URL สำหรับเซิร์ฟเวอร์ backend

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // ใช้ middleware เพื่อให้สามารถรับข้อมูลในรูปแบบ JSON จากคำขอได้
app.set("view engine", "ejs"); // ตั้งค่า view engine เป็น EJS เพื่อให้สามารถใช้ไฟล์ .ejs ในการแสดงผลได้
app.use(express.static("public")); // ใช้ middleware เพื่อให้สามารถเข้าถึงไฟล์ในโฟลเดอร์ public ได้ เช่น ไฟล์ CSS, JavaScript, รูปภาพ เป็นต้น

app.get("/", (req, res) => { // กำหนด route สำหรับหน้าแรกของเว็บไซต์
    res.redirect("/books"); // เมื่อเข้าถึงหน้าแรกจะถูกเปลี่ยนเส้นทางไปยังหน้าแสดงรายการหนังสือ
});

app.get("/books", async (req, res) => { // กำหนด route สำหรับหน้าแสดงรายการหนังสือ
    try {
        const response = await axios.get(`${backendURL}/books`); // ส่งคำขอ GET ไปยังเซิร์ฟเวอร์ backend เพื่อดึงข้อมูลหนังสือทั้งหมด
        const books = response.data; // ดึงข้อมูลหนังสือจาก response ที่ได้รับจาก backend
        res.render("books", { books }); // แสดงผลไฟล์ books.ejs พร้อมส่งข้อมูลหนังสือไปยัง view
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

app.get("/books/:id/edit", async (req, res) => { // กำหนด route สำหรับหน้าแก้ไขข้อมูลหนังสือ
    const { id } = req.params; // ดึงข้อมูล id ของหนังสือจากพารามิเตอร์ของ URL
    try {
        const response = await axios.get(`http://localhost:3000/books/${id}`); // ส่งคำขอ GET ไปยังเซิร์ฟเวอร์ backend เพื่อดึงข้อมูลหนังสือที่ต้องการแก้ไข
        const book = response.data; // ดึงข้อมูลหนังสือจาก response ที่ได้รับจาก backend
        res.render("edit-book", { book }); // แสดงผลไฟล์ edit-book.ejs พร้อมส่งข้อมูลหนังสือไปยัง view
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนด route สำหรับการส่งข้อมูลที่แก้ไขแล้วของหนังสือ ไปยังเซิร์ฟเวอร์ backend เพื่อทำการอัปเดตข้อมูลหนังสือ
app.post("/books/:id/edit", async (req, res) => { 
    const { id } = req.params;
    const { title, author } = req.body; // ดึงข้อมูลชื่อหนังสือและผู้แต่งจากคำขอที่ส่งมาจากฟอร์มใน edit-book.ejs
    
    try {
        await axios.put(`${backendURL}/books/${id}`, { title, author }); // ส่งคำขอ PUT ไปยังเซิร์ฟเวอร์ backend เพื่อแก้ไขข้อมูลหนังสือ
        res.redirect("/books"); // หลังจากแก้ไขข้อมูลเสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการหนังสือ
        console.log("test");
        
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการแก้ไขหนังสือ:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการแก้ไขหนังสือ"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนด route สำหรับการลบหนังสือ
app.get("/books/:id/delete", async (req, res) => { // กำหนด route สำหรับการลบหนังสือ
    const { id } = req.params; // ดึงข้อมูล id ของหนังสือจากพารามิเตอร์ของ URL
    try {
        await axios.delete(`${backendURL}/books/${id}`); // ส่งคำขอ DELETE ไปยังเซิร์ฟเวอร์ backend เพื่อทำการลบหนังสือ
        res.redirect("/books"); // หลังจากลบหนังสือเสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการหนังสือ
    } catch (err) {
        res.status(500).send("เกิดข้อผิดพลาดในการลบหนังสือ"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// แสดงหน้าเพิ่มหนังสือใหม่
// กำหนด route สำหรับหน้าเพิ่มหนังสือใหม่
app.get("/books/add", (req, res) => { // กำหนด route สำหรับหน้าเพิ่มหนังสือ
    res.render("add-book"); // แสดงผลไฟล์ add-book.ejs เพื่อให้ผู้ใช้กรอกข้อมูลสำหรับเพิ่มหนังสือใหม่
});
// กำหนด route สำหรับการส่งข้อมูลหนังสือใหม่ที่กรอกในฟอร์ม add-book.ejs ไปยังเซิร์ฟเวอร์ backend เพื่อทำการเพิ่มหนังสือใหม่
app.post("/books", async (req, res) => { // กำหนด route สำหรับการส่งข้อมูลหนังสือใหม่ที่กรอกในฟอร์ม add-book.ejs
    const { title, author } = req.body; // ดึงข้อมูลชื่อหนังสือและผู้แต่งจากคำขอที่ส่งมาจากฟอร์มใน add-book.ejs
    try {
        await axios.post(`${backendURL}/books`, { title, author }); // ส่งคำขอ POST ไปยังเซิร์ฟเวอร์ backend เพื่อเพิ่มหนังสือใหม่   
        res.redirect("/books"); // หลังจากเพิ่มหนังสือเสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการหนังสือ
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มหนังสือ:", err);
        res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มหนังสือ มันซ้ำ!!!"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// user routes

// กำหนด route สำหรับการดึงข้อมูลผู้ใช้ทั้งหมด และแสดงผลในหน้า users.ejs
app.get("/users", async (req, res) => { // กำหนด route สำหรับหน้าแสดงรายการผู้ใช้
    try {
        const response = await axios.get(`${backendURL}/user`); // ส่งคำขอ GET ไปยังเซิร์ฟเวอร์ backend เพื่อดึงข้อมูลผู้ใช้ทั้งหมด
        const Users = response.data; // ดึงข้อมูลผู้ใช้จาก response ที่ได้รับจาก backend
        res.render("users", { Users }); // แสดงผลไฟล์ users.ejs พร้อมส่งข้อมูลผู้ใช้ไปยัง view
    } catch (err) {
        res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// เพิ่มบัญชีผู้ใช้ใหม่
// แสดงหน้าเพิ่มผู้ใช้ใหม่
app.get("/users/add", (req, res) => { // กำหนด route สำหรับหน้าเพิ่มผู้ใช้
    res.render("add-user"); // แสดงผลไฟล์ add-user.ejs เพื่อให้ผู้ใช้กรอกข้อมูลสำหรับเพิ่มบัญชีผู้ใช้ใหม่
});
// กำหนด route สำหรับการส่งข้อมูลผู้ใช้ใหม่ที่กรอกในฟอร์ม add-user.ejs ไปยังเซิร์ฟเวอร์ backend เพื่อทำการเพิ่มบัญชีผู้ใช้ใหม่
app.post("/users", async (req, res) => { // กำหนด route สำหรับการส่งข้อมูลผู้ใช้ใหม่ที่กรอกในฟอร์ม add-user.ejs
    const { name, email } = req.body; // ดึงข้อมูลชื่อและอีเมลจากคำขอที่ส่งมาจากฟอร์มใน add-user.ejs
    try {
        await axios.post(`${backendURL}/user`, { name, email }); // ส่งคำขอ POST ไปยังเซิร์ฟเวอร์ backend เพื่อเพิ่มบัญชีผู้ใช้ใหม่
        res.redirect("/users"); // หลังจากเพิ่มบัญชีผู้ใช้เสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการผู้ใช้
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:", err);
        res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ มันซ้ำ!!!"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

app.get("/users/:id/delete", async (req, res) => { // กำหนด route สำหรับการลบผู้ใช้
    const { id } = req.params; // ดึงข้อมูล id ของผู้ใช้จากพารามิเตอร์ของ URL
    try {
        await axios.delete(`${backendURL}/user/${id}`); // ส่งคำขอ DELETE ไปยังเซิร์ฟเวอร์ backend เพื่อทำการลบผู้ใช้
        res.redirect("/users"); // หลังจากลบผู้ใช้เสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการผู้ใช้
    } catch (err) {
        res.status(500).send("เกิดข้อผิดพลาดในการลบผู้ใช้"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// แสดงหน้าแก้ไขข้อมูลผู้ใช้
app.get("/users/:id/edit", async (req, res) => { // กำหนด route สำหรับการส่งข้อมูลที่แก้ไขแล้วของผู้ใช้
    const { id } = req.params;
    try {
        const response = await axios.get(`${backendURL}/user/${id}`); // ส่งคำขอ GET ไปยังเซิร์ฟเวอร์ backend เพื่อดึงข้อมูลผู้ใช้ตาม id
        const user = response.data; // ดึงข้อมูลผู้ใช้จาก response ที่ได้รับจาก backend
        res.render("edit-user", { user }); // แสดงผลไฟล์ edit-user.ejs พร้อมส่งข้อมูลผู้ใช้ไปยัง view
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// แสดงหน้าแก้ไขข้อมูลผู้ใช้ หลังกดปุ่ม Save Changes ใน edit-user.ejs
app.post("/users/:id/edit", async (req, res) => { // กำหนด route สำหรับการส่งข้อมูลที่แก้ไขแล้วของผู้ใช้ ไปยังเซิร์ฟเวอร์ backend เพื่อทำการอัปเดตข้อมูลผู้ใช้
    const { id } = req.params;
    const { name, email } = req.body; // ดึงข้อมูลชื่อและอีเมลจากคำขอที่ส่งมาจากฟอร์มใน edit-user.ejs
    try {
        await axios.put(`${backendURL}/user/${id}`, { name, email }); // ส่งคำขอ PUT ไปยังเซิร์ฟเวอร์ backend เพื่อแก้ไขข้อมูลผู้ใช้
        res.redirect("/users"); // หลังจากแก้ไขข้อมูลเสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการผู้ใช้
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้:", error);
        res.status(500).send("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});


// borrowing table 

app.get("/borrow", async (req, res) => { // กำหนด route สำหรับหน้าแสดงรายการหนังสือที่ถูกยืม
    try {
        const response = await axios.get(`${backendURL}/borrow`); // ส่งคำขอ GET ไปยังเซิร์ฟเวอร์ backend เพื่อดึงข้อมูลหนังสือที่ถูกยืมทั้งหมด
        const borrowed = response.data; // ดึงข้อมูลหนังสือที่ถูกยืมจาก response ที่ได้รับจาก backend
        res.render("borrowed", { borrowed }); // แสดงผลไฟล์ borrowed.ejs พร้อมส่งข้อมูลหนังสือที่ถูกยืมไปยัง view
    } catch (err) {
        res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือที่ถูกยืม"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }   
});

// add borrow

app.get("/borrow/add", async (req, res) => { // กำหนด route สำหรับหน้าเพิ่มผู้ใช้
     const User = await axios.get(`${backendURL}/user`); 
     const Book = await axios.get(`${backendURL}/books`); 
     const User_data = User.data;
     const Book_data = Book.data;
     res.render("add-borrow", {User_data, Book_data})
});

app.post("/borrow", async (req, res) => { // กำหนด route สำหรับการส่งข้อมูลผู้ใช้ใหม่ที่กรอกในฟอร์ม add-user.ejs
    const { user_id, book_id } = req.body; // ดึงข้อมูลชื่อและอีเมลจากคำขอที่ส่งมาจากฟอร์มใน add-user.ejs
    try {
        await axios.post(`${backendURL}/borrow/add`, { user_id, book_id }); // ส่งคำขอ POST ไปยังเซิร์ฟเวอร์ backend เพื่อเพิ่มรายการยืม
        res.redirect("/borrow"); // หลังจากเพิ่มรายการยืมเสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการยืม
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:", err);
        res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มรายการยืม: " + err.response.data.error); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

 


// กำหนด route สำหรับการส่งข้อมูลผู้ใช้ใหม่ที่กรอกในฟอร์ม add-user.ejs ไปยังเซิร์ฟเวอร์ backend เพื่อทำการเพิ่มบัญชีผู้ใช้ใหม่
app.post("/users", async (req, res) => { // กำหนด route สำหรับการส่งข้อมูลผู้ใช้ใหม่ที่กรอกในฟอร์ม add-user.ejs
    const { name, email } = req.body; // ดึงข้อมูลชื่อและอีเมลจากคำขอที่ส่งมาจากฟอร์มใน add-user.ejs
    try {
        await axios.post(`${backendURL}/user`, { name, email }); // ส่งคำขอ POST ไปยังเซิร์ฟเวอร์ backend เพื่อเพิ่มบัญชีผู้ใช้ใหม่
        res.redirect("/users"); // หลังจากเพิ่มบัญชีผู้ใช้เสร็จแล้วให้เปลี่ยนเส้นทางกลับไปยังหน้าแสดงรายการผู้ใช้
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:", err);
        res.status(500).send("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ มันซ้ำ!!!"); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// ลบรายการยืมหนังสือ
app.get("/borrow/:id/delete", async (req, res) => { // กำหนด route สำหรับการคืนหนังสือ
    const { id } = req.params;
    try {
        await axios.delete(`${backendURL}/borrow/${id}`);
        res.redirect("/borrow");
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการลบรายการยืม:", err);
        res.status(500).send("เกิดข้อผิดพลาดในการลบรายการยืม");
    }
});

app.get("/borrow/:id/return", async (req, res) => { // กำหนด route สำหรับการคืนหนังสือ
    const { id } = req.params;
    try {
        await axios.put(`${backendURL}/borrow/${id}/return`);
        res.redirect("/borrow");
    } catch (err) {
        console.error("เกิดข้อผิดพลาดในการคืนหนังสือ:", err);
        res.status(500).send("เกิดข้อผิดพลาดในการคืนหนังสือ: " + err);
    }
});

app.listen(7000, () => { // เริ่มต้นเซิร์ฟเวอร์และฟังที่พอร์ต 7000
    console.log("เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:7000"); // แสดงข้อความในคอนโซลเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});