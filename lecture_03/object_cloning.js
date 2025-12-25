// Object cloning assign(),{... x}, json
const object_1 = {
    person: 'Teerayut',
    weight: 70
}

// const object_2 = object_1
// const object_2 = Object.assign({},object_1)
const object_2 = {... object_1};
object_2.weight = 20;
console.log(object_1);
console.log(object_2);