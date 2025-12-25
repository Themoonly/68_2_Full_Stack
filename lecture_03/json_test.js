const bookObj = {
    title: "becoming",
    author: 'Michello obama',
    isAvailable: false
};

const bookJSON = JSON.stringify(bookObj);
console.log(bookJSON);
console.log(typeof bookJSON);

const parseBOOK = JSON.parse(bookJSON);
console.log(parseBOOK);
console.log(parseBOOK.title);
console.log(typeof parseBOOK);
