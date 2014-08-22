angular.module('uiNotifications', [])

.provider('notifications', function() {
  var config = {
    toastDuration: 2000
  };

  return {
    // Provider methods
    setDefaultToastDuration: function(duration) {
        config.toastDuration = duration || config.toastDuration;
    },

    // Factory method
    $get: function($rootScope, $timeout) {
      var notifications = {
        'STICKY' : [],
        'ROUTE_CURRENT' : [],
        'ROUTE_NEXT' : []
      };

      // Notification objects should look like this:
      // {message: 'my message', type: 'error'|'success'|'warn'|'information'}
      var addNotification = function(notificationsArray, notificationObj) {
        if (!angular.isObject(notificationObj)) {
          throw new Error("Only object can be added to the notification service");
        }
        notificationsArray.push(notificationObj);
        return notificationObj;
      };

      $rootScope.$on('$routeChangeSuccess', function () {
        notifications.ROUTE_CURRENT.length = 0;
        notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
        notifications.ROUTE_NEXT.length = 0;
      });

      // Service API.
      var service = {
        getCurrent: function () {
          return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
        },

        // Stays until removed by user
        pushSticky: function (notification) {
          return addNotification(notifications.STICKY, notification);
        },

        // Removed by timeout
        pushToast: function (notification, duration) {
          duration = duration || config.toastDuration;
          var notificationObject = addNotification(notifications.STICKY, notification);
          $timeout(function () {
            service.remove(notificationObject);
          }, duration);
          return notificationObject;
        },

        pushForCurrentRoute: function (notification) {
          return addNotification(notifications.ROUTE_CURRENT, notification);
        },

        pushForNextRoute: function (notification) {
          return addNotification(notifications.ROUTE_NEXT, notification);
        },

        remove: function (notification) {
          angular.forEach(notifications, function (notificationsByType) {
            var idx = notificationsByType.indexOf(notification);
            if (idx > -1){
                notificationsByType.splice(idx, 1);
            }
          });
        },

        removeAll: function () {
          angular.forEach(notifications, function (notificationsByType) {
            notificationsByType.length = 0;
          });
        }
      };
      return service;

    }  // $get
  };
})
;
