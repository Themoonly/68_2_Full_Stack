const registiondate = new Date('2025-12-10T10:00:00');
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezome: 'Asia/Bangkok'
};

const formatteddate = registiondate.toLocaleDateString('th-TH', options);
console.log(`Member register date: ${formatteddate}`)
// Member register date: 10 ธันวาคม 2568