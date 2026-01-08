const rl = require(`readline`).createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("enter your name: ", (name) => {
    rl.question("enter your weight (in kg): ", (weight) => {
        rl.question("enter your height (in m): ", (height) => {

            let bmi = weight / (height * height);

            console.log(`${name}, your BMI is ${bmi.toFixed(2)}`);

            rl.close();
        });
    });
});