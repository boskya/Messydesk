(function(){
	window.messyDesk = Ember.Application.create({
		rootElement: '#container'
	});
	$(document).ready(function (){
		new messyDesk.desk.create({
			id: messyDesk.generateId()	
		});
	});

})();