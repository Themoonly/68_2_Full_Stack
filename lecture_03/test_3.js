const guests = ['Alice','Bob','Charlie','David'];

let index = 0;
while(index < guests.length){
    const names = guests[index];
    const text = 'Charlie';
    index++;
    if (names === text){
        console.log('Found Charlie');
        break;
    }
}