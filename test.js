var defaults = require('./defaults');

console.log(defaults.type('fuck'));
console.log(defaults.map((x) => { return x * x; }, [1,2,3]));
console.log(defaults.filter( (x) => { return x < 7; }, defaults.filter( (x) => { return x % 2 == 0; }, [1,2,3,4,5,6,7,8,9,10,11,12]) ));
console.log(defaults.type('fuck'));
