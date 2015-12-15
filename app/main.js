// https://gist.github.com/tjvantoll/35d970f511f094827be4

var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");
var moment = require("moment");

var model = new observableModule.Observable();
model.reddit = new observableArrayModule.ObservableArray([]);
var url = "https://www.reddit.com/r/aww.json?after=";
var after;

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = model;
	if (page.ios) {
		var navBar = page.ios.navigationController.navigationBar;
		navBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.81, 0.89, 0.97, 1);
	}
	loadItems();
};

function loadItems() {
	fetch(url + after)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			after = response.data.after;
			response.data.children.forEach(function(item) {
				if (item.data.url.match(/.jpg/)) {
					model.reddit.push({
						title: item.data.title,
						url: item.data.url,
						time: moment(item.data.created_utc * 1000).fromNow()
					});
				}
			});
		});
};

exports.loadMoreItems = function() {
	loadItems();
};

exports.itemTap = function(args) {
	var item = model.reddit.getItem(args.index);
	frameModule.topmost().navigate({
		moduleName: "meme",
		context: item
	});
};
