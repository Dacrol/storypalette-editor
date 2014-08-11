xdescribe('uiNotifications', function () {

    var $scope, notifications;

    beforeEach(module('uiNotifications'));
    beforeEach(inject(function ($injector) {
        $scope = $injector.get('$rootScope');
        notifications = $injector.get('notifications');
    }));

    describe('global notifications crud', function () {

        it('should allow adding, getting and removing notifications', function () {
            var not1 = notifications.pushSticky({message: 'Take that!'});
            var not2 = notifications.pushSticky({message: 'Booyaka!'});
            expect(notifications.getCurrent().length).toBe(2);

            notifications.remove(not2);
            expect(notifications.getCurrent().length).toEqual(1);
            expect(notifications.getCurrent()[0]).toBe(not1);

            notifications.removeAll();
            expect(notifications.getCurrent().length).toEqual(0);
        });

        it('removal of a non existing notification doesn\'n trigger errors', function () {
            notifications.remove({});
        });

        it('should reject notifications that are not objects', function () {
            expect(function () {
                notifications.pushSticky('not an object');
            }).toThrow(new Error("Only object can be added to the notification service"));
        });
    });

    describe('notifications expiring after route change', function () {

        it('should remove notification after route change', function () {
            var sticky = notifications.pushSticky({message: 'Will stick around after route change'});
            var currRoute = notifications.pushForCurrentRoute({message: 'Will go away after route change'});
            expect(notifications.getCurrent().length).toEqual(2);
            $scope.$emit('$routeChangeSuccess');
            expect(notifications.getCurrent().length).toEqual(1);
            expect(notifications.getCurrent()[0]).toBe(sticky);
        });
    });

    describe('notifications showing on next route change and expiring on subsequent one', function () {

        it('should show notification after a route change and remove on the subsequent route change', function () {
            notifications.pushSticky({message: 'I will stick around'});
            notifications.pushForNextRoute({message: 'Will appear after route change'});
            expect(notifications.getCurrent().length).toEqual(1);
            $scope.$emit('$routeChangeSuccess');
            expect(notifications.getCurrent().length).toEqual(2);
            $scope.$emit('$routeChangeSuccess');
            expect(notifications.getCurrent().length).toEqual(1);
        });
    });
});
