const express = require("express"); // นำเข้า Express.js เพื่อสร้างเซิร์ฟเวอร์และจัดการเส้นทาง
const Sequelize = require("sequelize"); // นำเข้า Sequelize เพื่อเชื่อมต่อและจัดการฐานข้อมูล SQLite
const data = require("./seed").seedData; // นำเข้าไฟล์ seed.js เพื่อใช้ข้อมูลเริ่มต้นในการเติมฐานข้อมูล

const app = express(); // สร้างแอปพลิเคชัน Express

app.use(express.json()); // ใช้ middleware เพื่อแปลงข้อมูล JSON ที่ส่งมาจาก client ให้เป็น JavaScript object

const sequelize = new Sequelize("database", "username", "password", { 
  host: "localhost",
  dialect: "sqlite",
  storage: "./database/database.sqlite",
}); // สร้างการเชื่อมต่อกับฐานข้อมูล SQLite โดยระบุชื่อฐานข้อมูล, ชื่อผู้ใช้, รหัสผ่าน, โฮสต์ และประเภทของฐานข้อมูล

const bookTable = sequelize.define("book", { // สร้างโมเดลสำหรับตารางหนังสือในฐานข้อมูล โดยกำหนดชื่อโมเดลเป็น "book" และระบุโครงสร้างของตาราง
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true, // กำหนดให้ฟิลด์ id เป็นแบบ auto-increment เพื่อให้ค่าของ id เพิ่มขึ้นโดยอัตโนมัติเมื่อมีการเพิ่มหนังสือใหม่
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false, // กำหนดให้ฟิลด์ title เป็นแบบไม่อนุญาตให้เป็นค่าว่าง (NOT NULL) เพื่อให้แน่ใจว่าทุกหนังสือจะต้องมีชื่อเรื่อง
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const userTable = sequelize.define("user", { // สร้างโมเดลสำหรับตารางผู้ใช้ในฐานข้อมูล โดยกำหนดชื่อโมเดลเป็น "user" และระบุโครงสร้างของตาราง
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true, // กำหนดให้ฟิลด์ email เป็นแบบไม่อนุญาตให้มีค่าซ้ำกัน (UNIQUE) เพื่อป้องกันการลงทะเบียนผู้ใช้ที่มีอีเมลเดียวกัน
  },
});

const BorrowingTable = sequelize.define("borrowing", { // สร้างโมเดลสำหรับตารางการยืมหนังสือในฐานข้อมูล โดยกำหนดชื่อโมเดลเป็น "borrowing" และระบุโครงสร้างของตาราง
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  bookId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  borrowDate: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  returnDate: {
    type: Sequelize.DATE,
    allowNull: true, // กำหนดให้ฟิลด์ returnDate เป็นแบบอนุญาตให้เป็นค่าว่าง (NULL) เพื่อให้สามารถเก็บข้อมูลการยืมที่ยังไม่ถูกคืนได้
  },
});

userTable.hasMany(BorrowingTable, { foreignKey: "userId" }); // กำหนดความสัมพันธ์ระหว่างตารางผู้ใช้และตารางการยืม โดยระบุว่าแต่ละผู้ใช้สามารถมีการยืมหลายรายการได้ และใช้ userId เป็นคีย์ต่างประเทศในการเชื่อมโยง
BorrowingTable.belongsTo(userTable, { foreignKey: "userId" }); // กำหนดความสัมพันธ์ระหว่างตารางการยืมและตารางผู้ใช้ โดยระบุว่าแต่ละรายการการยืมจะเป็นของผู้ใช้หนึ่งคน และใช้ userId เป็นคีย์ต่างประเทศในการเชื่อมโยง

bookTable.hasMany(BorrowingTable, { foreignKey: "bookId" }); // กำหนดความสัมพันธ์ระหว่างตารางหนังสือและตารางการยืม โดยระบุว่าแต่ละหนังสือสามารถมีการยืมหลายรายการได้ และใช้ bookId เป็นคีย์ต่างประเทศในการเชื่อมโยง
BorrowingTable.belongsTo(bookTable, { foreignKey: "bookId" }); // กำหนดความสัมพันธ์ระหว่างตารางการยืมและตารางหนังสือ โดยระบุว่าแต่ละรายการการยืมจะเป็นของหนังสือหนึ่งเล่ม และใช้ bookId เป็นคีย์ต่างประเทศในการเชื่อมโยง

async function seedDatabase() { // ฟังก์ชันสำหรับเติมข้อมูลเริ่มต้นลงในฐานข้อมูล โดยจะตรวจสอบก่อนว่ามีข้อมูลอยู่แล้วหรือไม่ หากมีข้อมูลอยู่แล้วจะไม่ทำการเติมข้อมูลซ้ำ
  if (
    (await bookTable.count()) > 0 ||
    (await userTable.count()) > 0 ||
    (await BorrowingTable.count()) > 0
  ) {
    console.log("Database already seeded");
    return;
  }
  await bookTable.bulkCreate(data.book); // ใช้เมธอด bulkCreate ของ Sequelize เพื่อเติมข้อมูลหนังสือลงในตาราง book โดยใช้ข้อมูลจากไฟล์ seed.js
  await userTable.bulkCreate(data.user); // ใช้เมธอด bulkCreate ของ Sequelize เพื่อเติมข้อมูลผู้ใช้ลงในตาราง user โดยใช้ข้อมูลจากไฟล์ seed.js
  await BorrowingTable.bulkCreate(data.borrowing); // ใช้เมธอด bulkCreate ของ Sequelize เพื่อเติมข้อมูลการยืมลงในตาราง borrowing โดยใช้ข้อมูลจากไฟล์ seed.js
}

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    return seedDatabase();
  })
  .catch((error) => {
    console.error("Error creating database:", error);
  }); // ใช้เมธอด sync ของ Sequelize เพื่อสร้างฐานข้อมูลและตารางตามโมเดลที่กำหนดไว้ จากนั้นเรียกใช้ฟังก์ชัน seedDatabase เพื่อเติมข้อมูลเริ่มต้นลงในฐานข้อมูล

app.get("/books", async (req, res) => { // กำหนดเส้นทาง GET /books เพื่อดึงข้อมูลหนังสือทั้งหมดจากฐานข้อมูลและส่งกลับเป็น JSON โดยใช้เมธอด findAll ของ Sequelize และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const books = await bookTable.findAll();
    res.json(books);
  } catch (error) {
    res
      .status(500) // ส่งสถานะ 500 เพื่อบ่งบอกว่ามีข้อผิดพลาดเกิดขึ้นในเซิร์ฟเวอร์
      .json({ error: "Failed to fetch books", details: error.message });
  }
});

app.post("/books", async (req, res) => { // กำหนดเส้นทาง POST /books เพื่อสร้างหนังสือใหม่ในฐานข้อมูล โดยใช้เมธอด create ของ Sequelize และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { title, author } = req.body;
    const newBook = await bookTable.create({ title, author });
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create book", details: error.message });
  }
});

app.put("/books/:id", async (req, res) => { // กำหนดเส้นทาง PUT /books/:id เพื่ออัปเดตข้อมูลหนังสือที่มี id ตรงกับพารามิเตอร์ใน URL โดยใช้เมธอด findByPk เพื่อค้นหาหนังสือและเมธอด save เพื่อบันทึกการเปลี่ยนแปลง และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { id } = req.params; // ดึงค่า id จากพารามิเตอร์ใน URL เพื่อใช้ในการค้นหาหนังสือที่ต้องการอัปเดต
    const { title, author } = req.body; // ดึงค่า title และ author จากข้อมูลที่ส่งมาจาก client เพื่อใช้ในการอัปเดตข้อมูลหนังสือ
    const book = await bookTable.findByPk(id); // ใช้เมธอด findByPk ของ Sequelize เพื่อค้นหาหนังสือที่มี id ตรงกับค่าที่ดึงมาจากพารามิเตอร์ใน URL
    if (book) {
      book.title = title;
      book.author = author;
      await book.save(); // ใช้เมธอด save ของ Sequelize เพื่อบันทึกการเปลี่ยนแปลงข้อมูลหนังสือที่ถูกอัปเดตลงในฐานข้อมูล
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update book", details: error.message });
  }
});

app.delete("/books/:id", async (req, res) => { // กำหนดเส้นทาง DELETE /books/:id เพื่อลบหนังสือที่มี id ตรงกับพารามิเตอร์ใน URL โดยใช้เมธอด findByPk เพื่อค้นหาหนังสือและเมธอด destroy เพื่อทำการลบ และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { id } = req.params; // ดึงค่า id จากพารามิเตอร์ใน URL เพื่อใช้ในการค้นหาหนังสือที่ต้องการลบ
    const book = await bookTable.findByPk(id); // ใช้เมธอด findByPk ของ Sequelize เพื่อค้นหาหนังสือที่มี id ตรงกับค่าที่ดึงมาจากพารามิเตอร์ใน URL
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const borrowings = await BorrowingTable.findAll({ where: { bookId: id } }); // ใช้เมธอด findAll ของ Sequelize เพื่อค้นหารายการการยืมหนังสือที่เกี่ยวข้องกับหนังสือที่ต้องการลบ โดยระบุเงื่อนไขในการค้นหาด้วย bookId ที่ตรงกับ id ของหนังสือ
    for (const borrowing of borrowings) {
      await borrowing.destroy(); // ใช้เมธอด destroy ของ Sequelize เพื่อทำการลบรายการการยืมหนังสือที่เกี่ยวข้องกับหนังสือที่ต้องการลบออกจากฐานข้อมูล
      // การลบรายการการยืมหนังสือที่เกี่ยวข้องกับหนังสือที่ต้องการลบออกจากฐานข้อมูล
      // กันปัญหาการดึงข้อมูลที่ไม่ถูกต้องในกรณีที่มีการลบหนังสือที่ยังมีรายการการยืมหนังสืออยู่
    }
    await book.destroy(); // ใช้เมธอด destroy ของ Sequelize เพื่อทำการลบหนังสือที่ถูกค้นพบออกจากฐานข้อมูล
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete book", details: error.message });
  }
});

app.get("/users", async (req, res) => { // กำหนดเส้นทาง GET /users เพื่อดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูลและส่งกลับเป็น JSON โดยใช้เมธอด findAll ของ Sequelize และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const users = await userTable.findAll();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: error.message });
  }
});

app.get("/borrowings", async (req, res) => { // กำหนดเส้นทาง GET /borrowings เพื่อดึงข้อมูลการยืมหนังสือทั้งหมดจากฐานข้อมูล โดยใช้เมธอด findAll ของ Sequelize พร้อมกับ include เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางผู้ใช้และตารางหนังสือ และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const borrowings = await BorrowingTable.findAll({ // ใช้เมธอด findAll ของ Sequelize เพื่อดึงข้อมูลการยืมหนังสือทั้งหมดจากฐานข้อมูล
      include: [ // ใช้ include เพื่อดึงข้อมูลที่เกี่ยวข้องจากตารางผู้ใช้และตารางหนังสือ โดยระบุโมเดลและฟิลด์ที่ต้องการดึงข้อมูล
        {
          model: userTable, // ระบุโมเดล userTable เพื่อดึงข้อมูลผู้ใช้ที่เกี่ยวข้องกับการยืมหนังสือ
          attributes: ["id", "name", "email"], // ระบุฟิลด์ที่ต้องการดึงข้อมูลจากตารางผู้ใช้ ได้แก่ id, name และ email
        },
        {
          model: bookTable,
          attributes: ["id", "title", "author"],
        },
      ],
      order: [["id", "ASC"]], // ใช้ order เพื่อจัดเรียงข้อมูลการยืมหนังสือตาม id ในลำดับจากน้อยไปมาก (ASC) เพื่อให้แสดงผลในลำดับที่ถูกต้องตามการสร้างรายการการยืมหนังสือ
    });
    res.json(borrowings);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch borrowings", details: error.message });
  }
});

app.post("/users", async (req, res) => { // กำหนดเส้นทาง POST /users เพื่อสร้างผู้ใช้ใหม่ในฐานข้อมูล โดยใช้เมธอด create ของ Sequelize และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { name, email } = req.body;
    const newUser = await userTable.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
});

app.put("/users/:id", async (req, res) => { // กำหนดเส้นทาง PUT /users/:id เพื่ออัปเดตข้อมูลผู้ใช้ที่มี id ตรงกับพารามิเตอร์ใน URL โดยใช้เมธอด findByPk เพื่อค้นหาผู้ใช้และเมธอด save เพื่อบันทึกการเปลี่ยนแปลง และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await userTable.findByPk(id);
    if (user) {
      user.name = name;
      user.email = email;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
});

app.delete("/users/:id", async (req, res) => { // กำหนดเส้นทาง DELETE /users/:id เพื่อลบผู้ใช้ที่มี id ตรงกับพารามิเตอร์ใน URL โดยใช้เมธอด findByPk เพื่อค้นหาผู้ใช้และเมธอด destroy เพื่อลบผู้ใช้ออกจากฐานข้อมูล และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { id } = req.params;
    const user = await userTable.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const borrowings = await BorrowingTable.findAll({ where: { userId: id } }); // ใช้เมธอด findAll ของ Sequelize เพื่อค้นหารายการการยืมหนังสือที่เกี่ยวข้องกับผู้ใช้ที่ต้องการลบ โดยระบุเงื่อนไขในการค้นหาด้วย userId ที่ตรงกับ id ของผู้ใช้
    for (const borrowing of borrowings) {
      await borrowing.destroy(); // ใช้เมธอด destroy ของ Sequelize เพื่อทำการลบรายการการยืมหนังสือที่เกี่ยวข้องกับผู้ใช้ที่ต้องการลบออกจากฐานข้อมูล
      // การลบรายการการยืมหนังสือที่เกี่ยวข้องกับผู้ใช้ที่ต้องการลบออกจากฐานข้อมูล
      // กันปัญหาการดึงข้อมูลที่ไม่ถูกต้องในกรณีที่มีการลบผู้ใช้ที่ยังมีรายการการยืมหนังสืออยู่
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: error.message });
  }
});

app.delete("/borrowings/:id", async (req, res) => { // กำหนดเส้นทาง DELETE /borrowings/:id เพื่อลบรายการการยืมหนังสือที่มี id ตรงกับพารามิเตอร์ใน URL โดยใช้เมธอด findByPk เพื่อค้นหารายการการยืมหนังสือและเมธอด destroy เพื่อลบออกจากฐานข้อมูล และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { id } = req.params;
    const borrowing = await BorrowingTable.findByPk(id);
    if (!borrowing) {
      return res.status(404).json({ error: "Borrowing record not found" });
    }
    await borrowing.destroy();
    res.json({ message: "Borrowing record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to delete borrowing record",
        details: error.message,
      });
  }
});

app.post("/borrow", async (req, res) => { // กำหนดเส้นทาง POST /borrow เพื่อสร้างรายการการยืมหนังสือใหม่ในฐานข้อมูล โดยใช้เมธอด create ของ Sequelize และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { userId, bookId } = req.body;
    const user = await userTable.findByPk(userId);
    const book = await bookTable.findByPk(bookId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const borrowing = await BorrowingTable.create({ userId, bookId });
    res.status(201).json(borrowing);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to borrow book", details: error.message });
  }
});

app.post("/return", async (req, res) => { // กำหนดเส้นทาง POST /return เพื่อสร้างรายการการคืนหนังสือใหม่ในฐานข้อมูล โดยใช้เมธอด findOne ของ Sequelize เพื่อค้นหารายการการยืมหนังสือที่ยังไม่ได้คืน และเมธอด save เพื่อบันทึกการเปลี่ยนแปลง และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { userId, bookId } = req.body;
    const borrowing = await BorrowingTable.findOne({
      where: { userId, bookId, returnDate: null },
    });
    if (!borrowing) {
      return res.status(404).json({ error: "Borrowing record not found" });
    }
    borrowing.returnDate = new Date();
    await borrowing.save();
    res.json(borrowing);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to return book", details: error.message });
  }
});

app.post("/return/:id", async (req, res) => { // กำหนดเส้นทาง POST /return/:id เพื่อสร้างรายการการคืนหนังสือใหม่ในฐานข้อมูล โดยใช้เมธอด findByPk เพื่อค้นหารายการการยืมหนังสือและเมธอด save เพื่อบันทึกการเปลี่ยนแปลง และจัดการข้อผิดพลาดที่อาจเกิดขึ้นด้วยการส่งสถานะ 500 และข้อความแสดงข้อผิดพลาดในรูปแบบ JSON
  try {
    const { id } = req.params;
    const borrowing = await BorrowingTable.findByPk(id);
    if (!borrowing) {
      return res.status(404).json({ error: "Borrowing record not found" });
    }
    borrowing.returnDate = new Date(); // กำหนดค่า returnDate เป็นวันที่ปัจจุบันเพื่อบันทึกการคืนหนังสือ
    await borrowing.save();
    res.json(borrowing);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to return book", details: error.message });
  }
});

app.listen(5000, () => { // เริ่มต้นเซิร์ฟเวอร์และฟังคำขอบนพอร์ต 5000 และแสดงข้อความในคอนโซลเมื่อเซิร์ฟเวอร์เริ่มทำงาน
  console.log("Server is running on port 5000 (http://localhost:5000)");
});
