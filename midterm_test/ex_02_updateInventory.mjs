// input ฟังชั่น
function updateInventory(currentInventory, newInventory){
    // สร้าง Object เพื่อรวมข้อมูล ใ้ช้ name เป็น key เพื่อให้หาและอัปเดตง่าย
    let inventoryMap = {};

    // นำของเดิมใส่ลงไปใน map
    currentInventory.forEach(item => {
        inventoryMap[item.name] = item.quantity;
    });

    // อัปเดต ข้อมมูลจากรายการใหม่
    newInventory.forEach(item => {
        if (inventoryMap[item.name]){
            // ถ้ามีข้อมูลแล้ว ให้บวกจำนวนเพิ่ม
            inventoryMap[item.name] += item.quantity;
        }
        else {
            // ถ้าไม่มี ให้เพิ่มเข้าไปใหม่
            inventoryMap[item.name] = item.quantity;
        }
    });

    // แปลง map กลับเป็น array of Object
    let updateList = Object.keys(inventoryMap).map(name => {
        return {name:name, quantity:inventoryMap[name]};
    });

    // จัดเรียงตามชื่อสินค้า alphabetical order
    updateList.sort((a, b) => a.name.localeCompare(b.name));

    return updateList;
}
const currentInventory = [
    {name: 'item1', quantity: 10},
    {name: 'item2', quantity: 5},
    {name: 'item3', quantity: 8}
];

const newInventory = [
    {name: 'item1', quantity: 5},
    {name: 'item4', quantity: 7},
    {name: 'item2', quantity: 10}
];

console.log(updateInventory(currentInventory, newInventory));
// [
//   { name: 'item1', quantity: 15 },
//   { name: 'item2', quantity: 15 },
//   { name: 'item3', quantity: 8 },
//   { name: 'item4', quantity: 7 }
// ]
