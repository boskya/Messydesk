(function(){
	module('messy desk tests', {
		setup: $.noop,
		teardown: function(){
			localStorage.clear();			
		}
	});

	test('Should initialize new desk on load', function(){
		var desks = $.parseJSON(localStorage.getItem('desks'));
		equal(desks.length, 1);

		var desk = $.parseJSON(desks[0]);
		equal(desk.name, "MyMess");
	});

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