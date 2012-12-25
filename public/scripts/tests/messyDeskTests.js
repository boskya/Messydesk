(function(){
    var DEFAULT_NAME = 'MyMess';

	module('messy desk view tests');

	test('Should initialize new DeskView', function(){
        var view = MessyDesk.DeskView.create({
            name: DEFAULT_NAME
        });
		equal(view.name, DEFAULT_NAME);
	});

    test('Should create desk on init', function(){
        MessyDesk.createDesk();

        equal(MessyDesk._view.name, DEFAULT_NAME);
        equal(MessyDesk.MyDesk.name, DEFAULT_NAME);
    });

    test('Should change desk name', function(){
        MessyDesk.MyDesk = MessyDesk.Desk.create({
            name: DEFAULT_NAME
        });
        var NEW_NAME = 'new name',
            nameField = MessyDesk.Name.create();

        nameField.change({
            srcElement: {
                value: NEW_NAME
            }
        });

        equal(MessyDesk.MyDesk.name, NEW_NAME);
    });

    test('Deleting existing desk creates new desk', function(){
        var NEW_NAME = 'new name',
            view = MessyDesk.DeskView.create();

        MessyDesk.MyDesk = MessyDesk.Desk.create({
            name: NEW_NAME
        });

        equal(MessyDesk.MyDesk.name, NEW_NAME);

        view.deleteDesk();

        equal(MessyDesk.MyDesk.name, DEFAULT_NAME);
    });
})();