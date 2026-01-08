class song{
    // class constructor ใช้เพื่อกำหนดค่าเริ่มต้นให้กับ object
    constructor(title, artist){
        this.title = title;
        this.artist = artist;
    }
    // class method
    play(){
        console.log('song playing!');
    }

    // class method
    stop(){
        console.log('Stopping!');
    }
}
const mysong = new song('Bohemian Rhapsody','Queen');
console.log(mysong.title);
console.log(mysong);
console.log(typeof mysong);
mysong.play();