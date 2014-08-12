angular.module('sp.editor.admin', [
  'sp.editor.admin.users',
  'uiAuth'
  //'resources.organisations',
  //'resources.users'
])

.config(function($stateProvider, authProvider) {
  $stateProvider.state('admin.admin', {
    url: '/admin', 
    templateUrl: 'admin/admin.tpl.html',
    controller: 'AdminCtrl'
  });
})

.controller('AdminCtrl', function($scope, user) {
  console.log('AdminCtrl', user);
})
;


