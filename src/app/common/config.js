angular.module('sp.editor.common.config', [])

.constant('config', {
  version: {
    number: '0.6.0',
    name: 'Red Eyes'
  },
  notifications: {
    toastLengthShort: 1000,                 
    toastLengthMedium: 2500,
    toastLengthLong: 5000
  },
  environment: window.env.environment || 'unknown environemnt',
  apiBase: window.env.apiBase
})
;

