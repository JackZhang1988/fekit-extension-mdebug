var fs = require('fs');
var syspath = require('path');
var os=require('os');
var ifaces=os.networkInterfaces();
var baselib = syspath.join( module.parent.filename , '../' );
var utils = require( syspath.join( baselib , 'util'  ) );
var weinre = require('weinre');

var linkTag='qunarzz.com';
var LINK_REG=/<[link|script].*[href|src]=.*(\/\/qunarzz.com\/)([\s\S]*)>/ig;
var IP = getLocalHost()[0];
var PORT;
var localhostAddr;
var WEINRE_SERVER= 9001;
var currentStatus='add'; // 当前默认状态

// 得到本机ip地址，默认取第一个
function getLocalHost(){
	var localIpList=[];
	for (var dev in ifaces) {
	  var alias=0;
	  ifaces[dev].forEach(function(details){
	    if (details.family=='IPv4' && details.internal == false) {
	      localIpList.push(details.address);
	    }
	  });
	}
	return localIpList;
}

function replaceLink(htmlFile, replaceReg, replaceStr){
	var localhost =PORT? (IP+':'+PORT):IP;
	var result = htmlFile.replace(LINK_REG,function(match){
		return match.replace(replaceReg,replaceStr);
	});
	// console.log('replaced html: ',result);
	return result;
}	
function handleFile(path,options){
	utils.logger.log(path);
	if( syspath.extname(path) !== '.html' && syspath.extname(path) !== '.htm') return;
	var htmlFile = result = fs.readFileSync(path).toString();
	if(!LINK_REG.test(htmlFile)) return;
	if(currentStatus=='add'){
		result = replaceLink(htmlFile,new RegExp(linkTag,'ig'),localhostAddr);
		if(options.w){
			// 植入weinre js代码
			result +="\n <script id='weinreServer'>\n  var url = 'http://'+location.host.replace(/\:\\d+/, '') +':9001'+ '/target/target-script-min.js#anonymous' \n  var script = document.createElement('script');\n  script.src = url;\n  var head = document.head;\n  if(head){\n    head.appendChild(script);\n  }\n  \n</script>";
		}
	}else if(currentStatus == 'revert'){
		//ip地址改为qunarzz.com, 同时去除weinre
		result = replaceLink(htmlFile,new RegExp(localhostAddr,'ig'),linkTag);
		result.replace(/<script\sid=\'weinreServer'>[\s\S]*<\/script>/gi,'');
	}
	fs.writeFileSync(path,result);
}
exports.usage = "替换qunarzz为本机ip，方便手机访问，增加weinre库";

exports.set_options = function( optimist ){
	optimist.alias('i','ip');
	optimist.describe('ip','指定转换的IP地址')
    optimist.alias('p', 'port');
    optimist.describe('port', '指定端口号');
    optimist.alias('w','weinre');
    optimist.describe('weinre','添加weinre server')
	optimist.alias('r','revert');
	optimist.describe('revert','revert html 文件，替换本地ip为qunarzz, 移除weinre');
	optimist.alias('f','file');
	optimist.describe('file','指定要替换的文件');
    return optimist
}
function run( options ){
	if(options.i){
		IP = options.i;
	}
	if(options.p){
		PORT = options.p;
	}
	localhostAddr = PORT? (IP+':'+PORT):IP;
	if(options.r){
		// revert 状态
		currentStatus='revert';
		LINK_REG=new RegExp("<[link|script].*[href|src]=.*(\\/\\/"+localhostAddr+"\\/)([\\s\\S]*)>","ig");
	}
	utils.logger.log('mobile debug 启动');
	if(options.f){
		handleFile(options.f,options);
		return;
	}
	utils.path.each_directory( process.cwd() ,function(path){
		handleFile(path,options);
	},true);
}
function main(options){
	run(options);
	if(options.w){
		// 启动weinre服务器
		weinre.run({
			httpPort: 9001,
			boundHost: '-all-',
			verbose: false,
			debug: false,
			readTimeout: 20,
			deathTimeout: 50
		});
		utils.logger.log('weinre run at localhost:9001');
	}
	utils.logger.log('done');
}
exports.run = main;