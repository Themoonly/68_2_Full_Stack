function createLogEntry(message) {
    // 1.create timestamp
    const now = new Date();
    const timestamp = now.toLocaleDateString(`th-TH`);
    // 2.create event id make random string
const eventId = Math.random().toString(36).substring(2, 10).toUpperCase();
    // 3.create log message in uppercase
const logmessage = message.toUpperCase();

return`[${timestamp}] [${eventId}] - ${logmessage}`;
}

const log = createLogEntry("User login successful");
console.log(log);
