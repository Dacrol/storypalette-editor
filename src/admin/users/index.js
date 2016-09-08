import template from './users.tpl.html';
import '../../header/header.tpl.html';

import usersCtrl from './usersCtrl.js';
import commonUsers from '../../common/users.js';
import commonOrganisations from '../../common/organisations.js';

angular.module('sp.editor.admin.users', [
  'sp.editor.admin.usersCtrl',
  'sp.editor.common.users',
  'sp.editor.common.organisations'
])

.config(function($stateProvider, $provide) {

  $stateProvider.state('admin.users', {
    url: '/admin/users', 
    templateUrl: 'admin/users/users.tpl.html',
    controller: 'UsersCtrl',
    resolve: {
      allUsers: function(users) {
        return users.all();
      },
      allOrganisations: function(organisations) {
        return organisations.all();
      }
    }
  });

  // $state.reload workaround to refresh resolves.
  // https://github.com/angular-ui/ui-router/issues/582
  $provide.decorator('$state', function($delegate) {
    $delegate.reinit = function() {
      this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
    };
    return $delegate;
  });
})
;
