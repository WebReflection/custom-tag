this.onload = function () {

  var test = tressa;

  test.title('CustomTag');
  setTimeout(
    function () {
      if (!test.exitCode)
        document.body.className = 'passed';
    },
    1000
  );

  test.async(function (done) {
    var MyElement;

    CustomTag.whenDefined('my-element').then(function () {
      test.log('## MyElement');
      test(CustomTag.get('my-element') === MyElement, 'class');
      document.body.appendChild(new MyElement);
    });

    MyElement = CustomTag({
      name: 'my-element',
      watch: ['attribute'],
      onInit: function () {
        test(true, 'initialized');
        test(this instanceof HTMLElement, 'inherited');
        this.textContent = this.nodeName;
      },
      onConnect: function () {
        test(true, 'connected');
        this.attribute = 'test';
      },
      onChange: function (name, prev, curr) {
        test(name === 'attribute', 'changed');
        test(prev == null, 'previous value');
        test(curr === 'test', 'current value');
        this.parentNode.removeChild(this);
      },
      onDisconnect: function () {
        test(true, 'disconnected');
        done();
      }
    });

  });

  test.async(function (done) {
    var MyButton;

    CustomTag.whenDefined('my-button').then(function () {
      test.log('## MyButton');
      test(CustomTag.get('my-button') === MyButton, 'class');
      document.body.appendChild(new MyButton);
    });

    MyButton = CustomTag({
      name: 'my-button',
      extends: 'button',
      watch: ['attri-bute'],
      onInit: function () {
        test(true, 'initialized');
        test(this instanceof HTMLButtonElement, 'inherited');
        this.textContent = this.nodeName;
      },
      onConnect: function () {
        test(true, 'connected');
        this.attriBute = 'test';
      },
      onChange: function (name, prev, curr) {
        test(name === 'attri-bute', 'changed');
        test(prev == null, 'previous value');
        test(curr === 'test', 'current value');
        this.parentNode.removeChild(this);
      },
      onDisconnect: function () {
        test(true, 'disconnected');
        done();
      }
    });

  });

};
