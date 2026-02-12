const logs = [
    { "timestamp": "2024-09-15T08:23:45Z", "user": "Alice", "action": "LOGIN", "details": "User Alice logged in" },
    { "timestamp": "2024-09-15T08:25:12Z", "user": "Alice", "action": "REQUEST", "details": "Requested resource 123" },
    { "timestamp": "2024-09-15T08:27:30Z", "user": "Alice", "action": "LOGOUT", "details": "User Alice logged out" },
    { "timestamp": "2024-09-15T08:35:11Z", "user": "Bob", "action": "LOGIN", "details": "User Bob logged in" },
    { "timestamp": "2024-09-15T08:40:22Z", "user": "Bob", "action": "REQUEST", "details": "Requested resource 124" },
    { "timestamp": "2024-09-15T08:42:08Z", "user": "Bob", "action": "ERROR", "details": "Database connection failed" },
    { "timestamp": "2024-09-15T08:45:15Z", "user": "Alice", "action": "LOGIN", "details": "User Alice logged in" },
    { "timestamp": "2024-09-15T08:50:30Z", "user": "Alice", "action": "REQUEST", "details": "Requested resource 125" },
    { "timestamp": "2024-09-15T08:55:45Z", "user": "Bob", "action": "ERROR", "details": "File not found" },
    { "timestamp": "2024-09-15T09:27:30Z", "user": "Alice", "action": "LOGOUT", "details": "User Alice logged out" },
    { "timestamp": "2024-09-15T09:00:00Z", "user": "Bob", "action": "LOGOUT", "details": "User Bob logged out" },
    { "timestamp": "2024-09-16T08:35:11Z", "user": "Bob", "action": "LOGIN", "details": "User Bob logged in" },
    { "timestamp": "2024-09-16T08:55:45Z", "user": "Bob", "action": "ERROR", "details": "File not found" },
    { "timestamp": "2024-09-16T10:00:00Z", "user": "Bob", "action": "LOGOUT", "details": "User Bob logged out" }
];

function processLogs(logs) {
    const totalActionsPerUser = {};
    const sessionDurations = {};
    const errorCount = {};
    
    // ออบเจ็กต์สำหรับเก็บเวลา LOGIN ล่าสุดของผู้ใช้แต่ละคน
    const lastLoginTime = {};

    logs.forEach(log => {
        const { user, action, timestamp } = log;
        const currentTime = new Date(timestamp);

        // 1. นับจำนวนกิจกรรมทั้งหมด
        totalActionsPerUser[user] = (totalActionsPerUser[user] || 0) + 1;

        // 2. นับจำนวน ERROR
        if (!errorCount[user]) errorCount[user] = 0;
        if (action === 'ERROR') {
            errorCount[user]++;
        }

        // 3. คำนวณระยะเวลาเซสชัน (LOGIN -> LOGOUT)
        if (action === 'LOGIN') {
            lastLoginTime[user] = currentTime;
        } else if (action === 'LOGOUT' && lastLoginTime[user]) {
            const durationMs = currentTime - lastLoginTime[user];
            const durationMin = Math.round(durationMs / (1000 * 60)); // แปลงเป็นนาที
            
            if (!sessionDurations[user]) sessionDurations[user] = [];
            sessionDurations[user].push(durationMin);
            
            // ล้างข้อมูล Login หลังจาก Logout แล้ว
            delete lastLoginTime[user];
        }
    });

    // 4. หาผู้ใช้ที่ทำกิจกรรมมากที่สุด (Most Active User)
    let mostActiveUser = '';
    let maxActions = 0;
    for (const user in totalActionsPerUser) {
        if (totalActionsPerUser[user] > maxActions) {
            maxActions = totalActionsPerUser[user];
            mostActiveUser = user;
        }
    }

    return {
        totalActionsPerUser,
        sessionDurations,
        errorCount,
        mostActiveUser
    };
}

const report = processLogs(logs);
console.log(JSON.stringify(report, null, 2));