const CustomTag = (options) => CustomTag.define(options);
CustomTag.define = (options) => {
  const
    reserved = new Set([
      'name',
      'extends',
      'static',
      'template',
      'watch',
      'onInit',
      'onChange',
      'onConnect',
      'onDisconnect'
    ]),
    allowed = (key) => !reserved.has(key),

    extend = options['extends'],
    statics = options['static'],
    name = options.name,
    watch = options.watch,
    onInit = options.onInit,
    onChange = options.onChange,
    onConnect = options.onConnect,
    onDisconnect = options.onDisconnect,

    hasInit = !!onInit,
    hasConnect = !!onConnect,
    hasReflect = typeof Reflect !== 'undefined',

    Class = {},
    Prototype = {},
    WeakInit = hasInit ? new WeakSet() : null,

    ownKeys = (hasReflect ? Reflect : {}).ownKeys ||
      ((obj) => Object.getOwnPropertyNames(obj).concat(
        (Object.getOwnPropertySymbols || (() => []))(obj)
      )),
    init = hasInit ?
      (self) => {
        if (!WeakInit.has(self)) {
          WeakInit.add(self);
          onInit.call(self);
        }
      } :
      Object,
    Super = extend ?
      (typeof extend === 'string' ?
        customElements.get(extend) : extend) :
      HTMLElement
  ;

  class Component extends Super {
    constructor() {
      super();
      if (hasInit) Promise.resolve(this).then(init);
    }
    connectedCallback() {
      if (hasInit) init(this);
      if (hasConnect) onConnect.apply(this, arguments);
    }
  }

  if (watch) {
    Class.observedAttributes = {get: () => watch};
    watch.forEach((key) => {
      const isDataset = /^data-/.test(key);
      const prop = (isDataset ? key.slice(5) : key).replace(
        /-([a-z])/g,
        ($0, $1) => $1.toUpperCase()
      );
      Prototype[prop] = isDataset ?
        {
          get() { return JSON.parse(this.dataset[prop] || 'null'); },
          set(value) { this.dataset[prop] = JSON.stringify(value); }
        } : {
          get() { return this.getAttribute(key); },
          set(value) { this.setAttribute(key, value); }
        };
    });
  }

  if (statics) ownKeys(statics).filter(allowed).forEach((key) => {
    Class[key] = Object.getOwnPropertyDescriptor(statics, key);
    Class[key].enumerable = false;
  });

  Object.defineProperties(Component, Class);

  if (onChange) Prototype.attributeChangedCallback = {value: onChange};
  if (onDisconnect) Prototype.disconnectedCallback = {value: onDisconnect};
  ownKeys(options).filter(allowed).forEach((key) => {
    Prototype[key] = Object.getOwnPropertyDescriptor(options, key);
    Prototype[key].enumerable = false;
  });

  Object.defineProperties(Component.prototype, Prototype);
  customElements.define(name, Component);
  return Component;
};
try { module.exports = CustomTag; } catch(meh) {}