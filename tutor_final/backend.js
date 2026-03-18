const express = require("express"); // นำเข้าโมดูล Express เพื่อสร้างเซิร์ฟเวอร์
const Sequelize = require("sequelize"); // นำเข้าโมดูล Sequelize เพื่อจัดการฐานข้อมูล
const dataJs = require("./seed").seedData; // นำเข้าไฟล์ seed.js ที่มีข้อมูลเริ่มต้นสำหรับฐานข้อมูล
const dataJson = require("./seed.json"); // นำเข้าไฟล์ seed.json ที่มีข้อมูลเริ่มต้นสำหรับฐานข้อมูล

const app = express(); // สร้างแอปพลิเคชัน Express

// ดึงข้อมูลจากไฟล์ seed.js และ seed.json มาเก็บไว้ในตัวแปร data เพื่อใช้ในการเพิ่มข้อมูลเริ่มต้นลงในฐานข้อมูล
app.use(express.json()); // ใช้ middleware เพื่อแปลงข้อมูล JSON ที่ส่งมาจาก client ให้เป็น JavaScript object

const sequelize = new Sequelize("database", "username", "password", { // กำหนดการเชื่อมต่อฐานข้อมูล
  host: "localhost", // โฮสต์ของฐานข้อมูล
  dialect: "sqlite", // ใช้ SQLite เป็นฐานข้อมูล
  storage: "./database/SQBook.sqlite", // ที่เก็บไฟล์ฐานข้อมูล SQLite
});

const bookTable = sequelize.define("Book", { // สร้างโมเดลสำหรับตารางหนังสือ
    id: { // กำหนดคอลัมน์ id เป็น primary key และ auto increment
        type: Sequelize.INTEGER, // กำหนดชนิดข้อมูลเป็น INTEGER
        autoIncrement: true, // กำหนดให้ค่าในคอลัมน์นี้เพิ่มขึ้นอัตโนมัติ
        primaryKey: true, // กำหนดให้คอลัมน์นี้เป็น primary key
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

// สร้างโมเดลสำหรับตารางผู้ใช้
const userTable = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // กำหนดให้ค่าในคอลัมน์นี้ต้องไม่ซ้ำกัน
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

const borrowTable = sequelize.define("Borrow", { // สร้างโมเดลสำหรับตารางการยืมหนังสือ
    id: { // กำหนดคอลัมน์ id เป็น primary key และ auto increment
        type: Sequelize.INTEGER, // กำหนดชนิดข้อมูลเป็น INTEGER
        autoIncrement: true, // กำหนดให้ค่าในคอลัมน์นี้เพิ่มขึ้นอัตโนมัติ
        primaryKey: true, // กำหนดให้คอลัมน์นี้เป็น primary key
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false, // กำหนดให้คอลัมน์นี้ไม่สามารถเป็นค่า null ได้
    },
    bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    borrowDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    returnDate: {
        type: Sequelize.DATE,
        allowNull: true, // กำหนดให้คอลัมน์นี้สามารถเป็นค่า null ได้ (สำหรับกรณีที่ยังไม่คืนหนังสือ)
    },
});

userTable.hasMany(borrowTable, { foreignKey: "userId" }); // กำหนดความสัมพันธ์ระหว่าง User และ Borrow
borrowTable.belongsTo(userTable, { foreignKey: "userId" }); // กำหนดความสัมพันธ์ระหว่าง Borrow และ User

bookTable.hasMany(borrowTable, { foreignKey: "bookId" }); // กำหนดความสัมพันธ์ระหว่าง Book และ Borrow
borrowTable.belongsTo(bookTable, { foreignKey: "bookId" }); // กำหนดความสัมพันธ์ระหว่าง Borrow และ Book

function transformData(data) { // ฟังก์ชันสำหรับแปลงข้อมูลจากไฟล์ seed.json หรือ seed.js ให้เข้ากับโครงสร้างของฐานข้อมูล
    return {
        book: data.book.map((item) => ({
            id: item.id,
            title: item.title,
            author: item.author,
        })),
        user: data.user.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
        })),
        borrowing: data.borrowing.map((item) => ({
            id: item.id,
            userId: item.userId,
            bookId: item.bookId,
            borrowDate: item.borrowDate,
            returnDate: item.returnDate,
        })),
    };
}

function seedDatabase(data) {
    const newData = transformData(data); // แปลงข้อมูลให้เข้ากับโครงสร้างของฐานข้อมูล
    return Promise.all([
        bookTable.bulkCreate(newData.book), // เพิ่มข้อมูลหนังสือลงในตาราง Book
        userTable.bulkCreate(newData.user), // เพิ่มข้อมูลผู้ใช้ลงในตาราง User
        borrowTable.bulkCreate(newData.borrowing), // เพิ่มข้อมูลการยืมหนังสือลงในตาราง Borrow
    ]);
}

sequelize.sync().then(async () =>  { // สร้างตารางในฐานข้อมูล
    // add data from seed.json
    console.log("สร้างตารางฐานข้อมูลสำเร็จ!"); // แสดงข้อความเมื่อสร้างตารางสำเร็จ

    const bookCount = await bookTable.count();
    const userCount = await userTable.count();
    const borrowCount = await borrowTable.count();

    if (!bookCount && !userCount && !borrowCount) { 
        seedDatabase(dataJs).then(() => { // เริ่มต้นการเพิ่มข้อมูลจากไฟล์ seed.js ลงในฐานข้อมูล
            console.log("เพิ่มข้อมูลจาก seed.js สำเร็จ!"); // แสดงข้อความเมื่อเพิ่มข้อมูลจากไฟล์ seed.js สำเร็จ
        }).catch((error) => { // จัดการข้อผิดพลาดในการเพิ่มข้อมูลจากไฟล์ seed.js
            console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลจาก seed.js:", error); // แสดงข้อความเมื่อเกิดข้อผิดพลาดในการเพิ่มข้อมูลจากไฟล์ seed.js
        });

        // add data from seed.json  
        // seedDatabase(dataJson).then(() => { // เริ่มต้นการเพิ่มข้อมูลจากไฟล์ seed.json ลงในฐานข้อมูล
        //     console.log("เพิ่มข้อมูลจาก seed.json สำเร็จ!"); // แสดงข้อความเมื่อเพิ่มข้อมูลจากไฟล์ seed.json สำเร็จ
        // }).catch((error) => { // จัดการข้อผิดพลาดในการเพิ่มข้อมูลจากไฟล์ seed.json
        //     console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลจาก seed.json:", error); // แสดงข้อความเมื่อเกิดข้อผิดพลาดในการเพิ่มข้อมูลจากไฟล์ seed.json
        // });
    }

}).catch((error) => { // จัดการข้อผิดพลาดในการสร้างตาราง
  console.error("เกิดข้อผิดพลาดในการสร้างตารางฐานข้อมูล:", error); // แสดงข้อความเมื่อเกิดข้อผิดพลาดในการสร้างตาราง
});



// กำหนดเส้นทางสำหรับการเข้าถึงหน้าแรกของเว็บไซต์
app.get("/", (req, res) => { // กำหนดเส้นทางสำหรับการเข้าถึงหน้าแรกของเว็บไซต์
  res.send("ยินดีต้อนรับสู่ระบบจัดการห้องสมุด!"); // ส่งข้อความต้อนรับเมื่อเข้าถึงหน้าแรก
});

/// book routes

// กำหนดเส้นทางสำหรับการเข้าถึงข้อมูลหนังสือทั้งหมด
app.get("/books", async (req, res) => { 
    try {
        const books = await bookTable.findAll(); // ดึงข้อมูลหนังสือทั้งหมดจากฐานข้อมูล
        res.json(books); // ส่งข้อมูลหนังสือในรูปแบบ JSON กลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนดเส้นทางสำหรับการเข้าถึงข้อมูลหนังสือโดยใช้ id
app.get("/books/:id", async (req, res) => {
    try {
        const { id } = req.params; // ดึงข้อมูล id ของหนังสือจากพารามิเตอร์ของ URL
        const book = await bookTable.findByPk(id); // ดึงข้อมูลหนังสือที่มี id ตรงกับที่ระบุจากฐานข้อมูล
        if (!book) {
            return res.status(404).json({ error: "ไม่พบหนังสือที่ต้องการ" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบหนังสือ
        }
        res.json(book); // ส่งข้อมูลหนังสือในรูปแบบ JSON กลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนดเส้นทางสำหรับการเพิ่มหนังสือใหม่
app.post("/books", async (req, res) => {
    try {
        const { title, author } = req.body; // ดึงข้อมูลชื่อหนังสือและผู้แต่งจากคำขอ
        const newBook = await bookTable.create({ title, author }); // สร้างหนังสือใหม่ในฐานข้อมูล
        res.status(201).json(newBook); // ส่งข้อมูลหนังสือที่ถูกสร้างใหม่กลับไปยัง client พร้อมสถานะ 201 (Created)
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนดเส้นทางสำหรับการแก้ไขข้อมูลหนังสือ
app.put("/books/:id", async (req, res) => {
    try {
        const { id } = req.params; // ดึงข้อมูล id ของหนังสือจากพารามิเตอร์ของ URL
        const { title, author } = req.body; // ดึงข้อมูลชื่อหนังสือและผู้แต่งจากคำขอ
        const book = await bookTable.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: "ไม่พบหนังสือที่ต้องการแก้ไข" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบหนังสือ
        }
        book.title = title;
        book.author = author; 
        await book.save(); // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
        res.json(book); // ส่งข้อมูลหนังสือที่ถูกแก้ไขกลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการแก้ไขหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนดเส้นทางสำหรับการลบหนังสือ
app.delete("/books/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookTable.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: "ไม่พบหนังสือที่ต้องการลบ" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบหนังสือ
        }
        await book.destroy();
        res.json({ message: "ลบหนังสือสำเร็จ" }); // ส่งข้อความยืนยันการลบหนังสือกลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});


// user routes 

// กำหนด route สำหรับการดึงข้อมูลผู้ใช้ทั้งหมด และแสดงผลในหน้า users.ejs
app.get("/user", async (req, res) => {
    try {
        const Users = await userTable.findAll(); // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
        res.json(Users); // ส่งข้อมูลผู้ใช้ในรูปแบบ JSON กลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล User:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนด route สำหรับการเข้าถึงข้อมูลผู้ใช้โดยใช้ id
app.post("/user", async (req, res) => { // กำหนดเส้นทางสำหรับการเพิ่มผู้ใช้ใหม่
    try {
        const { name, email } = req.body; // ดึงข้อมูลชื่อหนังสือและผู้แต่งจากคำขอ
        const newUser = await userTable.create({ name, email }); // สร้างผู้ใช้ใหม่ในฐานข้อมูล
        res.status(201).json(newUser); // ส่งข้อมูลผู้ใช้ที่ถูกสร้างใหม่กลับไปยัง client พร้อมสถานะ 201 (Created)
    } catch (error) {
        // console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนด route สำหรับการเข้าถึงข้อมูลผู้ใช้โดยใช้ id
app.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params; // ดึงข้อมูล id ของผู้ใช้จากพารามิเตอร์ของ URL
        const user = await userTable.findByPk(id); // ดึงข้อมูลผู้ใช้ที่มี id ตรงกับที่ระบุจากฐานข้อมูล
        if (!user) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการ" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบผู้ใช้
        }
        res.json(user); // ส่งข้อมูลผู้ใช้ในรูปแบบ JSON กลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client 
    }
});

// กำหนด route สำหรับการแก้ไขข้อมูลผู้ใช้
app.put("/user/:id", async (req, res) => { // กำหนดเส้นทางสำหรับการแก้ไขข้อมูลผู้ใช้
    try {
        const { id } = req.params; // ดึงข้อมูล id ของหนังสือจากพารามิเตอร์ของ URL
        const { name, email } = req.body; // ดึงข้อมูลชื่อหนังสือและผู้แต่งจากคำขอ
        const User = await userTable.findByPk(id);
        if (!User) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการแก้ไข" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบผู้ใช้
        }
        User.name = name;
        User.email = email; 
        await User.save(); // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
        res.json(User); // ส่งข้อมูลผู้ใช้ที่ถูกแก้ไขกลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// กำหนด route สำหรับการลบผู้ใช้
app.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userTable.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้ที่ต้องการลบ" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบผู้ใช้
        }
        await user.destroy();
        res.json({ message: "ลบผู้ใช้สำเร็จ" }); // ส่งข้อความยืนยันการลบผู้ใช้กลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบผู้ใช้:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบผู้ใช้" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }   
});

// borrowed routes

// กดปุ่มเพื่อแสดงข้อมูลการยืมหนังสือทั้งหมด ในหน้า borrowed.ejs
app.get("/borrow", async (req, res) => { // กำหนดเส้นทางสำหรับการดึงข้อมูลผู้ใช้โดยใช้ id
    try {
        console.log("test");
        const borrowed = await borrowTable.findAll({
            include:[
                {
                    model: userTable, attributes:['name','email']
                },
                {
                    model: bookTable, attributes:['title','author']
                }
                
            ]}
        ); // ดึงข้อมูลผู้ใช้ที่มี id ตรงกับที่ระบุจากฐานข้อมูล
        if (!borrowed) {
            return res.status(404).json({ error: "ไม่พบรายการที่ต้องการ" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบผู้ใช้
        }
        console.log(borrowed);
        res.json(borrowed); // ส่งข้อมูลผู้ใช้ในรูปแบบ JSON กลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

// แสดงข้อมูลการยืมหนังสือทั้งหมด ในหน้า borrowed.ejs
app.post("/borrow/add", async (req, res) => { // กำหนดเส้นทางสำหรับการเพิ่มรายการยืมหนังสือใหม่
    try {
        const { user_id, book_id } = req.body;
        if (!user_id || !book_id) {
            return res.status(400).json({ error: "กรุณาระบุ user_id และ book_id" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อข้อมูลไม่ครบถ้วน
        }
        const isBookBorrowed = await borrowTable.findOne({ where: { bookId: book_id, returnDate: null } }); // ตรวจสอบว่าหนังสือที่ต้องการยืมถูกยืมอยู่หรือไม่
        if (isBookBorrowed) {
            return res.status(400).json({ error: "หนังสือเล่มนี้ถูกยืมอยู่แล้ว" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อหนังสือถูกยืมอยู่แล้ว
        }
        const newBorrow = await borrowTable.create({ userId: user_id, bookId: book_id, borrowDate: new Date() }); // สร้างรายการยืมหนังสือใหม่ในฐานข้อมูล
        res.status(201).json(newBorrow); // ส่งข้อมูลรายการยืมหนังสือที่ถูกสร้างใหม่กลับไปยัง client พร้อมสถานะ 201 (Created)
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มรายการยืมหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มรายการยืมหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }   
});

// delete borrowed
app.delete("/borrow/:id", async (req, res) => { // กำหนดเส้นทางสำหรับการลบรายการยืมหนังสือ
    try {
        const { id } = req.params;
        const borrow = await borrowTable.findByPk(id);
        if (!borrow) {
            return res.status(404).json({ error: "ไม่พบรายการที่ต้องการลบ" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบรายการยืมหนังสือ
        }
        await borrow.destroy();
        res.json({ message: "ลบรายการยืมหนังสือสำเร็จ" }); // ส่งข้อความยืนยันการลบรายการยืมหนังสือกลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบรายการยืมหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบรายการยืมหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});

//return book
app.put("/borrow/:id/return", async (req, res) => { // กำหนดเส้นทางสำหรับการคืนหนังสือ
    try {
        const { id } = req.params;
        const borrow = await borrowTable.findByPk(id);

        if (!borrow) {
            return res.status(404).json({ error: "ไม่พบรายการที่ต้องการคืน" }); // ส่งข้อความแสดงข้อผิดพลาดเมื่อไม่พบรายการยืมหนังสือ
        }

        borrow.returnDate = new Date();
        await borrow.save();

        res.json({ message: "คืนหนังสือสำเร็จ" }); // ส่งข้อความยืนยันการคืนหนังสือกลับไปยัง client
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการคืนหนังสือ:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการคืนหนังสือ" }); // ส่งข้อความแสดงข้อผิดพลาดกลับไปยัง client
    }
});



app.listen(3000, () => { // เริ่มต้นเซิร์ฟเวอร์และฟังที่พอร์ต 3000
  console.log("เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:3000"); // แสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});