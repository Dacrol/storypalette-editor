angular.module('uiDialog', [
  'ui.bootstrap.modal'
])


.factory('dialog', function($rootScope, $templateCache, $modal) {
  var mooModal = $modal; // To be renamed.

  function modalOptions(template, controller, scope) {
    return {template: template, controller: controller, scope: scope}; 
  }

  var api = {
    // Creates and opens dialog.
    dialog: function(modalOptions, resultFn) {
      var dialog = mooModal.open(modalOptions);
      if (resultFn) {
        dialog.result.then(resultFn);
      }
      dialog.values = modalOptions;
      return dialog;
    },

    // Returns 0-parameter function that opens dialog on evaluation.
    simpleDialog: function(templateUrl, controller, resultFn) {
      return function() {
        var template = $templateCache.get(templateUrl);
        return api.dialog(modalOptions(template, controller), resultFn);
      };
    },

    // Opens simple generic dialog presenting title, message (any html) and provided buttons.
    messageBox: function(title, message, buttons, resultFn) {
      var scope = angular.extend($rootScope.$new(false), {title: title, message: message, buttons: buttons });
      return api.dialog(modalOptions("template/messageBox/message.html", 'MessageBoxController', scope), function (result) {
        var value = resultFn ? resultFn(result) : undefined;
        scope.$destroy();
        return value;
      });
    }
  };

  return api;
})

.run(function($templateCache) {
  $templateCache.put("template/messageBox/message.html",
      '<div class="modal-header"><h3>{{title}}</h3></div>\n' +
      '<div class="modal-body"><p ng-bind-html="message"></p></div>\n' +
      '<div class="modal-footer"><button ng-repeat="btn in buttons" ng-click="close(btn.result)" class="btn" ng-class="btn.cssClass">{{btn.label}}</button></div>\n');
})


.controller('MessageBoxController', function($scope, $modalInstance) {
  $scope.close = function(result) {
    $modalInstance.close(result);
  };
})
;
