function getdayname(daynumber){
    let day;
    switch (daynumber){
        case 1: day = "Sunday"; break;
        case 2: day = "Monday"; break;
        case 3: day = "Tuesday"; break;
        case 4: day = "Wednesday"; break;
        case 5: day = "Thursday"; break;
        case 6: day = "Friday"; break;
        case 7: day = "Saturday"; break;
        default: day = "Invalid day";
    }
    return day;
}

console.log(getdayname(1));
console.log(getdayname(5));