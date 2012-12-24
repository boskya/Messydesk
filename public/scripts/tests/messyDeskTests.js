(function(){
    var DEFAULT_NAME = 'MyMess';

	module('messy desk view tests');

	test('Should initialize new DeskView', function(){
        var view = MessyDesk.DeskView.create({
            name: DEFAULT_NAME
        });
		equal(view.name, DEFAULT_NAME);
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
})();