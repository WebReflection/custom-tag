/*! (C) 2017 Andrea Giammarchi - Mit Style License */

function CustomTag(options) { return CustomTag.define(options); }

CustomTag.get = customElements.get.bind(CustomTag);

CustomTag.whenDefined = customElements.whenDefined.bind(CustomTag);

CustomTag.define = function (options) {'use strict';
  var
    defineProperty = Object.defineProperty,
    statics = options['static'] || (options['static'] = {}),
    extend = options['extends'],
    extendString = typeof extend === 'string',
    extendNative = extendString && extend.indexOf('-') < 0,
    watch = options.hasOwnProperty('watch') && options.watch,
    name = options.name,
    onAdopt = options.onAdopt,
    onChange = options.onChange,
    onConnect = options.onConnect,
    onDisconnect = options.onDisconnect,
    onInit = options.onInit,
    hasInit = !!onInit,
    hasConnect = !!onConnect,
    hasChange = !!onChange,
    Super = extend ?
      (extendString ?
        (extendNative ?
          document.createElement(extend).constructor :
          customElements.get(extend)
        ) : extend
      ) : HTMLElement,
    Component,
    WeakInit,
    init
  ;
  if (hasInit) {
    init = function (self) {
      if (!WeakInit.has(self)) {
        WeakInit.add(self);
        self.onInit();
      }
    };
    WeakInit = typeof WeakSet === 'function' ?
      new WeakSet :
      {
        add: function (el) { el.__CustomTag = {}; },
        has: function (el) { return el.__CustomTag; }
      }
  }
  options['extends'] = Super;
  options.createdCallback = hasInit && function () {
    if (hasInit) init(this);
  };
  options.connectedCallback = function () {
    if (hasInit) init(this);
    if (hasConnect) this.onConnect.apply(this, arguments);
  };
  options.attributeChangedCallback = function (name, prev, curr) {
    if (hasInit) init(this);
    if (hasChange && prev !== curr) this.onChange(name, prev, curr);
  };
  if (onAdopt) options.adoptedCallback = onAdopt;
  if (onDisconnect) options.disconnectedCallback = onDisconnect;
  if (watch) {
    delete options.watch;
    defineProperty(statics, 'observedAttributes', {
      configurable: true,
      get: function () { return watch; }
    });
    watch.forEach(function (key) {
      if (!options.hasOwnProperty(key)) {
        defineProperty(options, key.replace(
          /-([a-z])/g,
          function ($0, $1) { return $1.toUpperCase(); }
        ), {
          configurable: true,
          get: function get() { return this.getAttribute(key); },
          set: function set(value) { this.setAttribute(key, value); }
        });
      }
    });
  }
  delete options.name;
  Component = (CustomTag.Class || Class)(options);
  customElements.define.apply(
    customElements,
    extendNative ?
      [name, Component, {'extends': extend}] :
      [name, Component]
  );
  return Component;
};

try {
  module.exports = CustomTag;
  CustomTag.Class = require('classtrophobic');
} catch(meh) {}
