const names = ['Justin','Sarah','Christopher'];

console.log('-----WHILE-----');
let index = 0;
while (index < names.length){
    const name = names[index];
    console.log(name);
    index++;
}

console.log('\n-----FOR-----');
for (let index = 0; index < names.length; index++){
    const name = names[index];
    console.log(name);
}

console.log('\n-----FOR OF-----');
for (let name of names){
    console.log(name);
}

// -----WHILE-----
// Justin
// Sarah
// Christopher

// -----FOR-----
// Justin
// Sarah
// Christopher

// -----FOR OF-----
// Justin
// Sarah
// Christopher