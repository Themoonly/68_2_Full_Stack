// create date object
registrationdate = new Date('2023-06-15T10:30:00Z');

const options = {
    year: 'numeric',
    month: 'Long',
    day: 'numeric',
    timezone: 'Asia/Bangkok'
};

const formatterdate = 
    registrationdate.toLocaleDateString('th-TH', options);
console.log(`member registered: ${formatterdate}`);