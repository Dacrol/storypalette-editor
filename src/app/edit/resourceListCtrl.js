angular.module('sp.editor.edit.resourceListCtrl', [
  'sp.editor.common.access', 'dndLists', 'ui.bootstrap'
])

.controller('ResourceListCtrl', function($scope, $state, orderByFilter, filterFilter, access, audioPlayer, palettes, resources, dialog, $modal) {
  $scope.isCollapsed = true;
  
  function load() {
    resources.all().then(function(data) {
      // TODO Move filtering serverside
      $scope.resources = $scope.restrictedResources = orderByFilter(access.filterRestrictedData(data), 'name');
      $scope.itemsPerPage = 40;
      $scope.currentPage = 1;
      $scope.maxSize = 5;
            
      $scope.filteredResources = makePage($scope.resources);  

      $scope.totalItems = $scope.resources.length;
            
      $scope.filterResources = function(type) {
        $scope.typeFilter = type;
        $scope.resources = search($scope.restrictedResources, $scope.typeFilter, $scope.query);
        $scope.currentPage = 1;
        $scope.totalItems = $scope.resources.length;
        $scope.filteredResources = makePage($scope.resources); 
      };

      $scope.$watch('query', function (term) {
          $scope.resources = search($scope.restrictedResources, $scope.typeFilter, term);
          $scope.currentPage = 1;
          $scope.totalItems = $scope.resources.length;
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
    var page = list.slice(begin, end);
    
    // make the date string
    page.forEach(function(resource) {          
        var d = new Date(resource.created);
          
        try {
            var dateString = d.toISOString();
            dateString = dateString.substr(0, dateString.indexOf("T"));
            resource.createdDate = dateString;
        }
        catch (exception) {}
    }, this);
      
    return page;
  }

  function search(list, typeFilter, query) {
    var filteredList = list;

    if (typeFilter) {
      var obj = {type: typeFilter};
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

  var modalInstance;

  $scope.newResource = function(resource) {
    dialogOptions.resolve =  {resource: function() {return undefined;}};

    openDialog();
  };
  
  $scope.editResource = function(resource) {
    // Autosave palette since we'll reload the route when saving resource
    palettes.saveCurrent();

    dialogOptions.resolve = {resource: function() {return resource;}};

    openDialog();
  };
  
  var openDialog = function () {
    modalInstance = $modal.open(dialogOptions); 
    modalInstance.result.then(function () {
         $state.go($state.current, {}, {reload: true});
    }, function () {
    });
  };
})
;
