function CustomTag(options) { return CustomTag.define(options); }

CustomTag.get = customElements.get.bind(CustomTag);

CustomTag.whenDefined = customElements.whenDefined.bind(CustomTag);

CustomTag.define = function (options) {
  var
    extend = options.extends,
    extendString = typeof extend === 'string',
    extendNative = extendString && extend.indexOf('-') < 0,
    statics = options.static || (options.static = {}),
    name = options.name,
    watch = options.watch,
    onAdopt = options.onAdopt,
    onChange = options.onChange,
    onConnect = options.onConnect,
    onDisconnect = options.onDisconnect,
    onInit = options.onInit,
    hasInit = !!onInit,
    hasConnect = !!onConnect,
    WeakInit = hasInit ? new WeakSet() : null,
    init = hasInit ?
      (self) => {
        if (!WeakInit.has(self)) {
          WeakInit.add(self);
          onInit.call(self);
        }
      } :
      Object,
    Super = extend ?
      (extendString ?
        (extendNative ?
          document.createElement(extend).constructor :
          customElements.get(extend)
        ) :
        extend
      ) :
      HTMLElement,
    Class
  ;
  options['extends'] = Super;
  if (onAdopt) {
    options.adoptedCallback = onAdopt;
  }
  if (onChange) {
    options.attributeChangedCallback = onChange;
  }
  if (onDisconnect) {
    options.disconnectedCallback = onDisconnect;
  }
  options.connectedCallback = function () {
    if (hasInit) init(this);
    if (hasConnect) this.onConnect.apply(this, arguments);
  };
  if (watch) {
    statics.observedAttributes = function () { return watch; };
    watch.forEach(function (key) {
      if (!options.hasOwnProperty(key)) {
        options[key] = {
          get: function () { return this.getAttribute(key); },
          set: function (value) { this.setAttribute(key, value); }
        };
      }
    });
  }
  Class = CustomTag.Class(options);
  customElements.define.apply(
    customElements,
    extendNative ?
      [name, Class, {extends: extend}] :
      [name, Class]
  );
  return Class;
};

try { module.exports = CustomTag; } catch(meh) {}
