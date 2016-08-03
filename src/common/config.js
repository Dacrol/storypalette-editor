angular.module('sp.editor.common.config', [])

.constant('config', {
  version: {
    number: '0.7.0',
    name: 'Strange Gateways Beckon'
  },
  notifications: {
    toastLengthShort: 1000,                 
    toastLengthMedium: 2500,
    toastLengthLong: 5000
  },
  environment: window.env.environment || 'local',
  apiBase: window.env.apiBase
})
;

