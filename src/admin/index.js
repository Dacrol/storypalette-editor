import template from './admin.tpl.html';
import '../header/header.tpl.html';
import adminUsers from './users/index.js';
import uiAuth from '../common/uiAuth/index.js';

angular.module('sp.editor.admin', [
  'sp.editor.admin.users',
  'uiAuth'
  //'resources.organisations',
  //'resources.users'
])

.config(function($stateProvider, authProvider) {
  $stateProvider.state('admin.admin', {
    url: '/admin', 
    templateUrl: template,
    controller: 'AdminCtrl'
  });
})

.controller('AdminCtrl', function($scope, user) {
  console.log('AdminCtrl', user);
})
;


