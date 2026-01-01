const names = ['Justin','Sarah','Christopher'];

// old way
console.log('\n++++++++ old +++++++++++')
for (let i = 0; i < names.length;i++){
    console.log(names[i])
}

// modern way
console.log('\n++++++++ modern +++++++++++')
names.forEach(name => {
    // ดึงชื่อใน Array ออกมาทีละชื่อและส่งให้ตัวแปร name
    console.log(name);
})

// my function
console.log('\n++++++++ my function +++++++++++')
names.forEach(myfunction);

function myfunction(value){
    console.log(value);
}
// for let
console.log('\n++++++++ for let +++++++++++')
for (let name of names){
    console.log(name)
}