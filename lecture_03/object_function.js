const book = {
    title: "1984",
    author: "George Orwell",
    isAvailable: false,

    checkIn: function(){
        this.isAvailable = true;
    },
    checkOut: function(){
        this.isAvailable = false;
    }
};
console.log(`title: ${book.title}` );
console.log(`available: ${book.isAvailable}` );
book.checkIn();
console.log(`available: ${book.isAvailable}` );
book.checkOut();
console.log(`available: ${book.isAvailable}` );
console.log(typeof book);