const y_status = 200;

console.log("if else;");
if (y_status === 200){
    console.log("ok");
}
else if (y_status === 400){
    console.log("Errror!");
}
else {
    console.log("Unknow");
}
console.log("");

console.log("switch case :");
switch (y_status){
    case 200:
        console.log("ok");
        break;
    case 400:
        console.log("error");
        break;
    default:
        console.log("unknow");
        break;
}
console.log("")

console.log("Ternary operators :");
const message = (y_status === 200) ? "ok" : "error";
console.log(message);

// if else;
// ok

// switch case :
// ok

// Ternary operators :
// ok