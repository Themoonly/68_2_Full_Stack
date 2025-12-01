const err_status = 400;

// if / else operator
if (err_status === 200){
    console.log("Operation was sucessful.")
} else if (err_status === 400) {
    console.log("Bad request. Please check your in put.")
} else{
    console.log("Unknow")
}

// switch operator
switch (err_status) {
    case 200:
        console.log("Operation was sucessful.");
        break;
    case 400:
        console.log("Bad request. Please check your in put.");
        break;
    default:
        console.log("unknow");
}

// ternary operator (?:)
const message = (err_status === 200) ? "OK!" : "Error";
    console.log(message);