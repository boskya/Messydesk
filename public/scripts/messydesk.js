(function(){
	window.MessyDesk = Ember.Application.create({
		rootElement: '#container',
        MyDesk: null,
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
		}),
        Name: Ember.TextField.extend({
            change: function (e){
                MessyDesk.MyDesk.name = e.srcElement.value;
            }
        }),
        DeskView: Ember.View.extend({
            templateName: 'desk',
            deleteDesk: function () {
                MessyDesk.MyDesk.destroy();
                MessyDesk._view.destroy();
                MessyDesk.createDesk();
                Ember.run.sync();
            }
        }),
        _view: null,
        createDesk: function () {
            //global...may need to move into controller
            MessyDesk.MyDesk = MessyDesk.Desk.create();
            MessyDesk._view = MessyDesk.DeskView.create({
                name:MessyDesk.MyDesk.name
            });
            MessyDesk._view.appendTo($(MessyDesk.rootElement));
        }
    });

    MessyDesk.initialize();
    MessyDesk.createDesk();
}());