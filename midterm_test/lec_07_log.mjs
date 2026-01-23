function createlogEntry(message){
    const now = new Date();
    const timestamp = now.toLocaleTimeString('th-TH');
    const evenID = Math.random().toString(16).substring(2,10);
    const logMessage = message.toUpperCase();
    return `[${timestamp}] [${evenID}] - ${logMessage}`;
}

const log = createlogEntry("User login successful");
console.log(log);
// [01:38:15] [7d81bfc6] - USER LOGIN SUCCESSFU