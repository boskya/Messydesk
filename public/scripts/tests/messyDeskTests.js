(function(){
	module('messy desk view tests');

	test('Should initialize new DeskView', function(){
        var VIEW_NAME = 'MyMess';
        var view = MessyDesk.DeskView.create({
            name: VIEW_NAME
        });
		equal(view.name, VIEW_NAME);
	});
})();