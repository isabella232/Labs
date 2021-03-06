// Knockout Extent JavaScript library v0.1
// (c) 2011 Green Luo
// License: Ms-Pl (http://www.opensource.org/licenses/ms-pl.html)

// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(publicPath, object) {
	var tokens = publicPath.split(".");
	var target = window;
	for (var i = 0; i < tokens.length - 1; i++)
		target = target[tokens[i]];
	target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
  owner[publicName] = object;
};ko.exportSymbol('KO', ko['observable']);
ko.exportSymbol('KOA', ko['observableArray']);
ko.exportSymbol('KOD', ko['dependentObservable']);

(function(bindingHandlers){

var kou = function() {
  var ku = ko['utils'];
  return {
    unwrap: ku['unwrapObservable'],
    regEventHandler: ku['registerEventHandler'],
    toggleClass: ku['toggleDomNodeCssClass']
  };
}();

bindingHandlers['html'] = {
  'update': function (element, valueAccessor) {
    var value = kou.unwrap(valueAccessor());
    if ((value === null) || (value === undefined))
      value = "";
    element.innerHTML = value;
  }
};

bindingHandlers['event'] = {
  'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
    var value = kou.unwrap(valueAccessor());
    for (var eventName in value) {
      if (typeof eventName == "string") {
        var eventHandler = kou.unwrap(value[eventName]);
        (function(eventHandler) {
          kou.regEventHandler(element, eventName, function(event, arg1, arg2, arg3) {
            var retVal;
            try {retVal = eventHandler.call(viewModel, element, event, arg1, arg2, arg3);}
            finally {
              if (!retVal) {
                if (event.preventDefault)
                    event.preventDefault();
                else
                    event.returnValue = false;
              }
            }
          });
        })(eventHandler);
      }
    }
  }
};

bindingHandlers['attr'] = {
  update: function(element, valueAccessor, allBindingsAccessor) {
    var value = kou.unwrap(valueAccessor() || {});
    for (var attrName in value) {
      if (typeof attrName == "string") {
        var attrValue = kou.unwrap(value[attrName]);
        element.setAttribute(attrName, attrValue);
      }
    }
  }
};

bindingHandlers['className'] = {
  update: function(element, valueAccessor, allBindingsAccessor) {
    var value = valueAccessor();
    var valueUnwrapped = kou.unwrap(value);
    if (typeof valueUnwrapped == 'function') valueUnwrapped = valueUnwrapped();
    var classes = valueUnwrapped.split(" ");
    for (var i = 0, j = classes.length; i < j; ++i) {
      kou.toggleClass(element, kou.unwrap(classes[i]), true);
    }
  }
};


})(ko['bindingHandlers']);
