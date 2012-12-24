(function(){
	module('id generate tests');

	test('Should create a few unique ids', function(){
        var ids = {},
            timesToAttempt = 10;

        while (timesToAttempt--) {
                var newId = MessyDesk.generateId();
                equal(ids[newId], undefined, newId);
                ids[newId] = true;
        }
	    ok(!ids['xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'], 'initial value');
	});
})();