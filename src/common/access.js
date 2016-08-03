import uiAuth from '../common/uiAuth/index.js';

angular.module('sp.editor.common.access', [
  'uiAuth'
])

.factory('access', function(auth) {
  return {
    filterRestrictedData: function(data) {
      var currentUser = auth.getCurrentUser();

      return data.filter(function(item) {
        if (!item.restrict) {
          return true;
        }

        switch (item.restrict.type) {
          case 'organisation':
            return item.restrict.id === currentUser.organisationId;
          case 'user':
            return item.restrict.id === currentUser._id;
          default:
            return true;
        }
      });
    }
  };
});
