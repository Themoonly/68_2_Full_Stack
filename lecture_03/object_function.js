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
}

console.log(typeof book);