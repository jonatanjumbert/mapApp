/**
 * @author Aitor Alsina
 */
var ActivityIndicator = {
	create : function(_args) {
		var style = (Ti.Platform.name === 'iPhone OS') ? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK;
		var activityIndicator = Ti.UI.createActivityIndicator({
			message : _args.message,
			color : _args.color,
			font : {
				fontSize : 16
			},
			style : style,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});
		return activityIndicator;
	}
};
exports.getObj = ActivityIndicator; 