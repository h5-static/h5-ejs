var Tpl = require("../util/tpl");

module.exports = function(options){
	return function(){
		return Tpl.version;
	}
}