angular.module('uiAuth.authUtils', [])

.factory('authUtils', function() {

  //this is used to parse the profile
  function urlBase64Decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  return {

    // Decode token payload.
    userFromToken: function(token) {
      var encodedUser = token.split('.')[1];
      var user = JSON.parse(urlBase64Decode(encodedUser));
      return user;
    }
  };

});
