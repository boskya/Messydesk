(function(){
    window.MessyDesk = Ember.Application.create({
		rootElement: '#container',
        _view: null,
        _itemViews: [],
        ready: function () {
            this.initialize();
            this.DeskController.createNew();
            this.createView();

            //TODO: initialize ghostbox instead of calling this method.
            this.bindEvents();
            this._super();
        },
        //TODO: rebuild as ghostbox module
        bindEvents: function () {
            //TODO: options for threshold
            var WIDTH_TO_LOCK = 50,
                HEIGHT_TO_LOCK = 50,
                touchMoveHandler;

            //TODO: this event should be passed into ghostbox
            function onThreshold(coord){
                var item = MessyDesk.DeskController.createItem(coord);
                MessyDesk.createItemView(item);
            }

            // TODO: configuration. default to false
            function collisionsDetected(element){
                if (!element || element.length === 0){
                    return false;
                }
                var $element = $(element),
                    elementOffset = $element.offset(),
                    elementRight = elementOffset.left + $element.width(),
                    elementBottom = elementOffset.top + $element.height(),
                    collisionsFound = [];

                MessyDesk._itemViews.forEach(function(deskItem){
                    var deskItemRight = deskItem.left + deskItem.width,
                        deskItemBottom = deskItem.top + deskItem.height,
                        elementLeftIsBetweenItemBounds = elementOffset.left >= deskItem.left && elementOffset.left <= deskItemRight,
                        elementRightIsBetweenItemBounds = elementRight >= deskItem.left && elementRight <= deskItemRight,
                        elementTopIsBetweenItemBounds = elementOffset.top >= deskItem.top && elementOffset.top <= deskItemBottom,
                        elementBottomIsBetweenItemBounds = elementBottom >= deskItem.top && elementBottom <= deskItemBottom,
                        itemLeftIsBetweenElementBounds = deskItem.left >= elementOffset.left && deskItem.left <= elementRight,
                        itemRightIsBetweenElementBounds = deskItemRight >= elementOffset.left && deskItemRight <= elementRight,
                        itemTopIsBetweenElementBounds = deskItem.top >= elementOffset.top && deskItem.top <= elementBottom,
                        itemBottomIsBetweenElementBounds = deskItemBottom >= elementOffset.top && deskItemBottom <= elementBottom,
                        itemSidesAreWithinElementBounds = itemLeftIsBetweenElementBounds || itemRightIsBetweenElementBounds,
                        elementTopOrBottomIsWithinItemBounds = elementTopIsBetweenItemBounds || elementBottomIsBetweenItemBounds,
                        elementSidesAreWithinItemBounds = elementLeftIsBetweenItemBounds || elementRightIsBetweenItemBounds,
                        itemTopOrBottomIsWithinElementBounds = itemTopIsBetweenElementBounds || itemBottomIsBetweenElementBounds;

                    if ((elementSidesAreWithinItemBounds && elementTopOrBottomIsWithinItemBounds) ||
                        (itemSidesAreWithinElementBounds && itemTopOrBottomIsWithinElementBounds) ||
                        (elementLeftIsBetweenItemBounds && elementRightIsBetweenItemBounds && itemTopOrBottomIsWithinElementBounds) ||
                        (itemTopIsBetweenElementBounds && itemBottomIsBetweenElementBounds && elementSidesAreWithinItemBounds) ||
                        (itemLeftIsBetweenElementBounds && itemRightIsBetweenElementBounds && elementTopOrBottomIsWithinItemBounds) ||
                        (elementTopIsBetweenItemBounds && elementBottomIsBetweenItemBounds && itemSidesAreWithinElementBounds)) {
                        collisionsFound.push(deskItem);
                    }
                });
                return collisionsFound;
            }

            function onCollision(collisions) {
                collisions.forEach(function (item){
                    item.set('selected', true);
                });
            }

            function removeGhost(){
                var ghost = $('.ghost'),
                    collisions = collisionsDetected(ghost);

                if (collisions.length > 0){
                    onCollision(collisions);
                }
                else if (ghost.width() > WIDTH_TO_LOCK && ghost.height() > HEIGHT_TO_LOCK) {
                    var ghostOffset = ghost.offset();
                    onThreshold({
                        left: ghostOffset.left,
                        top: ghostOffset.top,
                        width: ghost.width(),
                        height: ghost.height()
                    });
                }
                $(MessyDesk.rootElement).unbind('mousemove mouseout mouseup');
                this.removeEventListener("touchmove", touchMoveHandler);
                ghost.remove();
            }

            // TODO: passed in override
            function onCreateGhost(){
                MessyDesk._itemViews.forEach(function (item){
                    item.set('selected', false);
                });
            }

            function createGhost(e){
                var cursor = e;
                if (!$(e.srcElement).is(MessyDesk.rootElement)){
                    return;
                }
                if (e.type.substring(0, 5) === 'touch'){
                    cursor = e.targetTouches[0];
                }
                onCreateGhost();
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

                function resizeGhost(e) {
                    var cursor = e.type.substring(0, 5) === 'touch' ? e.targetTouches[0] : e,
                        width = cursor.pageX - left,
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

                $(MessyDesk.rootElement)
                    .bind('mousemove', resizeGhost)
                    .bind('mouseup', removeGhost)
                    .bind('mouseout', function (e){
                        if (!$(e.relatedTarget).is('.desk-item') && !$(e.relatedTarget).is('#container')){
                            removeGhost();
                        }
                    });

                touchMoveHandler = this.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                    resizeGhost(e);
                });
                this.addEventListener('touchend', removeGhost);

                return false;
            }
            $(this.rootElement)
                .bind('mousedown', createGhost)
                .bind('mouseup', removeGhost);

            $(this.rootElement)[0].addEventListener('touchstart', function (e){
                e.preventDefault();
                createGhost(e);
            });
            $(this.rootElement)[0].addEventListener('touchend', removeGhost);
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
            createItem: function(coord) {
                var item = MessyDesk.Item.create(coord);
                this.addObject(item);
                return item;
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
            destroy: function(){
                $(MessyDesk.rootElement).empty();
                MessyDesk._itemViews = [];
                this._super();
            },
            deleteDesk: function () {
                MessyDesk.DeskController.createNew();

                MessyDesk._view.destroy();
                MessyDesk.createView();
            }
        }),
        DeskItemView: Ember.View.extend({
            templateName: 'deskItem',
            selected: false,
            left: 0,
            top: 0,
            width: 0,
            height: 0
        }),
        createView: function (){
            this._view = this.DeskView.create({
                name: this.DeskController.name
            });
            this._view.appendTo($(this.rootElement));
            return this._view;
        },
        createItemView: function(item){
            var itemView = MessyDesk.DeskItemView.create({
                templateName: 'deskItem',
                classNameBindings: ['itemClass', 'selected'],
                itemClass: 'desk-item',
                attributeBindings: ['style'],
                left: item.left,
                top: item.top,
                width: item.width,
                height: item.height,
                style: 'left: {left}px;top: {top}px; width: {width}px; height: {height}px'
                    .replace('{left}', item.left)
                    .replace('{top}', item.top)
                    .replace('{width}', item.width)
                    .replace('{height}', item.height)
            });
            MessyDesk._itemViews.push(itemView);
            itemView.appendTo(MessyDesk.rootElement);
        }
    });
}());