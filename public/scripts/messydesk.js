function generateId() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

(function(){
	window.MessyDesk = Ember.Application.create({
		rootElement: '#container'
	});
	
	window.MessyDesk.initialize();
	
	MessyDesk.desk = Ember.Object.extend({
		id: null,
		name: "MyMess",
		components: []
	});

	MessyDesk.desk.create({
		id: generateId()	
	});
})();