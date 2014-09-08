import Person from './Person';

var name = 'Moshe'.split('').map(c => c.toUpperCase()).join('');
var person = new Person(name);

console.log(person);

console.log(person.name);

