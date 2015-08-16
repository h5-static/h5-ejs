var Tpl = require("../util/tpl");
var EJS = require("ejs");
var jsTemplate = '<script async src="<%- value%>"></script>'
var Log = require('log')
  ,log = new Log('info');
var CORTEXT_JSON = "cortex.json";
var path = require("path");
var fs = require("fs");

function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

function tryCatch(cb,content){
	try{
		cb()
	}catch(e){
		log.info(content);
	}
}

module.exports = function(options){
	var comboJsStr = "";
	var isCombo = options.combo || false;
	
	return function(jsStr){
					
		if(!isCombo){
			var cortexJson;
			var dep = [];

			tryCatch(function(){
				cortexJson = JSON.parse(stripBOM(fs.readFileSync(path.join(options.cwd,CORTEXT_JSON),"utf8")));;

			},"cortex.json文件解析失败");

			['dependencies', 'devDependencies'].forEach(function(item){
				if (cortexJson.hasOwnProperty(item)) {
					for(key in cortexJson[item])
						dep.push(key);
			    }
			});

			comboJsStr =  EJS.render(jsTemplate,{
				value:EJS.render(Tpl.combo,{
					value:dep.join(",")
				})
			});
			
		}
		return comboJsStr + EJS.render(Tpl.facade,{
			value:jsStr
		})
	}
}