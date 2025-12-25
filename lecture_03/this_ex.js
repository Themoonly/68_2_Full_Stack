const cat = {
    name: "Pipey",
    age: 8,
    whatname(){
        return this.name;
    },
};

console.log(cat.whatname());
    // Pipey
cat.name = "Nezzar";
console.log(cat.whatname());
    // Nezzar