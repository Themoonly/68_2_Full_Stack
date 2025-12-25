const book = new Object();
book.title = "1984";
book.author = "george Orwell";
book.isAvailable = false;

book.checkIn = function(){
    this.isAvailable=true;
};

book.checkOut = function(){
    this.isAvailable=false;
};

console.log(typeof book);