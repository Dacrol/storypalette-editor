angular.module('uiAuth.login', [])

// For the moment, this handles a modal login dialog.
.factory('login', function(queue, $modal, $location) {
  var dialog;

  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  function openDialog() {
    if (dialog) {throw 'Dialog already open';}

    dialog = $modal.open({
      templateUrl: 'uiAuth/loginForm.tpl.html',
      controller: 'LoginFormCtrl'
    });

    dialog.result.then(function(result) {
      queue.retryAll();
    });
  }

  function closeDialog(success) {
    if (dialog) {
      dialog.close(success);
      dialog = null;
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
