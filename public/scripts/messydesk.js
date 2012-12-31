(function(){
    window.MessyDesk = Ember.Application.create({
		rootElement: '#container',
        _view: null,
        ready: function () {
            this.initialize();
            this.DeskController.createNew();
            this.createView();

            //TODo: initialize ghostbox instead of calling this method.
            this.bindEvents();
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
                var itemView = MessyDesk.DeskItemView.create({
                    templateName: 'deskItem',
                    classNameBindings: ['class1'],
                    class1: 'desk-item',
                    attributeBindings: ['style'],
                    style: 'left: {left};top: {top}; width: {width}px; height: {height}px'
                        .replace('{left}', coord.left)
                        .replace('{top}', coord.top)
                        .replace('{width}', coord.width)
                        .replace('{height}', coord.height)
                });
                itemView.appendTo(MessyDesk.rootElement);
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

                $('.desk-item').each(function(index, deskItem){
                    var $deskItem = $(deskItem),
                        deskItemOffset = $deskItem.offset(),
                        deskItemRight = deskItemOffset.left + $deskItem.width(),
                        deskItemBottom = deskItemOffset.top + $deskItem.height(),
                        elementLeftIsBetweenItemBounds = elementOffset.left >= deskItemOffset.left && elementOffset.left <= deskItemRight,
                        elementRightIsBetweenItemBounds = elementRight >= deskItemOffset.left && elementRight <= deskItemRight,
                        elementTopIsBetweenItemBounds = elementOffset.top >= deskItemOffset.top && elementOffset.top <= deskItemBottom,
                        elementBottomIsBetweenItemBounds = elementBottom >= deskItemOffset.top && elementBottom <= deskItemBottom,
                        itemLeftIsBetweenElementBounds = deskItemOffset.left >= elementOffset.left && deskItemOffset.left <= elementRight,
                        itemRightIsBetweenElementBounds = deskItemRight >= elementOffset.left && deskItemRight <= elementRight,
                        itemTopIsBetweenElementBounds = deskItemOffset.top >= elementOffset.top && deskItemOffset.top <= elementBottom,
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
                        collisionsFound.push($deskItem);
                    }
                });
                return collisionsFound;
            }

            function onCollision(collisions) {
                $(collisions).each(function (index, element){
                    $(element).css('border-style', 'dotted');
                });
            }

            function removeGhost(){
                var ghost = $('.ghost'),
                    collisions = collisionsDetected(ghost);

                if (collisions.length > 0){
                    onCollision(collisions);
                }
                else if (ghost.width() > WIDTH_TO_LOCK && ghost.height() > HEIGHT_TO_LOCK) {
                    onThreshold({
                        left: ghost.css('left'),
                        top: ghost.css('top'),
                        width: ghost.width(),
                        height: ghost.height()
                    });
                }
                $(MessyDesk.rootElement).unbind('mousemove mouseout mouseup');
                this.removeEventListener("touchmove", touchMoveHandler);
                ghost.remove();
            }

            // TODO: passed in override, use view
            function onCreateGhost(){
                $('.desk-item').css('border-style', '');
            }

            function createGhost(cursor){
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
                    resizeGhost(e.targetTouches[0]);
                });
                this.addEventListener('touchend', removeGhost);

                return false;
            }
            $(this.rootElement)
                .bind('mousedown', createGhost)
                .bind('mouseup', removeGhost);

            $(this.rootElement)[0].addEventListener('touchstart', function (e){
                e.preventDefault();
                createGhost(e.targetTouches[0])
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
            createItem: function() {
                var item = MessyDesk.Item.create();
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
            deleteDesk: function () {
                MessyDesk.DeskController.createNew();

                MessyDesk._view.destroy();
                MessyDesk.createView();
            }
        }),
        DeskItemView: Ember.View.extend({
            templateName: 'deskItem'
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