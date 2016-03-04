angular.module('sp.editor.edit.resourceListCtrl', [
  'sp.editor.common.access', 'dndLists', 'ui.bootstrap'
])

.controller('ResourceListCtrl', function($scope, $state, orderByFilter, filterFilter, access, audioPlayer, palettes, resources, dialog, $modal) {
  $scope.isCollapsed = true;
  
  function load()
  {
  resources.all().then(function(data) {
    // TODO Move filtering serverside
    $scope.resources = $scope.restrictedResources = orderByFilter(access.filterRestrictedData(data), 'name');
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    
    $scope.filteredResources = $scope.resources.slice(0, $scope.itemsPerPage);  

    $scope.totalItems = $scope.resources.length;

    $scope.filterResources = function(type) {
        $scope.typeFilter = type;
        $scope.resources = search($scope.restrictedResources, $scope.typeFilter, $scope.query);
        $scope.currentPage = 1;
        $scope.filteredResources = makePage($scope.resources); 
    };

    $scope.$watch('query', function (term) {
        $scope.resources = search($scope.restrictedResources, $scope.typeFilter, term);
        $scope.currentPage = 1;
        $scope.filteredResources = makePage($scope.resources); 
    });
        
    $scope.$watch('currentPage', function() { 
        $scope.filteredResources = makePage($scope.resources);
    });    
  });
  }
  
  load(); 
  
  function makePage(list) {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      return list.slice(begin, end);
  }

  function search(list, typeFilter, query) {
      var filteredList = list;

      if (typeFilter) {
          var obj = { type: typeFilter };

          filteredList = filterFilter(list, obj);
      }

      if (query) {
          filteredList = filterFilter(filteredList, query);
      }
      return filteredList;
  }

  $scope.iconClasses = {
    sound: 'icon-music',
    image: 'icon-picture',
    light: 'icon-fire'
  };
  
  $scope.typeFilter = '';
  
  var dialogOptions = {
    templateUrl: 'edit/addEditResource.tpl.html',
    controller: 'AddEditResourceCtrl',
    resolve: {resource: function() {return undefined;} }
  };

  var loginDialog;

  $scope.newResource = function(resource) {
    dialogOptions.resolve =  {resource: function() {return undefined;}};
    loginDialog = $modal.open(dialogOptions);
  };
  
  $scope.editResource = function(resource) {
    // Autosave palette since we'll reload the route when saving resource
    palettes.saveCurrent();

    dialogOptions.resolve = {resource: function() {return resource;}};
    openDialog();
  };
  
  var openDialog = function () {
    console.log(dialog);
    dialog.dialog(dialogOptions, function() {
      console.log('reloading page');

      $scope.filteredResources = [];
      load();
      $state.go($state.current, {}, {reload: true});
    });
  };
})
;