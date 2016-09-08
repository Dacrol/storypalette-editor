angular.module('sp.editor.common.config', [])

.constant('config', {
  notifications: {
    toastLengthShort: 1000,                 
    toastLengthMedium: 2500,
    toastLengthLong: 5000
  },
  environment: window.env.environment || 'local',
  apiBase: window.env.apiBase
})
;

