var EJS = require("ejs");
var Tool = require("./util/tool");
var configFn = require("./util/config");
var Log = require('log')
  ,log = new Log('info');
var fs = require("fs");
var handler = ["CSS","JS","VERSION"];
var async = require("async");

HCompile = function(fileContent,options,callback){
	var self = this;
	// 加载配置项
	self.options = options = Tool.mix(options,configFn());

	// 加载处理器
	self.result = {};

	async.each(handler,function(item,cb){
		self._loadHandler.call(self,item,cb);
	}, function(err){
		if(err){
			log.info(err);
		}else{
			self.options = options = Tool.mix(options || {},self.result);
			callback(new Buffer(EJS.render(fileContent,self.options)))
		}
	});
}

HCompile.prototype._loadHandler = function(item,cb){
	var self = this;
	var result = self.result;
	require("./handler/"+item.toLowerCase())(self.options,function(handler){
		result[item] = handler;
		cb();
	});
}


module.exports = HCompile;