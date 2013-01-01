(function(){
    var DEFAULT_NAME = 'MyMess';

	module('messy desk view tests', {
        setup: function(){
            MessyDesk._view.destroy();
            MessyDesk.DeskController.createNew();
        }
    });

	test('Should initialize new DeskView', function(){
        var view = MessyDesk.createView();
        equal(view.name, DEFAULT_NAME);
	});

    test('Should create desk on init', function(){
        equal(MessyDesk.DeskController.name, DEFAULT_NAME);
    });

    test('Should change desk name', function(){
        var NEW_NAME = 'new name',
            nameField = MessyDesk.NameField.create();

        equal(MessyDesk.DeskController.name, DEFAULT_NAME);

        nameField.change({
            srcElement: {
                value: NEW_NAME
            }
        });

        equal(MessyDesk.DeskController.name, NEW_NAME);
    });

    test('Deleting existing desk creates new desk', function(){
        var NEW_NAME = 'new name',
            nameField = MessyDesk.NameField.create();

        nameField.change({
            srcElement: {
                value: NEW_NAME
            }
        });

        equal(MessyDesk.DeskController.name, NEW_NAME);

        MessyDesk._view.deleteDesk();

        equal(MessyDesk.DeskController.name, DEFAULT_NAME);
    });

    test('Should initialize desk with 0 items', function(){
        equal(MessyDesk.DeskController.content.length, 0);
    });

    test('Should add item to desk', function(){
        MessyDesk.DeskController.createItem({
            left: 42,
            top: 0,
            width: 0,
            height: 0
        });
        equal(MessyDesk.DeskController.content.length, 1);
        equal(MessyDesk.DeskController.content[0].name, 'AnItem');
    });

    test('Should add multiple items to desk', function(){
        MessyDesk.DeskController.createItem({
            x: 42,
            y: 0,
            width: 0,
            height: 0
        });
        MessyDesk.DeskController.createItem({
            left: 42,
            top: 42,
            width: 0,
            height: 0
        });
        equal(MessyDesk.DeskController.content.length, 2);
        equal(MessyDesk.DeskController.content[0].name, 'AnItem');
        equal(MessyDesk.DeskController.content[1].top, 42);
    });

    test('Should create item views', function(){
        var item = MessyDesk.DeskController.createItem({
            left: 42,
            top: 0,
            width: 0,
            height: 0
        });
        MessyDesk.createItemView(item);
        equal(MessyDesk._itemViews.length, 1);
        equal(MessyDesk._itemViews[0].left, 42);
    });

    test('Should remove items when deleting desk', function(){
        MessyDesk.DeskController.createItem({
            left: 42,
            top: 0,
            width: 0,
            height: 0
        });
        MessyDesk.DeskController.createItem({
            left: 42,
            top: 42,
            width: 0,
            height: 0
        });
        MessyDesk._view.deleteDesk();
        equal(MessyDesk.DeskController.content.length, 0);
    });

    test('Should remove item views when deleting desk', function(){
        var item = MessyDesk.DeskController.createItem({
            left: 42,
            top: 0,
            width: 0,
            height: 0
        });
        MessyDesk.createItemView(item);
        MessyDesk._view.deleteDesk();
        equal(MessyDesk._itemViews.length, 0);
    });
})();