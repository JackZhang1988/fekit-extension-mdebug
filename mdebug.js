var os=require('os');
var ifaces=os.networkInterfaces();
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
console.log(getLocalHost());
console.log('node run');