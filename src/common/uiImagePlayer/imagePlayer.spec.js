describe('uiImagePlayer', function() {
  var uiImagePlayer; 

  beforeEach(module('uiImagePlayer'));
  beforeEach(inject(function($injector) {
    imagePlayer = $injector.get('imagePlayer');
  }));
  
  describe('initialisation', function() {
    it('should exist', function() {
      expect(imagePlayer).toBeDefined(); 
    });
  });
});
