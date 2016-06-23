var colors = require('colors'),
	casper = require('casper').create(),
	$ = require('jquery');

//var config = fs.readFileSync('./config.json');


//return console.dir(config);

var data = {};

console.log('booting up!');

casper.start('http://deshalit.iscool.co.il/', function() {
	console.log('\tfetched main page');
	id = this.getElementsInfo('#dnn_ContentPane a')[0].attributes.name;
	console.log('\t\tgot controller id', id);
	console.log('\t\tnow filling form');
    this.fillSelectors('form', {
    	'select': '21'
    }, true);
});

casper.then(function(){
	console.log('\tswitching to the changes table')
	this.click('#dnn_ctr' + id + '_TimeTableView_btnChangesTable')
})

var goOneWeekBack = function(){
	console.log('\t\tgoing back a week');
	this.click('#dnn_ctr' + id + '_TimeTableView_MainControl_prevweek')

};

//casper.then(goOneWeekBack);
//casper.then(goOneWeekBack);
//casper.then(goOneWeekBack);
var compChanges = [];
casper.then(function(){
	console.log('\tnow parsing changes table')
	var changes = [];
	this.waitForSelector('.TTTable', function(){
		console.log('\t\tselected changes table')
		var table = $(this.getElementsInfo('.TTTable')[0].html);
		var currentIndex = 0;
		var currentDay = 0;
		table.find('tr').each(function(){
			currentIndex = $(this).find('td b').html();
			console.log('\t\tlooking at period', currentIndex);
			if(!currentIndex)
				return console.log('\t\t\tcurrent period is undefined (why?)'.red);
			currentDay = 0;
			$(this).find('td.TTCell').each(function(){
				console.log('\t\t\tlooking at day', currentDay);
				currentDay++;
				var changeEnt = $(this).find('table');
				if(changeEnt.html() !== ''){
					console.warn(('\t\t\t\tgot change on the ' + currentDay + 'th day, in hour ' + currentIndex).green.bold);
					//var change = '';
					var change = changeEnt.find('td.TableFreeChange').text() ||  changeEnt.find('td.TableFillChange').text();
					compChanges.push(change)
					console.log('\t\t\t\tchange is %s', change);
				}
			})
		});
		require('fs').write('./safta', compChanges.join('\r\n'))
	});
});


casper.run();