# CustomTag

The simplest way to define Custom Elements.

Based on [Classtrophobic](https://github.com/WebReflection/classtrophobic),
usable before or after Babel transpilation.

### API
```js
const MyButton = CustomTag({
  // registered automatically with a name
  name: 'my-button',

  // supports native extends too
  extends: 'button',
  // extends: 'my-prev-comp'
  // extends: HTMLButtonEmenent (or others)

  // list of properties to watch/observe
  watch: ['one', 'or-more', 'attributes'],
  // automatically reflected through the element too
  // this.one = 1; // triggers changes with string value '1'

  // invoked once per each component
  // fully customizable once invoked
  onInit() {
    this.textContent = this.nodeName; // BUTTON
    this.on('click', console.log);
  },

  // invoked on adopt, connect, disconnect, changes
  onAdopt() {},
  onConnect() {},
  onDisconnect() {},
  onChange(prop, prev, curr) {},

  // any other method, getter, or static
  // what you can define with classtrophobic
  // will work out of the box in here too
  on(...args) {
    this.addEventListener(...args);
    return this;
  }
});
```

(C) 2017 Andrea Giammarchi - MIT Style License
