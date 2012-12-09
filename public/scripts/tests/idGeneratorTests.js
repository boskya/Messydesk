(function(){
	test("Should create a few unique ids", function(){
		var ids = [];
		while (ids.length < 10){
			ids.push(messyDesk.generateId());
		}
	});
})();