import template from './loginForm.tpl.html';
import uiBootstrap from 'angular-ui-bootstrap';

angular.module('uiAuth.login', [
  'ui.bootstrap.modal'
])

// For the moment, this handles a modal login dialog.
.factory('login', function(queue, $modal, $location) {
  var loginDialog;

  function redirect(url) {
    url = url || '/';
    console.log('redirect to ', url);
    $location.path(url);
  }

  function openDialog() {
    //if (loginDialog) {throw 'Dialog already open';}

    loginDialog = $modal.open({
      templateUrl: template,
      controller: 'LoginFormCtrl'
    });

    loginDialog.result.then(function(result) {
      console.log('dialog result', result);
      queue.retryAll();
      redirect();
      //closeDialog();
    });
  }

  function closeDialog(success) {
    if (loginDialog) {
      loginDialog.close(success);
      loginDialog = null;
    }
  }

  return {
    show: function () {
      openDialog();
    },
    cancel: function() {
      closeDialog(false); 
      redirect();
    }
  };

})
;
