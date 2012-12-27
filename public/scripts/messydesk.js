(function(){
    window.MessyDesk = Ember.Application.create({
		rootElement: '#container',
        _view: null,
        ready: function (){
            this.initialize();
            this.DeskController.createNew();
            this.createView();
        },
        generateId: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    	return v.toString(16);
		    });
		},
        DeskController: Ember.ArrayController.create({
			toJSON: function() {
				return "{\"id\": {id}, \"name\": {name}, \"items\": {items}}"
					.replace("{id}", JSON.stringify(this.id))
					.replace("{name}", JSON.stringify(this.name))
					.replace("{items}", JSON.stringify(this.content));
			},
            createItem: function() {
                var item = MessyDesk.Item.create();
                this.addObject(item);
            },
            createNew: function () {
                this.content = [];
                this.id  = null;
                this.name = "MyMess";
            }
		}),
        Item: Ember.Object.extend({
            id: null,
            name: 'AnItem'
        }),
        NameField: Ember.TextField.extend({
            change: function (e){
                MessyDesk.DeskController.name = e.srcElement.value;
            }
        }),
        DeskView: Ember.View.extend({
            templateName: 'desk',
            deleteDesk: function () {
                MessyDesk.DeskController.createNew();

                MessyDesk._view.destroy();
                MessyDesk.createView();
            }
        }),
        createView: function (){
            this._view = this.DeskView.create({
                name: this.DeskController.name
            });
            this._view.appendTo($(this.rootElement));
            return this._view;
        }
    });
}());