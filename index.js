var EJS = require("ejs");
var Tool = require("./util/tool");
var configFn = require("./util/config");
var Log = require('log')
  ,log = new Log('info');
var fs = require("fs");
var handler = ["CSS","JS","VERSION"];

HCompile = function(fileContent,options){
	var self = this;
	// 加载配置项
	self.options = options = Tool.mix(options,configFn());

	// 加载处理器
	self.options = options = Tool.mix(options || {},self._loadHandler());
	debugger;
	return EJS.render(fileContent,self.options)
}

HCompile.prototype._loadHandler = function(){
	var result = {};
	var self = this;
	return (handler.forEach(function(item){
		try{
			result[item] = require("./handler/"+item.toLowerCase())(self.options);
		}catch(e){
			log.info(item+"并没有");
		}
	}),result);
}

new HCompile(fs.readFileSync("./test.html","utf-8"));

module.exports = HCompile;