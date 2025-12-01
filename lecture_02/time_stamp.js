const starttime = Date.now();
function someheavytask(){
    for (let i = 0; i < 1e7; i++){
        Math.sqrt(i);
    }
}

someheavytask();
const endtime = Date.now();
const duration = endtime - starttime;
console.log(`function use time: ${duration} milisecondes`);