(function(){
    window.MessyDesk = Ember.Application.create({
		rootElement: '#container',
        _view: null,
        ready: function () {
            this.initialize();
            this.DeskController.createNew();
            this.createView();
            this.bindEvents();
        },
        bindEvents: function () {
            function removeGhost(){
                $('.ghost').remove();
                $(this).unbind('mousemove');
                this.removeEventListener("touchmove");
            }

            function createGhost(cursor){
                removeGhost();
                var ghost = $('<div class="ghost" />').appendTo('body'),
                    left = cursor.pageX,
                    top = cursor.pageY;

                ghost.css({
                    'left': left,
                    'top': top,
                    'width': '1px',
                    'height': '1px'
                });

                function resizeGhost(cursor) {
                    var width = cursor.pageX - left,
                        height = cursor.pageY - top,
                        newLeft = left,
                        newTop = top;

                    if (width < 0){
                        newLeft = cursor.pageX;
                    }

                    if (height < 0){
                        newTop = cursor.pageY;
                    }

                    ghost.css({
                        'left': newLeft,
                        'top': newTop,
                        'width': Math.abs(width),
                        'height': Math.abs(height)
                    });
                    return false;
                }

                $(this)
                    .bind('mousemove', resizeGhost)
                    .bind('mouseup', removeGhost);

                this.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                    resizeGhost(e.targetTouches[0]);
                });
                this.addEventListener('touchend', removeGhost);

                return false;
            }

            $(this.rootElement)
                .bind('mousedown', createGhost)
                .bind('mouseup, mouseout, mouseleave', removeGhost);

            $(this.rootElement)[0].addEventListener('touchstart', function (e){
                e.preventDefault();
                createGhost(e.targetTouches[0])
            });
            $(this.rootElement)[0].addEventListener('touchend', removeGhost);
            $(this.rootElement)[0].addEventListener('touchleave', removeGhost);
            $(this.rootElement)[0].addEventListener('touchcancel', removeGhost);
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