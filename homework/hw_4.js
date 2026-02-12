function summarizeOrders(orders) {
    // ถ้าไม่มีข้อมูล
    if (!Array.isArray(orders) || orders.length === 0) {
        return [];
    }

    const summaryMap = {};

    // วนแต่ละออร์เดอร์
    for (const order of orders) {

        // ใช้ Set เก็บ product ที่อยู่ใน order นี้ (กันนับซ้ำ)
        const productsInOrder = new Set();

        for (const item of order.items) {

            const {
                productId,
                productName,
                quantity,
                price
            } = item;

            // ถ้ายังไม่มีสินค้าใน map
            if (!summaryMap[productId]) {
                summaryMap[productId] = {
                    productId,
                    productName,
                    totalQuantity: 0,
                    totalSales: 0,
                    orderCount: 0
                };
            }

            // รวมจำนวน
            summaryMap[productId].totalQuantity += quantity;

            // รวมยอดขาย
            summaryMap[productId].totalSales += quantity * price;

            // เก็บว่ามีสินค้านี้ใน order นี้แล้ว
            productsInOrder.add(productId);
        }

        // เพิ่ม orderCount เฉพาะสินค้าที่อยู่ใน order นี้
        for (const pid of productsInOrder) {
            summaryMap[pid].orderCount += 1;
        }
    }

    // แปลง Object เป็น Array
    const result = Object.values(summaryMap);

    // Sort ตามเงื่อนไข
    result.sort((a, b) => {

        // เรียงตาม totalSales จากมาก → น้อย
        if (b.totalSales !== a.totalSales) {
            return b.totalSales - a.totalSales;
        }

        // ถ้าเท่ากัน เรียงตามชื่อสินค้า
        return a.productName.localeCompare(b.productName);
    });

    return result;
}
// ========================================
//             Testing the Function
// ========================================
const sampleOrders = [
    {
        orderId: 1,
        orderDate: "2025-01-10",
        items: [
            { productId: "P001", productName: "Pen", quantity: 10, price: 5 },
            { productId: "P002", productName: "Book", quantity: 2, price: 50 }
        ]
    },
    {
        orderId: 2,
        orderDate: "2025-01-11",
        items: [
            { productId: "P001", productName: "Pen", quantity: 5, price: 5 },
            { productId: "P003", productName: "Pencil", quantity: 10, price: 2 }
        ]
    },
    {
        orderId: 3,
        orderDate: "2025-01-12",
        items: [
            { productId: "P002", productName: "Book", quantity: 5, price: 45 },
            { productId: "P004", productName: "Eraser", quantity: 1, price: 3 }
        ]
    },
    {
        orderId: 4,
        orderDate: "2025-01-12",
        items: [
            { productId: "P003", productName: "Pencil", quantity: 5, price: 2 },
            { productId: "P001", productName: "Pen", quantity: 3, price: 5 }
        ]
    }
];

const summaryResult = summarizeOrders(sampleOrders);
console.log(summaryResult);


module.exports = { summarizeOrders };

/*
ตัวอย่างผลลัพธ์ (อาจต่างไปตามราคาที่กำหนดใน 'sampleOrders'):
 

[
    {
        productId: 'P002',
        productName: 'Book',
        totalQuantity: 7,
        totalSales: 325,
        orderCount: 2
    },
    {
        productId: 'P001',
        productName: 'Pen',
        totalQuantity: 18,
        totalSales: 90,
        orderCount: 3
    },
    {
        productId: 'P003',
        productName: 'Pencil',
        totalQuantity: 15,
        totalSales: 30,
        orderCount: 2
    },
    {
        productId: 'P004',
        productName: 'Eraser',
        totalQuantity: 1,
        totalSales: 3,
        orderCount: 1
    }
]

(เรียงตาม totalSales มาก -> น้อย,
    ถ้าเท่ากันแล้วจึงเรียงตาม productName)
*/
