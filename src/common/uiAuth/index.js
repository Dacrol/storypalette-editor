// uiAuth
//
// Token-based authorization services for angular.

angular.module('uiAuth', [
  'uiAuth.authConfig',
  'uiAuth.auth',
  'uiAuth.store',
  'uiAuth.queue',
  'uiAuth.interceptor',
  'uiAuth.authUtils',
  'uiAuth.login',
  'uiAuth.loginFormCtrl'
])
;
