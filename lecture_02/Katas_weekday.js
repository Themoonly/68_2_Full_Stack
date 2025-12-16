function checkdaytype(dayname) {
    switch (dayname.toLowerCase()){
        case "monday":
        case "tuesday":
        case "wednesday":
        case "thursday":
        case "friday":
            return "weekday";
        case "saturday":
        case "sunday":
            return "weekend";
        default: 
            return "invalid day name";
    }
}
console.log(checkdaytype("monday"));
console.log(checkdaytype("saturday"));