var name = Symbol();

class Person {
  constructor(name_) {
    this[name] = name_;
  }
  get name() {
    return this[name];
  }
}

export default Person;