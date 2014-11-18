var fs = require('fs');
var syspath = require('path');
var os=require('os');
var ifaces=os.networkInterfaces();
var baselib = syspath.join( module.parent.filename , '../' );
var utils = require( syspath.join( baselib , 'util'  ) );
// var mdebug = require('./mdebug.js');


var LINK_REG=/<[link|script].*[href|src]=.*(\/\/qunarzz.com\/).*>$/ig;
var IP = getLocalHost()[0];
var PORT;
var WEINRE_SERVER= 8090;

function getLocalHost(){
	var localIpList=[];
	for (var dev in ifaces) {
	  var alias=0;
	  // console.log('dev ',ifaces[dev]);
	  ifaces[dev].forEach(function(details){
	    if (details.family=='IPv4' && details.internal == false) {
	      // console.log(dev,details.address);
	      localIpList.push(details.address);
	    }
	  });
	}
	return localIpList;
}

function replaceLink(htmlFile,path){
	htmlFile.replace(LINK_REG,function(match){
		return match.replace(/qunarzz.com/ig,PORT? (IP+':'+PORT):IP);
	});
	return htmlFile;
}


exports.usage = "替换qunarzz为本机ip，方便手机访问，增加weinre库";

exports.set_options = function( optimist ){
	optimist.alias('i','ip');
	optionst.describe('ip','指定转换的IP地址')
    optimist.alias('p', 'port');
    optimist.describe('port', '指定端口号');
    optimist.alias('w','weinre');
    optimist.describe('weinre','添加weinre server')
	optimist.alias('r','revert');
	optimist.describe('revert','revert html 文件，替换本地ip为qunarzz, 移除weinre');
    return optimist
}

exports.run = function( options ){
	if(options.revert){
		return;
	}
	if(options.ip){
		IP = options.ip;
	}
	if(options.port){
		PORT = options.port;
	}
	utils.logger.log('mobile debug 启动');
	utils.path.each_directory( process.cwd() ,function(path){
		if( syspath.extname(path) !== '.html' || syspath.extname(path) !== '.htm') return;
		var htmlFile = replaceLink(s.readFileSync(path).toString(),path);
		if(options.weinre){
			htmlFile + ="<script id='weinreServer'>\n  var url = 'http://'+location.host.replace(/\:\\d+/, '') +':9001'+ '/target/target-script-min.js#anonymous' \n  var script = document.createElement('script');\n  script.src = url;\n  var head = document.head;\n  if(head){\n    head.appendChild(script);\n  }\n  \n</script>";
		}
		fs.writeFileSync(path,result);

		utils.logger.log('done');
	},true);
}