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
  // TODO: Make apiBase depend on environment!
  apiBase: 'http://api.storypalette.dev:8888/v1/',
  basePath: '/editor' 
})
;
