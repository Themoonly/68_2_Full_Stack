const fullname = "   teerayut   pakaew   ";
console.log(`0_name  : ${fullname}`);
const cleanedname = fullname.trim();
console.log(`1_trim  : ${cleanedname}`);
const nameparts = cleanedname.split(" ");
console.log(`2_spilt : ${nameparts}`);
const finalparts = nameparts.filter(Boolean);
console.log(`3_filter: ${finalparts}`);
const firstName = finalparts[0];
console.log(`4_show  : ${firstName}`);

console.log(`Hello, ${firstName}!`);