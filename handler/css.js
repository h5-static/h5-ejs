var Tpl = require("../util/tpl");
var compiler = require("gulp-cortex-handlebars-compiler");
var cssTemplate = '<link rel="stylesheet" href="<%- value %>" >';
var EJS  = require("ejs");
var Tool = require("../util/tool");

module.exports = function(options){
	var isCombo = options.combo || false;
	return function(cssStr){
		// combo处理
		if(isCombo){
			return  EJS.render(cssTemplate,{
				value:EJS.render(Tpl.combo,{
					value:cssStr
				})
			})  
		}else{
			var cssArr = cssStr.split(",");
			var result = [];

			cssArr.forEach(function(item){
				result.push(EJS.render(cssTemplate,{
					value:EJS.render(Tool.isRelative(item)?Tpl.static:Tpl.modfile,{
						value:item
					})
				}) )
			})
			return result.join("\n");
		}
	}
}