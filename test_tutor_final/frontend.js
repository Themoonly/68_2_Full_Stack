const express = require("express"); // นำเข้าโมดูล Express ซึ่งเป็นเฟรมเวิร์กสำหรับสร้างเว็บแอปพลิเคชันใน Node.js

const app = express(); // สร้างอินสแตนซ์ของแอปพลิเคชัน Express เพื่อใช้ในการกำหนดเส้นทางและการจัดการคำขอ HTTP
const FRONTEND_PORT = 7000; // กำหนดพอร์ตของ frontend
const BACKEND_BASE_URL = "http://localhost:5000"; // กำหนด URL ของ backend

app.set("view engine", "ejs"); // กำหนดให้ใช้ EJS เป็นเทมเพลตเอนจินสำหรับการเรนเดอร์หน้า HTML โดยสามารถใช้ไฟล์ .ejs ในโฟลเดอร์ views เพื่อสร้างหน้าเว็บที่มีข้อมูลไดนามิกได้

app.use(express.urlencoded({ extended: true })); // ใช้ middleware express.urlencoded เพื่อแปลงข้อมูลที่ส่งมาจากฟอร์มในรูปแบบ URL-encoded ให้เป็นวัตถุ JavaScript ที่สามารถเข้าถึงได้ผ่าน req.body ในการจัดการคำขอ POST ที่มีข้อมูลจากฟอร์ม
app.use(express.json()); // ใช้ middleware express.json เพื่อแปลงข้อมูลที่ส่งมาจากคำขอในรูปแบบ JSON ให้เป็นวัตถุ JavaScript ที่สามารถเข้าถึงได้ผ่าน req.body ในการจัดการคำขอ POST ที่มีข้อมูลในรูปแบบ JSON

async function fetchJson(url, options) { // ฟังก์ชันช่วยเหลือสำหรับการทำคำขอ HTTP ไปยัง backend โดยใช้ fetch API และจัดการการตอบกลับในรูปแบบ JSON รวมถึงการจัดการข้อผิดพลาดที่อาจเกิดขึ้น
  const response = await fetch(url, options); // ใช้ fetch API เพื่อทำคำขอ HTTP ไปยัง URL ที่กำหนดพร้อมกับตัวเลือกที่ระบุ (เช่น method, headers, body) และรอการตอบกลับจากเซิร์ฟเวอร์
  const contentType = response.headers.get("content-type") || ""; // ดึงค่า content-type จากส่วนหัวของการตอบกลับเพื่อใช้ในการตรวจสอบรูปแบบของข้อมูลที่ได้รับจาก backend
  const payload = contentType.includes("application/json") // ตรวจสอบว่า content-type ของการตอบกลับเป็น JSON หรือไม่ โดยใช้ includes เพื่อค้นหาคำว่า "application/json" ในค่า content-type และถ้าใช่ก็แปลงข้อมูลที่ได้รับเป็นวัตถุ JavaScript ด้วย response.json()
    ? await response.json()
    : { error: "Unexpected response from backend" }; // ถ้า content-type ไม่ใช่ JSON ให้สร้างวัตถุ payload ที่มีคุณสมบัติ error เพื่อแสดงข้อความแสดงข้อผิดพลาดที่ไม่คาดคิดจาก backend

  if (!response.ok) { // ตรวจสอบสถานะของการตอบกลับโดยใช้ response.ok ซึ่งจะเป็น true ถ้าสถานะของการตอบกลับอยู่ในช่วง 200-299 และถ้าไม่ใช่ให้โยนข้อผิดพลาดที่มีข้อความจาก payload.details หรือ payload.error หรือข้อความแสดงข้อผิดพลาดทั่วไป "Request failed"
    throw new Error(payload.details || payload.error || "Request failed"); // การโยนข้อผิดพลาดนี้จะทำให้การจัดการข้อผิดพลาดในส่วนที่เรียกใช้ฟังก์ชัน fetchJson สามารถจับข้อผิดพลาดนี้และแสดงข้อความที่เหมาะสมให้กับผู้ใช้ได้
  }

  return payload;
}

app.get("/", async (req, res) => { // กำหนดเส้นทาง GET / ซึ่งเป็นหน้าแรกของแอปพลิเคชัน โดยเมื่อมีการเข้าถึงเส้นทางนี้จะทำการเปลี่ยนเส้นทางไปยัง /books
  res.redirect("/books"); // ใช้ res.redirect เพื่อเปลี่ยนเส้นทางไปยัง /books ซึ่งเป็นหน้าที่แสดงรายการหนังสือทั้งหมดในระบบ
});

app.get("/books", async (req, res) => { // กำหนดเส้นทาง GET /books ซึ่งเป็นหน้าที่แสดงรายการหนังสือทั้งหมดในระบบ 
  try {
    const books = await fetchJson(`${BACKEND_BASE_URL}/books`); // ใช้ฟังก์ชัน fetchJson เพื่อทำคำขอ GET ไปยัง backend ที่ URL /books เพื่อดึงข้อมูลหนังสือทั้งหมดจากฐานข้อมูล และรอการตอบกลับจาก backend
    res.render("books", { // ใช้ res.render เพื่อเรนเดอร์หน้า books.ejs และส่งข้อมูลหนังสือที่ได้รับจาก backend ไปยังเทมเพลตเพื่อแสดงผลในหน้าเว็บ
      books,
      error: req.query.error || "",
      message: req.query.message || "",
    });
  } catch (error) {
    res.status(500).render("books", { // ถ้าเกิดข้อผิดพลาดในการดึงข้อมูลจาก backend ให้ส่งสถานะ 500 และเรนเดอร์หน้า books.ejs พร้อมกับส่งข้อมูลหนังสือเป็นอาร์เรย์ว่างและข้อความแสดงข้อผิดพลาดที่ได้รับจาก error.message ไปยังเทมเพลตเพื่อแสดงผลในหน้าเว็บ
      books: [],
      error: error.message,
      message: "",
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await fetchJson(`${BACKEND_BASE_URL}/users`);
    res.render("users", {
      users,
      error: req.query.error || "",
      message: req.query.message || "",
    });
  } catch (error) {
    res.status(500).render("users", {
      users: [],
      error: error.message,
      message: "",
    });
  }
});

app.get("/borrowings", async (req, res) => {
  try {
    const [borrowings, books, users] = await Promise.all([ // ใช้ Promise.all เพื่อทำคำขอ GET ไปยัง backend
    //  พร้อมกันสำหรับเส้นทาง /borrowings, /books, และ /users 
    // เพื่อดึงข้อมูลการยืมหนังสือ, หนังสือทั้งหมด, และผู้ใช้ทั้งหมดในครั้งเดียว
      fetchJson(`${BACKEND_BASE_URL}/borrowings`),
      fetchJson(`${BACKEND_BASE_URL}/books`),
      fetchJson(`${BACKEND_BASE_URL}/users`),
    ]);
    console.log("user: ", users);
    console.log("Borrowing : ", borrowings);
    
    
    res.render("borrowings", { // ใช้ res.render เพื่อเรนเดอร์หน้า borrowings.ejs 
    // และส่งข้อมูลการยืมหนังสือ, หนังสือทั้งหมด, และผู้ใช้ทั้งหมดที่ได้รับจาก backend ไปยังเทมเพลตเพื่อแสดงผลในหน้าเว็บ
      borrowings,
      books,
      users,
      error: req.query.error || "",
      message: req.query.message || "",
    });
  } catch (error) {
    res.status(500).render("borrowings", {
      borrowings: [],
      books: [],
      users: [],
      error: error.message,
      message: "",
    });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    await fetchJson(`${BACKEND_BASE_URL}/books`, {
      method: "POST", // ใช้เมธอด POST เพื่อส่งข้อมูลหนังสือใหม่ไปยัง backend ที่ URL /books
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author }), // แปลงข้อมูลหนังสือใหม่ที่ได้รับจากฟอร์มใน req.body เป็น JSON และส่งไปในส่วน body ของคำขอ
    });
    res.redirect(
      "/books?message=" + encodeURIComponent("Book added successfully"), // หลังจากที่หนังสือใหม่ถูกเพิ่มลงในฐานข้อมูลสำเร็จ ให้เปลี่ยนเส้นทางกลับไปยัง /books พร้อมกับส่งข้อความแสดงความสำเร็จผ่าน query parameter เพื่อให้แสดงข้อความในหน้าเว็บ
    );
  } catch (error) {
    res.redirect("/books?error=" + encodeURIComponent(error.message));
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    await fetchJson(`${BACKEND_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    res.redirect(
      "/users?message=" + encodeURIComponent("User added successfully"),
    );
  } catch (error) {
    res.redirect("/users?error=" + encodeURIComponent(error.message));
  }
});

app.post("/books/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;
    await fetchJson(`${BACKEND_BASE_URL}/books/${id}`, {
      method: "PUT", // ใช้เมธอด PUT เพื่อส่งข้อมูลหนังสือที่แก้ไขไปยัง backend ที่ URL /books/:id โดยระบุ id ของหนังสือที่ต้องการแก้ไขในเส้นทาง
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author }),
    });
    res.redirect(
      "/books?message=" + encodeURIComponent("Book updated successfully"),
    );
  } catch (error) {
    res.redirect("/books?error=" + encodeURIComponent(error.message));
  }
});

app.post("/books/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await fetchJson(`${BACKEND_BASE_URL}/books/${id}`, {
      method: "DELETE",
    });
    res.redirect(
      "/books?message=" + encodeURIComponent("Book deleted successfully"),
    );
  } catch (error) {
    res.redirect("/books?error=" + encodeURIComponent(error.message));
  }
});

app.post("/users/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await fetchJson(`${BACKEND_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    res.redirect(
      "/users?message=" + encodeURIComponent("User updated successfully"),
    );
  } catch (error) {
    res.redirect("/users?error=" + encodeURIComponent(error.message));
  }
});

app.post("/users/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await fetchJson(`${BACKEND_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    res.redirect(
      "/users?message=" + encodeURIComponent("User deleted successfully"),
    );
  } catch (error) {
    res.redirect("/users?error=" + encodeURIComponent(error.message));
  }
});

app.post("/borrow", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    await fetchJson(`${BACKEND_BASE_URL}/borrow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(userId), bookId: Number(bookId) }),
    });
    res.redirect(
      "/borrowings?message=" + encodeURIComponent("Book borrowed successfully"),
    );
  } catch (error) {
    res.redirect("/borrowings?error=" + encodeURIComponent(error.message));
  }
});

app.post("/return", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    await fetchJson(`${BACKEND_BASE_URL}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: Number(userId), bookId: Number(bookId) }),
    });
    res.redirect(
      "/borrowings?message=" + encodeURIComponent("Book returned successfully"),
    );
  } catch (error) {
    res.redirect("/borrowings?error=" + encodeURIComponent(error.message));
  }
});

app.post("/borrowings/:id/return", async (req, res) => {
  try {
    const { id } = req.params;
    await fetchJson(`${BACKEND_BASE_URL}/return/${id}`, {
      method: "POST",
    });
    res.redirect(
      "/borrowings?message=" + encodeURIComponent("Book returned successfully"),
    );
  } catch (error) {
    res.redirect("/borrowings?error=" + encodeURIComponent(error.message));
  }
});

app.post("/borrowings/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await fetchJson(`${BACKEND_BASE_URL}/borrowings/${id}`, {
      method: "DELETE",
    });
    res.redirect(
      "/borrowings?message=" +
        encodeURIComponent("Borrowing record deleted successfully"),
    );
  } catch (error) {
    res.redirect("/borrowings?error=" + encodeURIComponent(error.message));
  }
});

app.listen(FRONTEND_PORT, () => {
  console.log(
    `Frontend is running on port ${FRONTEND_PORT} (http://localhost:${FRONTEND_PORT})`,
  );
});
