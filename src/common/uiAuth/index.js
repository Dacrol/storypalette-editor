// uiAuth
//
// Token-based authorization services for angular.

import uiAuthConfig from './authConfig.js';
import uiAuthAuth from './auth.js';
import uiAuthStore from './store.js';
import uiAuthQueue from './queue.js';
import uiAuthInterceptor from './interceptor.js';
import uiAuthUtils from './authUtils.js';
import uiAuthLogin from './login.js';
import uiAuthLoginFormCtrl from './loginFormCtrl.js';

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
