var imageManipulation = require("./image-manipulation/image-manipulation");
var imageSource = require("image-source");
var http = require("http");
var observable = require("data/observable");
var meme = new observable.Observable();
var socialShare = require("nativescript-social-share");

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = meme;
};

exports.navigatedTo = function(args) {
	var page = args.object;
	var context = page.navigationContext;

	http.getImage(context.url).then(function(res) {
		meme.set("rawImage", res);
		meme.set("image", res);
		meme.set("topText", "");
		meme.set("bottomText", "");
		meme.set("fontSize", 40);
		meme.set("isBlackText", false);
	}, function() {
		alert("Loading the image failed");
	});
};

exports.unloaded = function() {
	meme.set("image", null);
};

meme.addEventListener("propertyChange", function(changes) {
	if (changes.propertyName === "image") {
		return;
	}

	var image = imageManipulation.addText({
		image: meme.get("rawImage"),
		topText: meme.get("topText"),
		bottomText: meme.get("bottomText"),
		fontSize: meme.get("fontSize"),
		isBlackText: meme.get("isBlackText")
	});
	meme.set("image", image);
});

exports.share = function() {
	socialShare.shareImage(meme.get("image"));
};