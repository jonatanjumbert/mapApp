/**
 * @author Jonatan Jumbert
 */
var CustomDialog = {
	error : function(args) {
		var dialog = Ti.UI.createAlertDialog({
			message: args.message,
			ok: L('GLOBAL_OK'),
			title: L('GLOBAL_ERROR')
		});
		dialog.show();
	},
	info : function(args) {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 0,
			buttonNames: [L('TAB2_GO_MARKER'), L('TAB2_GO_MAP')],
		    message: L('TAB2_SAVED_MSG'),
		    title: L('TAB2_SAVED_OK')
		});
		dialog.addEventListener('click', function(e) {
			// Borramos los valores de los textFields para que añada otro marcador
			if(typeof(args.buttons) !== "undefined") {
				for(var i = 0; i < args.buttons.length; i++) {
					args.buttons[i].setValue('');
				}
			}
			
			if (e.index !== e.source.cancel) {
			 	// Cambiamos al tab del mapa
			 	Ti.App.MapAppTabgroup.setActiveTab(0);
			}
		});
		dialog.show();
	},
	confirm : function(args) {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 0,
			buttonNames: [L('GLOBAL_CANCEL'), L('GLOBAL_OK')],
		    message: L('TAB1_DELETE_MARKERS_MSG'),
		    title: L('TAB1_DELETE_MARKERS')
		});
		dialog.addEventListener('click', function(e) {		
			if (e.index !== e.source.cancel) {
			 	// Si confirma la acción eliminamos los marcadores
			 	Ti.App.fireEvent('confirm_delete_markers');
			}
		});
		dialog.show();
	}
};
exports.getObj = CustomDialog; 