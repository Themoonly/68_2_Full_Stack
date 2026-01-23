const fullname = " Teerayut pakaew"

const cleanName = fullname.trim();
console.log(`clean name : ${cleanName}`);

const nameParts = cleanName.split(" ");
console.log(`name part: ${nameParts}`);

const finalparts = nameParts.filter(Boolean);
console.log(`final part: ${finalparts}`);

const firstname = finalparts[0];

console.log(`first name: ${firstname}`);
// clean name : Teerayut pakaew
// name part: Teerayut,pakaew
// final part: Teerayut,pakaew
// first name: Teerayut
