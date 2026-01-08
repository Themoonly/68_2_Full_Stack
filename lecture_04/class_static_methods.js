class dog{
    constructor(name){
        this._name = name;
    }
    introduce() {
        console.log('this is '+ this._name + '!');
    }
    // a static method
    static bark(){
        console.log('woof!');
    }
}

// calling the instance method  
//  ข้อดี   
//  ข้อเสีย
const myDog = new dog('Buster');
myDog.introduce();

// calling the static method 
//  ข้อดี ใช้เพื่อไม่อยากให้มีการเรียกแบบเปลี่ยนค่า 
//  ข้อเสีย เรียกผ่าน obj ไม่ได้
dog.bark();