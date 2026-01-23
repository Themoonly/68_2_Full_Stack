function criticalCode(){
    throw "Throwing an exception";
}

function logError(theException){
    console.log(theException);
}

// try catch
console.log("\n try...catch \n");

try{
    criticalCode();
}
catch(ex){
    console.log("Got an error");
    logError(ex)
}


// throwing in try catch
console.log("\n throwing in try...catch \n");

try{
    throw "An exception that is thrown every time"; //throwing
}
catch(ex){
    console.log("got an error");
    logError(ex);
}

// try catch finally
console.log("\n try...catch...finally \n");

try{
    criticalCode();
}
catch(ex){
    console.log("got an error");
    logError(ex);
}
finally{ // finally
    console.log("Code that always will run");
}
function hello() {
    console.log("\n throwing excaption \n");
}

