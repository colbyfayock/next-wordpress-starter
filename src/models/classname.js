class ClassName {
  constructor(className) {
    this.base = className;

    if (!Array.isArray(className)) {
      this.base = [this.base];
    }
  }

  add(className) {
    if (!Array.isArray(className)) {
      className = [className];
    }

    this.base = [...this.base, ...className];

    return this;
  }

  addIf(className, condition) {
    if (condition) this.add(className);
    return this;
  }

  toString() {
    return this.base.join(' ');
  }
}

export default ClassName;
