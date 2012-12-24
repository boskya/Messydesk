(function(){
	window.MessyDesk = Ember.Application.create({
		rootElement: '#container',
		generateId: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    	return v.toString(16);
		    });
		},
		Desk: Ember.Object.extend({
			id: null,
			name: "MyMess",
			components: [],
			toJSON: function(){
				return "{\"id\": {id}, \"name\": {name}, \"components\": {components}}"
					.replace("{id}", JSON.stringify(this.id))
					.replace("{name}", JSON.stringify(this.name))
					.replace("{components}", JSON.stringify(this.components));
			}
		})
	});

	MessyDesk.DeskController = Ember.ArrayProxy.extend({
		content: [],

		createDesk: function(){
			var desk = MessyDesk.Desk.create({
				id: MessyDesk.generateId(),
                name: 'MyMess'
			});
			this.pushObject(desk);
			return desk;
		}
	});

	MessyDesk.initialize();

  	var desks = $.parseJSON(localStorage.getItem('desks'));
	if (!desks || desks.length === 0) {
	  	desks = [];

	  	var controller = MessyDesk.DeskController.create();
		desks.push(controller.createDesk());
		localStorage.setItem('desks', JSON.stringify(desks));
	}

	var view = Ember.View.create({
		name: desks[0].name,
		templateName: 'desk'
	});
	view.appendTo($(MessyDesk.rootElement));
}());