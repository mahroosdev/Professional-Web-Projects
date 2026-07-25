/* Apply saved theme, defaulting to White for V1.0 */
(function(){
  var valid={white:1,qrix:1};
  var aliases={black:'white',obsidian:'white',blue:'white',aerium:'white',gold:'white',jewel:'white',purple:'qrix'};
  var saved=localStorage.getItem('nexaScanSuiteTheme')||'white';
  saved=aliases[saved]||saved;
  document.documentElement.setAttribute('data-theme',valid[saved]?saved:'white');
})();;

var QRCode=(function(){"use strict";
var QRMode={MODE_NUMBER:1<<0,MODE_ALPHA_NUM:1<<1,MODE_8BIT_BYTE:1<<2,MODE_KANJI:1<<3};
var QRErrorCorrectLevel={L:1,M:0,Q:3,H:2};
var QRMaskPattern={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};
var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0),G18:(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0),G15_MASK:(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1),
getBCHTypeInfo:function(data){var d=data<<10;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)>=0){d^=(QRUtil.G15<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)));}return((data<<10)|d)^QRUtil.G15_MASK;},
getBCHTypeNumber:function(data){var d=data<<12;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)>=0){d^=(QRUtil.G18<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)));}return(data<<12)|d;},
getBCHDigit:function(data){var digit=0;while(data!=0){digit++;data>>>=1;}return digit;},
getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1];},
getMask:function(maskPattern,i,j){switch(maskPattern){case QRMaskPattern.PATTERN000:return(i+j)%2==0;case QRMaskPattern.PATTERN001:return i%2==0;case QRMaskPattern.PATTERN010:return j%3==0;case QRMaskPattern.PATTERN011:return(i+j)%3==0;case QRMaskPattern.PATTERN100:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case QRMaskPattern.PATTERN101:return(i*j)%2+(i*j)%3==0;case QRMaskPattern.PATTERN110:return((i*j)%2+(i*j)%3)%2==0;case QRMaskPattern.PATTERN111:return((i*j)%3+(i+j)%2)%2==0;default:throw new Error("bad maskPattern:"+maskPattern);}},
getErrorCorrectPolynomial:function(errorCorrectLength){var a=new QRPolynomial([1],0);for(var i=0;i<errorCorrectLength;i++){a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));}return a;},
getLengthInBits:function(mode,type){if(1<=type&&type<10){switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode);}}else if(type<27){switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode);}}else if(type<41){switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode);}}else{throw new Error("type:"+type);}},
getLostPoint:function(qrCode){var moduleCount=qrCode.getModuleCount();var lostPoint=0;for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount;col++){var sameCount=0;var dark=qrCode.isDark(row,col);for(var r=-1;r<=1;r++){if(row+r<0||moduleCount<=row+r){continue;}for(var c=-1;c<=1;c++){if(col+c<0||moduleCount<=col+c){continue;}if(r==0&&c==0){continue;}if(dark==qrCode.isDark(row+r,col+c)){sameCount++;}}}if(sameCount>5){lostPoint+=(3+sameCount-5);}}}for(var row=0;row<moduleCount-1;row++){for(var col=0;col<moduleCount-1;col++){var count=0;if(qrCode.isDark(row,col)){count++;}if(qrCode.isDark(row+1,col)){count++;}if(qrCode.isDark(row,col+1)){count++;}if(qrCode.isDark(row+1,col+1)){count++;}if(count==0||count==4){lostPoint+=3;}}}for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount-6;col++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6)){lostPoint+=40;}}}for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount-6;row++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col)){lostPoint+=40;}}}var darkCount=0;for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount;row++){if(qrCode.isDark(row,col)){darkCount++;}}}var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;lostPoint+=ratio*10;return lostPoint;}};
var QRMath={glog:function(n){if(n<1){throw new Error("glog("+n+")");}return QRMath.LOG_TABLE[n];},gexp:function(n){while(n<0){n+=255;}while(n>=256){n-=255;}return QRMath.EXP_TABLE[n];},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};
for(var i=0;i<8;i++){QRMath.EXP_TABLE[i]=1<<i;}for(var i=8;i<256;i++){QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];}for(var i=0;i<255;i++){QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;}
function QRPolynomial(num,shift){if(num.length==undefined){throw new Error(num.length+"/"+shift);}var offset=0;while(offset<num.length&&num[offset]==0){offset++;}this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++){this.num[i]=num[i+offset];}}
QRPolynomial.prototype={get:function(index){return this.num[index];},getLength:function(){return this.num.length;},multiply:function(e){var num=new Array(this.getLength()+e.getLength()-1);for(var i=0;i<this.getLength();i++){for(var j=0;j<e.getLength();j++){num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));}}return new QRPolynomial(num,0);},mod:function(e){if(this.getLength()-e.getLength()<0){return this;}var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0));var num=new Array(this.getLength());for(var i=0;i<this.getLength();i++){num[i]=this.get(i);}for(var i=0;i<e.getLength();i++){num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);}return new QRPolynomial(num,0).mod(e);}};
function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount;this.dataCount=dataCount;}
QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];
QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(rsBlock==undefined){throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);}var length=rsBlock.length/3;var list=[];for(var i=0;i<length;i++){var count=rsBlock[i*3+0];var totalCount=rsBlock[i*3+1];var dataCount=rsBlock[i*3+2];for(var j=0;j<count;j++){list.push(new QRRSBlock(totalCount,dataCount));}}return list;};
QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+3];default:return undefined;}};
function QRBitBuffer(){this.buffer=[];this.length=0;}
QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return((this.buffer[bufIndex]>>>(7-index%8))&1)==1;},put:function(num,length){for(var i=0;i<length;i++){this.putBit(((num>>>(length-i-1))&1)==1);}},getLengthInBits:function(){return this.length;},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex){this.buffer.push(0);}if(bit){this.buffer[bufIndex]|=(0x80>>>(this.length%8));}this.length++;}};
function QR8bitByte(data){this.mode=QRMode.MODE_8BIT_BYTE;this.data=data;this.parsedData=[];for(var i=0,l=this.data.length;i<l;i++){var byteArray=[];var code=this.data.charCodeAt(i);if(code>0xFFFF){code-=0x10000;byteArray[0]=0xD800|(code>>>10);byteArray[1]=0xDC00|(code&0x3FF);}else{byteArray[0]=code;}this.parsedData.push(byteArray);}this.parsedData=Array.prototype.concat.apply([],this.parsedData);if(this.parsedData.length!=this.data.length){this.parsedData.unshift(191);this.parsedData.unshift(187);this.parsedData.unshift(239);}}
QR8bitByte.prototype={getLength:function(){return this.parsedData.length;},write:function(buffer){for(var i=0,l=this.parsedData.length;i<l;i++){buffer.put(this.parsedData[i],8);}}};
function QRCodeModel(typeNumber,errorCorrectLevel){this.typeNumber=typeNumber;this.errorCorrectLevel=errorCorrectLevel;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[];}
QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData);this.dataCache=null;},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col){throw new Error(row+","+col);}return this.modules[row][col];},getModuleCount:function(){return this.moduleCount;},make:function(){if(this.typeNumber<1){var typeNumber=1;for(;typeNumber<40;typeNumber++){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,this.errorCorrectLevel);var buffer=new QRBitBuffer();var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++){totalDataCount+=rsBlocks[i].dataCount;}for(var i=0;i<this.dataList.length;i++){var data=this.dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}if(buffer.getLengthInBits()<=totalDataCount*8){break;}}this.typeNumber=typeNumber;}this.makeImpl(false,this.getBestMaskPattern());},makeImpl:function(test,maskPattern){this.moduleCount=this.typeNumber*4+17;this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++){this.modules[row][col]=null;}}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(test,maskPattern);if(this.typeNumber>=7){this.setupTypeNumber(test);}if(this.dataCache==null){this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);}this.mapData(this.dataCache,maskPattern);},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++){if(row+r<=-1||this.moduleCount<=row+r){continue;}for(var c=-1;c<=7;c++){if(col+c<=-1||this.moduleCount<=col+c){continue;}if((0<=r&&r<=6&&c==0)||(0<=r&&r<=6&&c==6)||(r==0&&0<=c&&c<=6)||(r==6&&0<=c&&c<=6)||(2<=r&&r<=4&&2<=c&&c<=4)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}},getBestMaskPattern:function(){var minLostPoint=0;var pattern=0;for(var i=0;i<8;i++){this.makeImpl(true,i);var lostPoint=QRUtil.getLostPoint(this);if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}}return pattern;},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++){if(this.modules[r][6]!=null){continue;}this.modules[r][6]=(r%2==0);}for(var c=8;c<this.moduleCount-8;c++){if(this.modules[6][c]!=null){continue;}this.modules[6][c]=(c%2==0);}},setupPositionAdjustPattern:function(){var pos=QRUtil.getPatternPosition(this.typeNumber);for(var i=0;i<pos.length;i++){for(var j=0;j<pos.length;j++){var row=pos[i];var col=pos[j];if(this.modules[row][col]!=null){continue;}for(var r=-2;r<=2;r++){for(var c=-2;c<=2;c++){if(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}}}},setupTypeNumber:function(test){var bits=QRUtil.getBCHTypeNumber(this.typeNumber);for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;}for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod;}},setupTypeInfo:function(test,maskPattern){var data=(this.errorCorrectLevel<<3)|maskPattern;var bits=QRUtil.getBCHTypeInfo(data);for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<6){this.modules[i][8]=mod;}else if(i<8){this.modules[i+1][8]=mod;}else{this.modules[this.moduleCount-15+i][8]=mod;}}for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<8){this.modules[8][this.moduleCount-i-1]=mod;}else if(i<9){this.modules[8][15-i-1+1]=mod;}else{this.modules[8][15-i-1]=mod;}}this.modules[this.moduleCount-8][8]=(!test);},mapData:function(data,maskPattern){var inc=-1;var row=this.moduleCount-1;var bitIndex=7;var byteIndex=0;for(var col=this.moduleCount-1;col>0;col-=2){if(col==6){col--;}while(true){for(var c=0;c<2;c++){if(this.modules[row][col-c]==null){var dark=false;if(byteIndex<data.length){dark=(((data[byteIndex]>>>bitIndex)&1)==1);}var mask=QRUtil.getMask(maskPattern,row,col-c);if(mask){dark=!dark;}this.modules[row][col-c]=dark;bitIndex--;if(bitIndex==-1){byteIndex++;bitIndex=7;}}}row+=inc;if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}}}},};
QRCodeModel.PAD0=0xEC;QRCodeModel.PAD1=0x11;
QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel);var buffer=new QRBitBuffer();for(var i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++){totalDataCount+=rsBlocks[i].dataCount;}if(buffer.getLengthInBits()>totalDataCount*8){throw new Error("code length overflow. ("+buffer.getLengthInBits()+">"+totalDataCount*8+")");}if(buffer.getLengthInBits()+4<=totalDataCount*8){buffer.put(0,4);}while(buffer.getLengthInBits()%8!=0){buffer.putBit(false);}while(true){if(buffer.getLengthInBits()>=totalDataCount*8){break;}buffer.put(QRCodeModel.PAD0,8);if(buffer.getLengthInBits()>=totalDataCount*8){break;}buffer.put(QRCodeModel.PAD1,8);}return QRCodeModel.createBytes(buffer,rsBlocks);};
QRCodeModel.createBytes=function(buffer,rsBlocks){var offset=0;var maxDcCount=0;var maxEcCount=0;var dcdata=new Array(rsBlocks.length);var ecdata=new Array(rsBlocks.length);for(var r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount;var ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount);maxEcCount=Math.max(maxEcCount,ecCount);dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++){dcdata[r][i]=0xff&buffer.buffer[i+offset];}offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount);var rawPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1);var modPoly=rawPoly.mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=(modIndex>=0)?modPoly.get(modIndex):0;}}var totalCodeCount=0;for(var i=0;i<rsBlocks.length;i++){totalCodeCount+=rsBlocks[i].totalCount;}var data=new Array(totalCodeCount);var index=0;for(var i=0;i<maxDcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<dcdata[r].length){data[index++]=dcdata[r][i];}}}for(var i=0;i<maxEcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<ecdata[r].length){data[index++]=ecdata[r][i];}}}return data;};
var QRCode={};
QRCode.toCanvas=function(canvas,text,options,callback){try{var opt=options||{};var ecMap={L:QRErrorCorrectLevel.L,M:QRErrorCorrectLevel.M,Q:QRErrorCorrectLevel.Q,H:QRErrorCorrectLevel.H};var ecl=ecMap[opt.errorCorrectionLevel]!==undefined?ecMap[opt.errorCorrectionLevel]:QRErrorCorrectLevel.M;var size=opt.width||256;var colorDark=(opt.color&&opt.color.dark)||'#000000';var colorLight=(opt.color&&opt.color.light)||'#ffffff';var qr=new QRCodeModel(-1,ecl);qr.addData(text);qr.make();var count=qr.getModuleCount();var cell=size/count;canvas.width=size;canvas.height=size;var ctx=canvas.getContext('2d');ctx.fillStyle=colorLight;ctx.fillRect(0,0,size,size);for(var r=0;r<count;r++){for(var c=0;c<count;c++){ctx.fillStyle=qr.isDark(r,c)?colorDark:colorLight;var x=Math.floor(c*cell),y=Math.floor(r*cell);var w=Math.ceil((c+1)*cell)-x,h=Math.ceil((r+1)*cell)-y;ctx.fillRect(x,y,w,h);}}if(callback)callback(null);}catch(e){if(callback)callback(e);}};
return QRCode;
})();

/* jsQR — QR decode engine for live cam & file upload */
(function(){var s=document.createElement('script');s.src='assets/vendor/jsQR.min.js';s.async=true;s.onerror=function(){console.warn('jsQR local decoder failed to load');};document.head.appendChild(s);}());;

/* Stubs so inline mobile handlers never throw on desktop */
['mobSyncSize','mobSyncColor','mobSyncBCColor','mobSyncBCHeight','mobSyncBCScale',
 'mobSyncBCShowText','mobSyncBCInput','mobSetEC','mobSelectType','mobSelectFmt',
 'mobApplyQRPreset','mobApplyBCPreset','mobNavGo','mobDoGenQR','mobDoGenBC',
 'mobStartScan','mobStopScan','mobFlipCamera','mobScanAnother','mobApplyTheme',
 'mobSetMode','mobGenerate','mobToggleTheme'].forEach(function(fn){
  window[fn]=window[fn]||function(){};
});;

// ══════════════════════════════════════════════
// QR TYPE DEFINITIONS
// ══════════════════════════════════════════════
const SVG = {
  url:(function(){var t=document.documentElement.dataset.theme||'qrix';var c=t==='obsidian'?'#f59e0b':t==='aerium'?'#7eb8f7':t==='white'?'#4f6ef7':'#22d3ee';return`<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="${c}" stroke-width="1.3"/><ellipse cx="10" cy="10" rx="3.5" ry="7.5" stroke="${c}" stroke-width="1" stroke-dasharray="2 1.5"/><line x1="2.5" y1="10" x2="17.5" y2="10" stroke="${c}" stroke-width="1"/></svg>`})(),
  text:`<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="1.5" rx="0.75" fill="#a78bfa"/><rect x="3" y="7.5" width="11" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.8"/><rect x="3" y="11" width="14" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.6"/><rect x="3" y="14.5" width="8" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.4"/></svg>`,
  wifi:`<svg viewBox="0 0 20 20" fill="none"><path d="M2.5 8C5 5.2 7.3 4 10 4s5 1.2 7.5 4" stroke="#38bdf8" stroke-width="1.3" stroke-linecap="round"/><path d="M5 11c1.4-1.6 3-2.4 5-2.4s3.6.8 5 2.4" stroke="#38bdf8" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/><path d="M7.5 14c.7-.9 1.5-1.4 2.5-1.4s1.8.5 2.5 1.4" stroke="#38bdf8" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/><circle cx="10" cy="16.5" r="1.2" fill="#38bdf8"/></svg>`,
  vcard:`<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="#4ade80" stroke-width="1.2"/><circle cx="7" cy="10" r="2" stroke="#4ade80" stroke-width="1"/><line x1="11" y1="8.5" x2="15.5" y2="8.5" stroke="#4ade80" stroke-width="1" stroke-linecap="round"/><line x1="11" y1="11" x2="14" y2="11" stroke="#4ade80" stroke-width="1" stroke-linecap="round" opacity="0.6"/></svg>`,
  email:`<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="#f472b6" stroke-width="1.2"/><polyline points="2,6 10,11 18,6" stroke="#f472b6" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  phone:(function(){var t=document.documentElement.dataset.theme||'qrix';var c=t==='obsidian'?'#f59e0b':t==='aerium'?'#7eb8f7':t==='white'?'#4f6ef7':'#22d3ee';return`<svg viewBox="0 0 20 20" fill="none"><path d="M6 2.5h8a1.5 1.5 0 011.5 1.5v12A1.5 1.5 0 0114 17.5H6A1.5 1.5 0 014.5 16V4A1.5 1.5 0 016 2.5z" stroke="${c}" stroke-width="1.2"/><circle cx="10" cy="15" r="0.8" fill="${c}"/></svg>`})(),
  sms:`<svg viewBox="0 0 20 20" fill="none"><path d="M3 4.5h14a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 2.5V5.5a1 1 0 011-1z" stroke="#a78bfa" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  whatsapp:`<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#4ade80" stroke-width="1.2"/><path d="M7 10.5c.5 1.5 2 2.5 3.5 2.5 1 0 2-.4 2.7-1.1" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  event:`<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#fb923c" stroke-width="1.2"/><line x1="3" y1="8" x2="17" y2="8" stroke="#fb923c" stroke-width="1"/><line x1="7" y1="2" x2="7" y2="6" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/><line x1="13" y1="2" x2="13" y2="6" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  location:`<svg viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="#f472b6" stroke-width="1.2"/><circle cx="10" cy="8" r="2" stroke="#f472b6" stroke-width="1.1"/></svg>`,
  review:`<svg viewBox="0 0 20 20" fill="none"><polygon points="10,2.5 12.2,7.5 17.5,8 13.5,11.8 14.7,17 10,14.2 5.3,17 6.5,11.8 2.5,8 7.8,7.5" stroke="#facc15" stroke-width="1.1" stroke-linejoin="round" fill="none"/></svg>`,
  document:`<svg viewBox="0 0 20 20" fill="none"><path d="M5 2.5h7l4 4V17a.5.5 0 01-.5.5h-10A.5.5 0 015 17V2.5z" stroke="#38bdf8" stroke-width="1.2"/><path d="M12 2.5V6.5h4" stroke="#38bdf8" stroke-width="1" stroke-linejoin="round"/></svg>`,
  media:`<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="#a78bfa" stroke-width="1.2"/><polygon points="8,8 8,13 14,10.5" fill="#a78bfa" opacity="0.9"/></svg>`,
  freelance:`<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="1.5" stroke="#4ade80" stroke-width="1.2"/><path d="M7 7V5.5A3 3 0 0113 5.5V7" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  instagram:`<svg viewBox="0 0 20 20" fill="none"><path d="M10 2L13.5 5.5M10 2L6.5 5.5M10 2v10" stroke="#f472b6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="14" r="1.5" fill="#f472b6"/><path d="M5 17h10" stroke="#f472b6" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  upi:(function(){var t=document.documentElement.dataset.theme||'qrix';var c=t==='obsidian'?'#f59e0b':t==='aerium'?'#7eb8f7':t==='white'?'#4f6ef7':'#22d3ee';return`<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="${c}" stroke-width="1.2"/><line x1="2" y1="9" x2="18" y2="9" stroke="${c}" stroke-width="1"/></svg>`})(),
  crypto:`<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#facc15" stroke-width="1.2"/><path d="M8 7h3a2 2 0 010 4H8m3 0h-3a2 2 0 000 4h3" stroke="#facc15" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  app:(function(){var t=document.documentElement.dataset.theme||'qrix';var c=t==='obsidian'?'#d97706':t==='aerium'?'#60a5fa':t==='white'?'#3d59e8':'#8a5cf6';return`<svg viewBox="0 0 20 20" fill="none"><rect x="5.5" y="1.5" width="9" height="17" rx="2" stroke="${c}" stroke-width="1.2"/><circle cx="10" cy="15.5" r="0.9" fill="${c}"/></svg>`})(),
  totp:`<svg viewBox="0 0 20 20" fill="none"><rect x="4" y="8" width="12" height="9" rx="2" stroke="#fb923c" stroke-width="1.2"/><path d="M7 8V6a3 3 0 016 0v2" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/><circle cx="10" cy="12.5" r="1.5" fill="#fb923c" opacity="0.9"/></svg>`,
  json:`<svg viewBox="0 0 20 20" fill="none"><path d="M6 4.5C4.5 4.5 4 5 4 6.5v2C4 9.5 3 10 2.5 10 3 10 4 10.5 4 11.5v2C4 15 4.5 15.5 6 15.5" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/><path d="M14 4.5c1.5 0 2 .5 2 2v2c0 1 1 1.5 1.5 1.5C17 10 16 10.5 16 11.5v2c0 1-.5 1.5-2 1.5" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  custom:`<svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.5H18l-4.9 3.5 1.9 5.7L10 13.2 5 16.7l1.9-5.7L2 7.5h6.2z" stroke="#f472b6" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
};

const QR_CATEGORIES = [
  {label:'Essentials',types:[{id:'url',icon:SVG.url,label:'Website URL'},{id:'text',icon:SVG.text,label:'Plain Text'},{id:'wifi',icon:SVG.wifi,label:'WiFi Network'},{id:'vcard',icon:SVG.vcard,label:'Contact Card'}]},
  {label:'Communication',types:[{id:'email',icon:SVG.email,label:'Email'},{id:'phone',icon:SVG.phone,label:'Phone Number'},{id:'sms',icon:SVG.sms,label:'SMS Message'},{id:'whatsapp',icon:SVG.whatsapp,label:'WhatsApp'}]},
  {label:'Business & Events',types:[{id:'event',icon:SVG.event,label:'Calendar Event'},{id:'location',icon:SVG.location,label:'Location / Map'},{id:'review',icon:SVG.review,label:'Review Link'},{id:'document',icon:SVG.document,label:'Document / PDF'},{id:'media',icon:SVG.media,label:'Image / Video'}]},
  {label:'Freelance & Work',types:[{id:'freelance',icon:SVG.freelance,label:'Work Profile'},{id:'instagram',icon:SVG.instagram,label:'Social Link'}]},
  {label:'Payments & Finance',types:[{id:'upi',icon:SVG.upi,label:'UPI Payment'},{id:'crypto',icon:SVG.crypto,label:'Crypto Wallet'}]},
  {label:'Developer',types:[{id:'app',icon:SVG.app,label:'App Deep Link'},{id:'totp',icon:SVG.totp,label:'2FA / OTP Setup'},{id:'json',icon:SVG.json,label:'JSON Payload'},{id:'custom',icon:SVG.custom,label:'Custom Type',badge:'NEW'}]},
];
const QR_TYPES = QR_CATEGORIES.flatMap(c => c.types);

const FORMS = {
  url:`<div class="field-group"><label class="field-label">Website URL</label><input class="field-input" id="f_url" type="url" placeholder="https://example.com"/></div>`,
  text:`<div class="field-group"><label class="field-label">Text Content</label><textarea class="field-textarea" id="f_text" placeholder="Enter any text content…"></textarea></div>`,
  email:`<div class="field-group"><label class="field-label">Email Address</label><input class="field-input" id="f_email" type="email" placeholder="hello@example.com"/></div><div class="field-group"><label class="field-label">Subject (optional)</label><input class="field-input" id="f_email_sub" placeholder="Subject line"/></div><div class="field-group"><label class="field-label">Body (optional)</label><textarea class="field-textarea" id="f_email_body" placeholder="Email body…" style="min-height:70px"></textarea></div>`,
  phone:`<div class="field-group"><label class="field-label">Phone Number</label><input class="field-input" id="f_phone" type="tel" placeholder="+1 555 000 0000"/></div>`,
  sms:`<div class="row-2"><div class="field-group"><label class="field-label">Phone Number</label><input class="field-input" id="f_sms_phone" type="tel" placeholder="+1 555 000 0000"/></div><div class="field-group"><label class="field-label">Message</label><input class="field-input" id="f_sms_msg" placeholder="Message text…"/></div></div>`,
  whatsapp:`<div class="row-2"><div class="field-group"><label class="field-label">WhatsApp Number</label><input class="field-input" id="f_wa_phone" type="tel" placeholder="+1 555 000 0000"/></div><div class="field-group"><label class="field-label">Pre-filled Message</label><input class="field-input" id="f_wa_msg" placeholder="Hello!"/></div></div>`,
  wifi:`<div class="field-group"><label class="field-label">Network Name (SSID)</label><input class="field-input" id="f_wifi_ssid" placeholder="MyNetwork"/></div><div class="row-2"><div class="field-group"><label class="field-label">Password</label><div class="pw-wrap"><input class="field-input" id="f_wifi_pass" type="password" placeholder="Password"/><button class="pw-toggle" onclick="togglePw('f_wifi_pass',this)" tabindex="-1">👁</button></div></div><div class="field-group"><label class="field-label">Encryption</label><select class="field-select" id="f_wifi_enc"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None (Open)</option></select></div></div>`,
  vcard:`<div class="row-2"><div class="field-group"><label class="field-label">First Name</label><input class="field-input" id="f_vc_first" placeholder="Jane"/></div><div class="field-group"><label class="field-label">Last Name</label><input class="field-input" id="f_vc_last" placeholder="Doe"/></div></div><div class="row-2"><div class="field-group"><label class="field-label">Phone</label><input class="field-input" id="f_vc_phone" placeholder="+1 555 000 0000"/></div><div class="field-group"><label class="field-label">Email</label><input class="field-input" id="f_vc_email" type="email" placeholder="jane@example.com"/></div></div><div class="row-2"><div class="field-group"><label class="field-label">Company</label><input class="field-input" id="f_vc_org" placeholder="Acme Inc."/></div><div class="field-group"><label class="field-label">Job Title</label><input class="field-input" id="f_vc_title" placeholder="Designer"/></div></div><div class="field-group"><label class="field-label">Website</label><input class="field-input" id="f_vc_web" placeholder="https://janedoe.com"/></div>`,
  location:`<div class="row-2"><div class="field-group"><label class="field-label">Latitude</label><input class="field-input" id="f_lat" placeholder="40.7128"/></div><div class="field-group"><label class="field-label">Longitude</label><input class="field-input" id="f_lng" placeholder="-74.0060"/></div></div>`,
  event:`<div class="field-group"><label class="field-label">Event Title</label><input class="field-input" id="f_ev_title" placeholder="Team Meeting"/></div><div class="row-2"><div class="field-group"><label class="field-label">Start</label><input class="field-input" id="f_ev_start" type="datetime-local"/></div><div class="field-group"><label class="field-label">End</label><input class="field-input" id="f_ev_end" type="datetime-local"/></div></div><div class="field-group"><label class="field-label">Location</label><input class="field-input" id="f_ev_loc" placeholder="Conference Room"/></div>`,
  upi:`<div class="field-group"><label class="field-label">UPI ID</label><input class="field-input" id="f_upi_id" placeholder="user@upi"/></div><div class="row-2"><div class="field-group"><label class="field-label">Payee Name</label><input class="field-input" id="f_upi_name" placeholder="John Doe"/></div><div class="field-group"><label class="field-label">Amount (₹)</label><input class="field-input" id="f_upi_amount" type="number" placeholder="500"/></div></div>`,
  crypto:`<div class="field-group"><label class="field-label">Currency</label><select class="field-select" id="f_crypto_coin"><option value="bitcoin">Bitcoin (BTC)</option><option value="ethereum">Ethereum (ETH)</option><option value="litecoin">Litecoin (LTC)</option></select></div><div class="field-group"><label class="field-label">Wallet Address</label><input class="field-input" id="f_crypto_addr" placeholder="1A1zP1eP5QGefi2..."/></div>`,
  review:`<div class="field-group"><label class="field-label">Platform</label><select class="field-select" id="f_review_platform"><option value="google">Google Reviews</option><option value="yelp">Yelp</option><option value="trustpilot">Trustpilot</option><option value="custom">Custom URL</option></select></div><div class="field-group"><label class="field-label">Place ID or URL</label><input class="field-input" id="f_review_id" placeholder="Place ID or full URL"/></div>`,
  app:`<div class="field-group"><label class="field-label">App Store URL</label><input class="field-input" id="f_app_url" placeholder="https://apps.apple.com/…"/></div><div class="field-group"><label class="field-label">Deep Link (optional)</label><input class="field-input" id="f_app_deep" placeholder="myapp://screen/home"/></div>`,
  totp:`<div class="field-group"><label class="field-label">Account Name</label><input class="field-input" id="f_totp_account" placeholder="user@example.com"/></div><div class="row-2"><div class="field-group"><label class="field-label">Issuer</label><input class="field-input" id="f_totp_issuer" placeholder="GitHub"/></div><div class="field-group"><label class="field-label">Secret Key</label><input class="field-input" id="f_totp_secret" placeholder="BASE32SECRET"/></div></div>`,
  json:`<div class="field-group"><label class="field-label">JSON Payload</label><textarea class="field-textarea" id="f_json" placeholder='{"key": "value"}' style="font-family:monospace;font-size:12px;min-height:120px"></textarea></div>`,
  freelance:`<div class="field-group"><label class="field-label">Profile URL</label><input class="field-input" id="f_fl_url" placeholder="https://upwork.com/freelancers/…"/></div><div class="row-2"><div class="field-group"><label class="field-label">Your Name</label><input class="field-input" id="f_fl_name" placeholder="Jane Doe"/></div><div class="field-group"><label class="field-label">Specialty</label><input class="field-input" id="f_fl_role" placeholder="UI/UX Designer"/></div></div>`,
  document:`<div class="field-group"><label class="field-label">Document URL</label><input class="field-input" id="f_doc_url" type="url" placeholder="https://example.com/file.pdf"/></div><div class="field-group"><label class="field-label">Title (optional)</label><input class="field-input" id="f_doc_title" placeholder="Annual Report 2024"/></div>`,
  media:`<div class="field-group"><label class="field-label">Media URL</label><input class="field-input" id="f_media_url" type="url" placeholder="https://example.com/video.mp4"/></div>`,
  custom:`<div class="field-group"><label class="field-label">Custom QR Content</label><textarea class="field-textarea" id="f_custom" placeholder="Enter any raw content…" style="min-height:100px"></textarea></div>`,
  instagram:`<div class="field-group"><label class="field-label">Platform</label><select class="field-select" id="f_social_platform"><option value="instagram">Instagram</option><option value="twitter">X (Twitter)</option><option value="linkedin">LinkedIn</option><option value="tiktok">TikTok</option><option value="youtube">YouTube</option><option value="github">GitHub</option></select></div><div class="field-group"><label class="field-label">Username or Full URL</label><input class="field-input" id="f_social_user" placeholder="@username or full URL"/></div>`,
};

const BUILDERS = {
  url:()=>v('f_url')||null,
  text:()=>v('f_text')||null,
  email:()=>{const e=v('f_email');if(!e)return null;let s=`mailto:${e}`;const p=[];const sub=v('f_email_sub');const body=v('f_email_body');if(sub)p.push('subject='+encodeURIComponent(sub));if(body)p.push('body='+encodeURIComponent(body));return s+(p.length?'?'+p.join('&'):'');},
  phone:()=>{const p=v('f_phone');return p?`tel:${p}`:null;},
  sms:()=>{const p=v('f_sms_phone');if(!p)return null;const m=v('f_sms_msg');return`sms:${p}${m?'?body='+encodeURIComponent(m):''}`;},
  whatsapp:()=>{const p=v('f_wa_phone').replace(/\D/g,'');if(!p)return null;const m=v('f_wa_msg');return`https://wa.me/${p}${m?'?text='+encodeURIComponent(m):''}`;},
  wifi:()=>{const ssid=v('f_wifi_ssid');if(!ssid)return null;const pass=v('f_wifi_pass');const enc=v('f_wifi_enc');const esc=s=>s.replace(/[\\;,"]/g,c=>'\\'+c);return`WIFI:T:${enc};S:${esc(ssid)};P:${esc(pass)};H:false;;`;},
  vcard:()=>{const first=v('f_vc_first'),last=v('f_vc_last');if(!first&&!last)return null;const lines=['BEGIN:VCARD','VERSION:3.0',`N:${last};${first};;;`,`FN:${first} ${last}`.trim()];const phone=v('f_vc_phone');if(phone)lines.push(`TEL;TYPE=CELL:${phone}`);const email=v('f_vc_email');if(email)lines.push(`EMAIL:${email}`);const org=v('f_vc_org');if(org)lines.push(`ORG:${org}`);const title=v('f_vc_title');if(title)lines.push(`TITLE:${title}`);const web=v('f_vc_web');if(web)lines.push(`URL:${web}`);lines.push('END:VCARD');return lines.join('\n');},
  location:()=>{const lat=v('f_lat'),lng=v('f_lng');if(!lat||!lng)return null;return`geo:${lat},${lng}`;},
  event:()=>{const title=v('f_ev_title');if(!title)return null;const fmt=s=>s?s.replace(/[-:T]/g,'').slice(0,15):'';return['BEGIN:VEVENT',`SUMMARY:${title}`,`DTSTART:${fmt(v('f_ev_start'))}`,`DTEND:${fmt(v('f_ev_end'))}`,v('f_ev_loc')?`LOCATION:${v('f_ev_loc')}`:'','END:VEVENT'].filter(Boolean).join('\n');},
  upi:()=>{const id=v('f_upi_id');if(!id)return null;let url=`upi://pay?pa=${encodeURIComponent(id)}`;const name=v('f_upi_name');if(name)url+=`&pn=${encodeURIComponent(name)}`;const amt=v('f_upi_amount');if(amt)url+=`&am=${amt}`;return url;},
  crypto:()=>{const coin=v('f_crypto_coin'),addr=v('f_crypto_addr');if(!addr)return null;const amount=v('f_crypto_amount');return`${coin}:${addr}${amount?'?amount='+amount:''}`;},
  review:()=>{const platform=v('f_review_platform'),id=v('f_review_id');if(!id)return null;if(platform==='google')return`https://search.google.com/local/writereview?placeid=${id}`;if(platform==='yelp')return`https://www.yelp.com/writeareview/biz/${id}`;if(platform==='trustpilot')return`https://www.trustpilot.com/review/${id}`;return id;},
  app:()=>{const url=v('f_app_url'),deep=v('f_app_deep');return deep||url||null;},
  totp:()=>{const account=v('f_totp_account'),secret=v('f_totp_secret');if(!account||!secret)return null;const issuer=v('f_totp_issuer');let uri=`otpauth://totp/${encodeURIComponent(issuer?issuer+':'+account:account)}?secret=${secret}`;if(issuer)uri+=`&issuer=${encodeURIComponent(issuer)}`;return uri;},
  json:()=>{const raw=v('f_json');if(!raw)return null;try{JSON.parse(raw);return raw;}catch{toast('⚠️ Invalid JSON syntax','error');return null;}},
  freelance:()=>{const url=v('f_fl_url');if(!url)return null;const name=v('f_fl_name'),role=v('f_fl_role');return(name||role)?`${url}\n${name}${role?' — '+role:''}`:url;},
  document:()=>{const url=v('f_doc_url');if(!url)return null;const title=v('f_doc_title');return title?`${url}\n${title}`:url;},
  media:()=>v('f_media_url')||null,
  custom:()=>v('f_custom')||null,
  instagram:()=>{const platform=v('f_social_platform'),user=v('f_social_user');if(!user)return null;if(user.startsWith('http'))return user;const clean=user.replace('@','');const bases={instagram:'https://instagram.com/',twitter:'https://twitter.com/',linkedin:'https://linkedin.com/in/',tiktok:'https://tiktok.com/@',youtube:'https://youtube.com/@',github:'https://github.com/'};return(bases[platform]||'https://')+clean;},
};

// STATE
let activeType=null,ecLevel='M',moduleSize=5,generatedCount=0,scannedCount=0,lastQRPayload='';
const history=[];

// UTILS
function v(id){const el=document.getElementById(id);return el?el.value.trim():'';}
function togglePw(id,btn){const el=document.getElementById(id);if(el.type==='password'){el.type='text';btn.textContent='🙈';}else{el.type='password';btn.textContent='👁';}}
function toast(msg,type='success'){const container=document.getElementById('toastContainer');const el=document.createElement('div');el.className='toast';const icons={success:'✦',error:'⚠',info:'ℹ'};el.innerHTML=`<span class="toast-icon">${icons[type]||'✦'}</span><span>${msg}</span>`;container.appendChild(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),300);},2800);}

// BUILD TYPE GRID
function buildTypeGrid(){
  const grid=document.getElementById('typeGrid');
  grid.innerHTML=QR_CATEGORIES.map((cat,ci)=>`<div class="type-category" data-cat="${ci}"><div class="type-category-label">${cat.label}</div><div class="type-chips-row">${cat.types.map((t,ti)=>`<div class="type-chip${t.id===activeType?' active':''}" data-type="${t.id}" data-cat="${ci}" data-idx="${ti}" onclick="selectType._userTriggered=true;selectType('${t.id}')"><span class="type-icon type-icon-svg">${t.icon}</span><span class="type-chip-name">${t.label}</span>${t.badge?`<span class="type-badge">${t.badge}</span>`:''}</div>`).join('')}</div></div>`).join('');
  animateTypeGrid();
}
function animateTypeGrid(baseDelay=0){
  document.querySelectorAll('.type-category-label').forEach((el,i)=>setTimeout(()=>el.classList.add('cin-on'),baseDelay+i*55));
  document.querySelectorAll('.type-chip').forEach(el=>{const ci=+el.dataset.cat;const ti=+el.dataset.idx;setTimeout(()=>el.classList.add('cin-on'),baseDelay+ci*60+ti*38+80);});
}
function selectType(id){
  const prevType=activeType;activeType=id;
  const wasAnimated=document.querySelector('.type-chip.cin-on')!==null;
  buildTypeGrid();
  if(wasAnimated)document.querySelectorAll('.type-chip,.type-category-label').forEach(el=>el.classList.add('cin-on'));
  const t=QR_TYPES.find(x=>x.id===id);
  document.getElementById('formCardTitle').innerHTML=`<span class="form-title-icon">${t.icon}</span><span class="form-title-text">${t.label} Details</span>`;
  document.getElementById('formSection').innerHTML=FORMS[id]||`<div class="field-group"><label class="field-label">Content</label><input class="field-input" id="f_generic" placeholder="Enter content…"/></div>`;
  if(prevType!==id){const canvas=document.getElementById('qrCanvas');const wrap=document.getElementById('qrCanvasWrap');const placeholder=document.getElementById('qrPlaceholder');const actions=document.getElementById('qrActions');if(canvas){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);canvas.style.display='none';}if(wrap)wrap.classList.remove('has-qr');if(placeholder)placeholder.style.display='';if(actions)actions.style.display='none';document.querySelectorAll('.qr-scan-line').forEach(el=>el.remove());}
  const formCard=document.getElementById('formCard');if(formCard){formCard.classList.remove('form-card-fade');void formCard.offsetWidth;formCard.classList.add('form-card-fade');}
  if(selectType._userTriggered){const fc=document.getElementById('formCard');if(fc)setTimeout(()=>fc.scrollIntoView({behavior:'smooth',block:'start'}),80);selectType._userTriggered=false;}
}

// GENERATE QR
window.generateQR = generateQR;
function generateQR(){
  try {
    if(!activeType){toast('Please choose a QR type first','error');return;}
    if(typeof QRCode==='undefined'){toast('QR library not loaded. Please refresh the page.','error');return;}
    let payload;
    try {
      payload = BUILDERS[activeType] ? BUILDERS[activeType]() : v('f_generic');
    } catch(builderErr) {
      toast('Please fill in the required fields','error');return;
    }
    if(!payload||!payload.trim()){toast('Please enter data before generating a QR code.','error');return;}
    const canvas=document.getElementById('qrCanvas');
    const wrap=document.getElementById('qrCanvasWrap');
    const placeholder=document.getElementById('qrPlaceholder');
    const qrActionsEl=document.getElementById('qrActions');
    const statEl=document.getElementById('statGenerated');
    if(!canvas||!wrap){toast('UI error — please refresh the page.','error');return;}
    const darkEl=document.getElementById('darkColor');
    const lightEl=document.getElementById('lightColor');
    const dark=darkEl?darkEl.value:'#000000';
    const light=lightEl?lightEl.value:'#ffffff';
    QRCode.toCanvas(canvas,payload,{errorCorrectionLevel:ecLevel,width:moduleSize*37,margin:2,color:{dark,light}},(err)=>{
      try {
        if(err){toast('QR generation failed: '+err.message,'error');return;}
        canvas.style.display='block';
        if(placeholder)placeholder.style.display='none';
        wrap.classList.remove('has-qr');void wrap.offsetWidth;wrap.classList.add('has-qr');
        if(qrActionsEl)qrActionsEl.style.display='flex';
        lastQRPayload=payload;
        generatedCount++;
        if(statEl)statEl.textContent=generatedCount;
        toast('✦ QR Code generated');
        document.querySelectorAll('.qr-scan-line').forEach(el=>el.remove());
        setTimeout(()=>{
          try {
            const line=document.createElement('div');line.className='qr-scan-line';wrap.appendChild(line);
            line.addEventListener('animationend',()=>line.remove());
          } catch(e) {}
        },120);
        try {
          const thumbCanvas=document.createElement('canvas');
          QRCode.toCanvas(thumbCanvas,payload,{errorCorrectionLevel:ecLevel,width:60,margin:1},()=>{});
          const t=QR_TYPES.find(x=>x.id===activeType);
          history.unshift({type:t?.label||activeType,payload,thumbCanvas,dark,light});
          if(history.length>20)history.pop();
          renderHistory();
        } catch(histErr) { /* non-critical */ }
      } catch(innerErr) {
        toast('Unexpected error generating QR code.','error');
      }
    });
  } catch(outerErr) {
    toast('Failed to generate QR code. Please try again.','error');
    console.error('generateQR error:',outerErr);
  }
}

// DOWNLOAD / COPY / SHARE
document.getElementById('downloadBtn').onclick=()=>{
  try {
    const canvas=document.getElementById('qrCanvas');
    if(!canvas||!canvas.width||canvas.style.display==='none'){toast('Generate a QR code first','error');return;}
    const link=document.createElement('a');
    link.download='nexascan-qr-'+Date.now()+'.png';
    link.href=canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast('⬇ Downloaded as PNG');
  } catch(e) { toast('Download failed. Please try again.','error'); }
};
document.getElementById('copyBtn').onclick=async()=>{
  try {
    const canvas=document.getElementById('qrCanvas');
    if(!canvas||!canvas.width||canvas.style.display==='none'){toast('Generate a QR code first','error');return;}
    const copyTextFallback=async()=>{
      if(lastQRPayload&&navigator.clipboard&&navigator.clipboard.writeText){
        await navigator.clipboard.writeText(lastQRPayload);
        toast('⧉ QR data copied');
        return true;
      }
      return false;
    };
    if(!navigator.clipboard||!window.ClipboardItem){
      if(await copyTextFallback())return;
      toast('Clipboard not supported in this browser','error');return;
    }
    canvas.toBlob(async(blob)=>{
      try {
        await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
        toast('⧉ Copied to clipboard');
      } catch(e) {
        try{if(await copyTextFallback())return;}catch(fallbackErr){}
        toast('Copy failed — try downloading instead','error');
      }
    });
  } catch(e) { toast('Copy not supported','error'); }
};
document.getElementById('shareBtn').onclick=async()=>{
  try {
    const canvas=document.getElementById('qrCanvas');
    if(!canvas||!canvas.width||canvas.style.display==='none'){toast('Generate a QR code first','error');return;}
    canvas.toBlob(async(blob)=>{
      try {
        const file=new File([blob],'qrcode.png',{type:'image/png'});
        if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
          await navigator.share({title:'QR Code',files:[file]});
        } else {
          window.open(canvas.toDataURL(),'_blank');
          toast('↗ Opened in new tab');
        }
      } catch(e) {
        if(e.name!=='AbortError') toast('Share failed. Try downloading instead.','error');
      }
    });
  } catch(e) { toast('Share not supported','error'); }
};

// CUSTOMISE
document.querySelectorAll('.ec-tab').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.ec-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');ecLevel=btn.dataset.ec;};});
document.getElementById('sizeSlider').oninput=function(){moduleSize=+this.value;document.getElementById('sizeLabel').textContent=(moduleSize*5)+' px';};
['darkColor','lightColor'].forEach(id=>{document.getElementById(id).oninput=function(){const preview=document.getElementById(id.replace('Color','SwatchPreview'));const label=document.getElementById(id.replace('Color','ColorLabel'));preview.style.background=this.value;label.textContent=this.value;};});
function applyColorPreset(dark,light){document.getElementById('darkColor').value=dark;document.getElementById('lightColor').value=light;document.getElementById('darkSwatchPreview').style.background=dark;document.getElementById('lightSwatchPreview').style.background=light;document.getElementById('darkColorLabel').textContent=dark;document.getElementById('lightColorLabel').textContent=light;toast('Color preset applied');}
window.applyColorPreset=applyColorPreset;

// SCANNER
// Check HTTPS and show warnings if needed
(function checkHttps(){
  try {
    const isHttps = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if(!isHttps) {
      ['httpsWarningQR','httpsWarningBC'].forEach(id=>{
        const el=document.getElementById(id);
        if(el)el.classList.add('visible');
      });
    }
  } catch(e){}
})();

function setupScanner(dropZoneId,fileInputId,browseBtnId,resultAreaId,mode='auto'){
  try {
    const dropZone=document.getElementById(dropZoneId);
    const fileInput=document.getElementById(fileInputId);
    const browseBtn=document.getElementById(browseBtnId);
    if(!dropZone||!fileInput||!browseBtn)return;
    browseBtn.onclick=(e)=>{
      try { e.stopPropagation(); fileInput.click(); } catch(err){}
    };
    dropZone.onclick=(e)=>{
      try { if(e.target!==browseBtn)fileInput.click(); } catch(err){}
    };
    fileInput.onchange=(e)=>{
      try {
        const file=e.target.files&&e.target.files[0];
        if(file){
          if(!file.type.startsWith('image/')){toast('Please select an image file','error');return;}
          processImage(file,resultAreaId,mode);
        }
      } catch(err){ toast('Failed to read file. Please try again.','error'); }
    };
    dropZone.ondragover=(e)=>{
      try { e.preventDefault();dropZone.classList.add('dragover'); } catch(err){}
    };
    dropZone.ondragleave=()=>{
      try { dropZone.classList.remove('dragover'); } catch(err){}
    };
    dropZone.ondrop=(e)=>{
      try {
        e.preventDefault();dropZone.classList.remove('dragover');
        const file=e.dataTransfer&&e.dataTransfer.files[0];
        if(file&&file.type.startsWith('image/')) processImage(file,resultAreaId,mode);
        else toast('Please drop an image file','error');
      } catch(err){ toast('Failed to process dropped file.','error'); }
    };
  } catch(e){ console.error('setupScanner error:',e); }
}

async function processImage(file,resultAreaId='scanResultArea',mode='auto'){
  try {
    if(!file){toast('No file selected','error');return;}
    if(!window.FileReader){toast('File reading not supported in this browser','error');return;}
    const reader=new FileReader();
    reader.onerror=()=>{ toast('Failed to read image file. Please try another.','error'); };
    reader.onload=(e)=>{
      try {
        const img=new Image();
        img.onerror=()=>{ toast('Could not load image. File may be corrupted.','error'); };
        img.onload=async()=>{
          try {
            const canvas=document.createElement('canvas');
            canvas.width=img.width;canvas.height=img.height;
            const ctx=canvas.getContext('2d');
            if(!ctx){toast('Canvas not supported in this browser','error');return;}
            ctx.drawImage(img,0,0);
            let imageData;
            try { imageData=ctx.getImageData(0,0,canvas.width,canvas.height); }
            catch(secErr){ toast('Could not read image data. Try a different image.','error');return; }

            // QR-only mode
            if(mode==='qr'){
              try {
                if(typeof jsQR==='undefined'){toast('QR decoder not loaded. Please refresh.','error');return;}
                const qr=jsQR(imageData.data,imageData.width,imageData.height,{inversionAttempts:'dontInvert'});
                if(qr){displayScanResult({data:qr.data,kind:'QR',format:'QR_CODE'},e.target.result,{},resultAreaId);return;}
                // Try inverted
                const inv=jsQR(imageData.data,imageData.width,imageData.height,{inversionAttempts:'invertFirst'});
                if(inv){displayScanResult({data:inv.data,kind:'QR',format:'QR_CODE'},e.target.result,{},resultAreaId);return;}
              } catch(qrErr){ console.warn('jsQR error:',qrErr); }
              displayScanResult(null,e.target.result,{},resultAreaId);
              return;
            }

            // Barcode-only mode
            if(mode==='barcode'){
              try {
                const barcode=await detectBarcodeInImage(canvas);
                if(barcode){displayScanResult(barcode,e.target.result,{},resultAreaId);return;}
              } catch(bcErr){ console.warn('Barcode detection error:',bcErr); }
              displayScanResult(null,e.target.result,{},resultAreaId);
              return;
            }

            // Auto mode: try both
            try {
              if(typeof jsQR!=='undefined'){
                const qr=jsQR(imageData.data,imageData.width,imageData.height,{inversionAttempts:'dontInvert'});
                if(qr){displayScanResult({data:qr.data,kind:'QR',format:'QR_CODE'},e.target.result,{},resultAreaId);return;}
              }
            } catch(qrErr){ console.warn('jsQR error:',qrErr); }
            try {
              const barcode=await detectBarcodeInImage(canvas);
              if(barcode){displayScanResult(barcode,e.target.result,{},resultAreaId);return;}
            } catch(bcErr){ console.warn('Barcode detection error:',bcErr); }
            displayScanResult(null,e.target.result,{},resultAreaId);
          } catch(innerErr){
            toast('Error processing image. Please try a different file.','error');
            console.error('processImage inner error:',innerErr);
          }
        };
        img.src=e.target.result;
      } catch(outerErr){
        toast('Failed to load image. Please try again.','error');
        console.error('processImage reader.onload error:',outerErr);
      }
    };
    reader.readAsDataURL(file);
  } catch(e){
    toast('Unexpected error. Please try again.','error');
    console.error('processImage error:',e);
  }
}
function prepareBarcodeDecodeCanvas(sourceCanvas){
  try{
    const srcCtx=sourceCanvas.getContext('2d');
    const imageData=srcCtx.getImageData(0,0,sourceCanvas.width,sourceCanvas.height);
    let minX=sourceCanvas.width,minY=sourceCanvas.height,maxX=0,maxY=0,found=false;
    for(let y=0;y<sourceCanvas.height;y++){
      for(let x=0;x<sourceCanvas.width;x++){
        const i=(y*sourceCanvas.width+x)*4;
        const r=imageData.data[i],g=imageData.data[i+1],b=imageData.data[i+2],a=imageData.data[i+3];
        if(a>20 && (r+g+b)<710){
          found=true;
          if(x<minX)minX=x;if(y<minY)minY=y;if(x>maxX)maxX=x;if(y>maxY)maxY=y;
        }
      }
    }
    if(!found)return sourceCanvas;
    const padX=Math.max(24,Math.round((maxX-minX+1)*0.08));
    const padY=Math.max(14,Math.round((maxY-minY+1)*0.16));
    minX=Math.max(0,minX-padX);minY=Math.max(0,minY-padY);
    maxX=Math.min(sourceCanvas.width-1,maxX+padX);maxY=Math.min(sourceCanvas.height-1,maxY+padY);
    const cropW=maxX-minX+1,cropH=maxY-minY+1;
    const scale=Math.max(2,Math.min(4,Math.floor(900/Math.max(cropW,cropH))||2));
    const quiet=Math.max(36,12*scale);
    const out=document.createElement('canvas');
    out.width=cropW*scale+quiet*2;
    out.height=cropH*scale+quiet*2;
    const ctx=out.getContext('2d');
    ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,out.width,out.height);
    ctx.drawImage(sourceCanvas,minX,minY,cropW,cropH,quiet,quiet,cropW*scale,cropH*scale);
    return out;
  }catch(e){
    return sourceCanvas;
  }
}

function getCode128Patterns(){
  try{
    if(window.__nexaCode128Patterns)return window.__nexaCode128Patterns;
    if(typeof encodeCode128==='function')encodeCode128(' ');
    return window.__nexaCode128Patterns;
  }catch(e){
    return null;
  }
}

function matchCode128Pattern(widths,start,pattern){
  if(start+pattern.length>widths.length)return null;
  const slice=widths.slice(start,start+pattern.length);
  const sum=slice.reduce((a,b)=>a+b,0);
  const modules=pattern.reduce((a,b)=>a+b,0);
  const unit=sum/modules;
  if(!unit||unit<1)return null;
  let err=0,maxErr=0;
  for(let i=0;i<pattern.length;i++){
    const diff=Math.abs(slice[i]/unit-pattern[i]);
    err+=diff;maxErr=Math.max(maxErr,diff);
  }
  return {err,maxErr,unit};
}

function decodeCode128FromCanvas(canvas){
  try{
    const patterns=getCode128Patterns();
    if(!patterns||!patterns.length||!canvas.width||!canvas.height)return null;
    const ctx=canvas.getContext('2d');
    const img=ctx.getImageData(0,0,canvas.width,canvas.height);
    let bestY=0,bestDark=-1;
    for(let y=0;y<canvas.height;y++){
      let dark=0;
      for(let x=0;x<canvas.width;x++){
        const i=(y*canvas.width+x)*4;
        const b=img.data[i]*0.299+img.data[i+1]*0.587+img.data[i+2]*0.114;
        if(img.data[i+3]>20&&b<150)dark++;
      }
      if(dark>bestDark){bestDark=dark;bestY=y;}
    }
    if(bestDark<12)return null;
    const samples=[];
    for(let x=0;x<canvas.width;x++){
      let total=0,count=0;
      for(let dy=-2;dy<=2;dy++){
        const y=Math.max(0,Math.min(canvas.height-1,bestY+dy));
        const i=(y*canvas.width+x)*4;
        if(img.data[i+3]>20){total+=img.data[i]*0.299+img.data[i+1]*0.587+img.data[i+2]*0.114;count++;}
      }
      samples.push(count?total/count:255);
    }
    const min=Math.min(...samples),max=Math.max(...samples);
    const threshold=Math.max(80,Math.min(210,(min+max)/2));
    const runs=[];
    let cur=samples[0]<threshold,w=1;
    for(let i=1;i<samples.length;i++){
      const dark=samples[i]<threshold;
      if(dark===cur)w++;
      else{runs.push({dark:cur,w});cur=dark;w=1;}
    }
    runs.push({dark:cur,w});
    while(runs.length&&runs[0].dark===false)runs.shift();
    while(runs.length&&runs[runs.length-1].dark===false)runs.pop();
    if(runs.length<24||!runs[0]?.dark)return null;
    const widths=runs.map(r=>r.w);
    const stop=[2,3,3,1,1,1,2];
    let bestStart=null;
    for(let i=0;i<Math.min(8,widths.length-6);i+=2){
      const m=matchCode128Pattern(widths,i,patterns[104]);
      if(m&&m.err<1.7&&m.maxErr<0.55&&(!bestStart||m.err<bestStart.err))bestStart={idx:i,err:m.err};
    }
    if(!bestStart)return null;
    const codes=[];
    let pos=bestStart.idx;
    for(let guard=0;guard<80&&pos<widths.length-6;guard++){
      const stopMatch=matchCode128Pattern(widths,pos,stop);
      if(stopMatch&&stopMatch.err<1.8&&stopMatch.maxErr<0.6)break;
      let best=null;
      for(let code=0;code<Math.min(patterns.length,106);code++){
        const m=matchCode128Pattern(widths,pos,patterns[code]);
        if(!m)continue;
        if(!best||m.err<best.err)best={code,err:m.err,maxErr:m.maxErr};
      }
      if(!best||best.err>1.9||best.maxErr>0.7)break;
      codes.push(best.code);
      pos+=6;
    }
    if(codes.length<4||codes[0]!==104)return null;
    const checksum=codes[codes.length-1];
    const dataCodes=codes.slice(1,-1);
    let expected=codes[0];
    dataCodes.forEach((code,i)=>expected+=code*(i+1));
    expected%=103;
    if(expected!==checksum)return null;
    let text='';
    for(const code of dataCodes){
      if(code>=0&&code<=95)text+=String.fromCharCode(code+32);
      else return null;
    }
    return text?{data:text,kind:'BARCODE',format:'CODE 128'}:null;
  }catch(e){
    return null;
  }
}

async function detectBarcodeInImage(canvas){
  const candidates=[canvas,prepareBarcodeDecodeCanvas(canvas)];
  const formats=['code_128','code_39','code_93','codabar','ean_13','ean_8','upc_a','upc_e','itf','pdf417','aztec','data_matrix'];
  if('BarcodeDetector' in window){
    for(const target of candidates){
      try{
        const detector=new BarcodeDetector({formats});
        const found=await detector.detect(target);
        if(found&&found.length>0){
          const best=found[0];
          return{data:best.rawValue||'',kind:'BARCODE',format:(best.format||'BARCODE').toUpperCase()};
        }
      }catch(e){}
    }
  }
  for(const target of candidates){
    const result=await detectBarcodeWithZXing(target);
    if(result&&result.data)return result;
  }
  for(const target of candidates){
    const result=decodeCode128FromCanvas(target);
    if(result&&result.data)return result;
  }
  return null;
}

async function detectBarcodeWithZXing(canvas){
  try{
    if(typeof ZXing==='undefined'){
      console.warn('ZXing library not available (offline or CDN failed) — file-upload decode unavailable');
      return null;
    }
    const zx=ZXing;
    let result=null;
    if(zx.MultiFormatReader&&zx.HTMLCanvasElementLuminanceSource){
      try{
        const hints=new Map();
        if(zx.DecodeHintType&&zx.DecodeHintType.TRY_HARDER)hints.set(zx.DecodeHintType.TRY_HARDER,true);
        if(zx.DecodeHintType&&zx.DecodeHintType.POSSIBLE_FORMATS&&zx.BarcodeFormat){
          hints.set(zx.DecodeHintType.POSSIBLE_FORMATS,[
            zx.BarcodeFormat.CODE_128,zx.BarcodeFormat.CODE_39,zx.BarcodeFormat.CODE_93,
            zx.BarcodeFormat.EAN_13,zx.BarcodeFormat.EAN_8,zx.BarcodeFormat.UPC_A,
            zx.BarcodeFormat.UPC_E,zx.BarcodeFormat.ITF,zx.BarcodeFormat.CODABAR
          ].filter(Boolean));
        }
        const reader=new zx.MultiFormatReader(hints);
        const luminance=new zx.HTMLCanvasElementLuminanceSource(canvas);
        const bitmap=new zx.BinaryBitmap(new zx.HybridBinarizer(luminance));
        result=reader.decode(bitmap);
      }catch(e){}
    }
    const imageData=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
    if(!result&&zx.BrowserMultiFormatReader&&zx.RGBLuminanceSource){
      try{
        const codeReader=new zx.BrowserMultiFormatReader();
        const luminanceSource=new zx.RGBLuminanceSource(imageData.data,imageData.width,imageData.height);
        const binaryBitmap=new zx.BinaryBitmap(new zx.HybridBinarizer(luminanceSource));
        result=codeReader.decode(binaryBitmap);
      }catch(e){}
    }
    if(!result){
      // Try with inverted image
      const invertedData=new Uint8ClampedArray(imageData.data.length);
      for(let i=0;i<imageData.data.length;i+=4){
        invertedData[i]=255-imageData.data[i];
        invertedData[i+1]=255-imageData.data[i+1];
        invertedData[i+2]=255-imageData.data[i+2];
        invertedData[i+3]=imageData.data[i+3];
      }
      if(zx.RGBLuminanceSource&&zx.BrowserMultiFormatReader){
        try{
          const codeReader=new zx.BrowserMultiFormatReader();
          const invertedSource=new zx.RGBLuminanceSource(invertedData,imageData.width,imageData.height);
          const invertedBitmap=new zx.BinaryBitmap(new zx.HybridBinarizer(invertedSource));
          result=codeReader.decode(invertedBitmap);
        }catch(e){}
      }
    }
    if(result){
      const text=result.getText?result.getText():(result.text||'');
      const format=result.getBarcodeFormat?result.getBarcodeFormat():(result.format||'UNKNOWN');
      return{
        data:text,
        kind:'BARCODE',
        format:barcodeFormatLabel(String(format))
      };
    }
    return null;
  }catch(e){
    console.error('ZXing barcode detection error:',e);
    return null;
  }
}
function barcodeFormatLabel(fmt){
  const map={'0':'AZTEC','1':'CODABAR','2':'CODE 39','3':'CODE 93','4':'CODE 128','5':'DATA MATRIX','6':'EAN-8','7':'EAN-13','8':'ITF','10':'PDF417','11':'QR CODE','14':'UPC-A','15':'UPC-E'};
  const key=String(fmt||'BARCODE');
  return map[key]||key.replace(/_/g,' ').toUpperCase();
}
function displayScanResult(result,imgSrc,opts={},resultAreaId='scanResultArea'){
  const area=document.getElementById(resultAreaId);
  if(!area)return;
  if(!result||!result.data){
    const msg='No QR or barcode detected in this image.';
    area.innerHTML=`<img class="scan-preview-img" src="${imgSrc}" alt="Scanned image"/><div class="scan-result-empty"><div class="scan-result-empty-icon">⚠</div>${msg}</div>`;
    toast('No QR or barcode found','error');
    return;
  }
  scannedCount++;document.getElementById('statScanned').textContent=scannedCount;
  const data=result.data;
  const badge=result.kind==='QR'?`QR · ${detectContentType(data)}`:`BARCODE · ${barcodeFormatLabel(result.format)}`;
  area.innerHTML=`<img class="scan-preview-img" src="${imgSrc}" alt="Scanned image"/><div class="result-pill">✓ Decoded — ${badge}</div><div class="result-text">${escHtml(data)}</div><div class="btn-action-group"><button class="btn btn-cyan btn-sm" onclick="copyText('${escAttr(data)}')">⧉ Copy</button>${isURL(data)?`<a class="btn btn-ghost btn-sm" href="${escAttr(data)}" target="_blank" rel="noopener">↗ Open URL</a>`:''}</div>`;
  toast(result.kind==='QR'?'⊙ QR Code decoded':'▬ Barcode decoded');
}
function detectContentType(data){if(/^https?:\/\//i.test(data))return'URL';if(/^mailto:/i.test(data))return'Email';if(/^tel:/i.test(data))return'Phone';if(/^sms:/i.test(data))return'SMS';if(/^WIFI:/i.test(data))return'WiFi';if(/^BEGIN:VCARD/i.test(data))return'vCard';if(/^geo:/i.test(data))return'Location';if(/^BEGIN:VEVENT/i.test(data))return'Calendar';if(/^upi:\/\//i.test(data))return'UPI';if(/^otpauth:\/\//i.test(data))return'2FA/OTP';if(/^{/.test(data.trim()))return'JSON';return'Text';}
function isURL(s){return/^https?:\/\//i.test(s);}
function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function escAttr(s){return s.replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function copyText(text){
  try {
    if(!navigator.clipboard){toast('Copy not supported in this browser','error');return;}
    navigator.clipboard.writeText(text).then(()=>toast('⧉ Copied!')).catch(()=>toast('Copy failed','error'));
  } catch(e){ toast('Copy not supported','error'); }
}
window.copyText=copyText;

// HISTORY
function renderHistory(){
  try {
    ['historyList','bcHistoryList'].forEach(listId=>{
      const list=document.getElementById(listId);if(!list)return;
      if(!history.length){list.innerHTML='<div class="no-hist">No QR codes generated yet in this session.</div>';return;}
      list.innerHTML=history.map((item,i)=>`<div class="history-item" role="button" tabindex="0" aria-label="Load ${escHtml(item.type)}" onclick="loadFromHistory(${i})" onkeydown="if(event.key==='Enter')loadFromHistory(${i})"><div class="history-thumb"></div><div class="history-info"><div class="history-type">${item.type}</div><div class="history-val">${escHtml(item.payload)}</div></div><span class="history-del" role="button" aria-label="Delete" onclick="deleteHistory(event,${i})" onkeydown="if(event.key==='Enter')deleteHistory(event,${i})">✕</span></div>`).join('');
      history.forEach((item,i)=>{
        try {
          const thumbEl=list.children[i]?.querySelector('.history-thumb');
          if(thumbEl&&item.thumbCanvas)thumbEl.appendChild(item.thumbCanvas.cloneNode(true));
        } catch(e){}
      });
    });
  } catch(e){ console.error('renderHistory error:',e); }
}
function loadFromHistory(i){
  try {
    const item=history[i];if(!item)return;
    if(typeof QRCode==='undefined'){toast('QR library not loaded. Please refresh.','error');return;}
    const canvas=document.getElementById('qrCanvas');
    if(!canvas)return;
    QRCode.toCanvas(canvas,item.payload,{errorCorrectionLevel:ecLevel,width:moduleSize*37,margin:2,color:{dark:item.dark,light:item.light}},()=>{
      try {
        canvas.style.display='block';
        const ph=document.getElementById('qrPlaceholder');if(ph)ph.style.display='none';
        const cw=document.getElementById('qrCanvasWrap');if(cw)cw.classList.add('has-qr');
        const qa=document.getElementById('qrActions');if(qa)qa.style.display='flex';
        switchTab('generate');toast('Loaded from history');
      } catch(e){}
    });
  } catch(e){ toast('Failed to load from history','error'); }
}
function deleteHistory(e,i){
  try { e.stopPropagation();history.splice(i,1);renderHistory();toast('Removed from history'); }
  catch(err){}
}
window.loadFromHistory=loadFromHistory;window.deleteHistory=deleteHistory;

// TABS
function stableTabSwitch(run){try{const y=window.scrollY;run();requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));}catch(e){}}
function switchTab(id){stableTabSwitch(()=>{document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+id));posInk();});}
window.switchTab=switchTab;
document.querySelectorAll('.tab-btn').forEach(btn=>{ if(btn)btn.onclick=()=>{ try{switchTab(btn.dataset.tab);}catch(e){} }; });
const generateBtnEl=document.getElementById('generateBtn');
if(generateBtnEl)generateBtnEl.onclick=generateQR;
document.addEventListener('keydown',(e)=>{ try{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))generateQR();}catch(err){} });
try{buildTypeGrid();selectType('url');}catch(e){}
try{setupScanner('dropZone','scanFileInput','browseBtn','scanResultArea','qr');}catch(e){}

// Build QR placeholder — proper 9×9 QR grid cells
(function(){
  const wrap = document.getElementById('qrPlaceholderBars');
  if(!wrap) return;
  wrap.innerHTML = '';
  // 9×9 = 81 square cells, styled via CSS
  for(let i = 0; i < 81; i++){
    const s = document.createElement('span');
    s.style.animationDelay = (i * 0.028) + 's';
    wrap.appendChild(s);
  }
})();

// ══════════════════════════════════════════════
// CINEMATIC ENGINE
// ══════════════════════════════════════════════
(function(){
  const grid=document.getElementById('crtPixelGrid');
  if(grid){const pat=[1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,0,1,0,1,0,0,0,1];pat.forEach((on,i)=>{const px=document.createElement('div');px.className='crt-pixel';if(!on)px.style.opacity='0';grid.appendChild(px);if(on)setTimeout(()=>px.classList.add('px-on'),80+i*12+Math.random()*20);});}
  const bcBars=document.getElementById('crtBcBars');
  if(bcBars){const barDefs=[{w:3,h:0.55},{w:5,h:0.90},{w:3,h:0.70},{w:7,h:1.00},{w:3,h:0.50},{w:5,h:0.80},{w:3,h:0.35},{w:7,h:1.00},{w:4,h:0.65},{w:3,h:0.45},{w:6,h:0.85},{w:3,h:0.40},{w:7,h:1.00}];barDefs.forEach((b,i)=>{const el=document.createElement('div');el.className='crt-bc-bar';el.style.cssText=`width:${b.w}px;height:${Math.round(b.h*34)}px;animation-delay:${0.08+i*0.045}s`;bcBars.appendChild(el);});}
  document.querySelectorAll('.crt-letter').forEach((el,i)=>setTimeout(()=>el.classList.add('drop'),640+i*110));
  // Auto-hide curtain after 3000ms to let animations complete
  setTimeout(()=>{
    const c=document.getElementById('curtain');
    if(c){
      c.classList.add('hide');
      setTimeout(()=>{
        c.style.display='none';
        c.style.pointerEvents='none';
      },600);
    }
  },3000);
  // Allow clicking curtain to skip
  const curtain=document.getElementById('curtain');
  if(curtain){
    // Guard: don't dismiss curtain in first 800ms to let entrance animate properly
    let curtainReady = false;
    setTimeout(()=>{ curtainReady = true; }, 800);
    curtain.onclick=(e)=>{
      if(!curtainReady) return;
      e.stopPropagation();
      curtain.classList.add('hide');
      setTimeout(()=>{ curtain.style.display='none'; },600);
    };
  }
})();

(function(){
  const el=document.getElementById('mainTitle');
  if(!el)return;
  el.innerHTML='Qrix'.split('').map((ch,i)=>`<span class="ch${i>=2?' chi':''}" style="transition-delay:${i*90}ms">${ch}</span>`).join('');
  setTimeout(()=>{el.querySelectorAll('.ch').forEach(c=>c.classList.add('on'));setTimeout(()=>{document.getElementById('mainSub').classList.add('on');},300);setTimeout(()=>{document.getElementById('statsRow').classList.add('on');},550);setTimeout(()=>{document.getElementById('tabsWrap').classList.add('on');},800);document.querySelectorAll('.glass-card').forEach((card,i)=>setTimeout(()=>card.classList.add('on'),1100+i*100));setTimeout(()=>animateTypeGrid(),1500);},500);
})();

const scObs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*55);scObs.unobserve(e.target);}});},{threshold:0.07});
document.querySelectorAll('.glass-card').forEach(c=>scObs.observe(c));

(function(){const wrap=document.getElementById('logoScrollWrap');if(!wrap)return;const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){setTimeout(()=>wrap.classList.add('scroll-in'),120);obs.unobserve(wrap);}});},{threshold:0.15});obs.observe(wrap);})();

(function(){const g=document.getElementById('cg');if(!g||'ontouchstart' in window){if(g)g.style.display='none';return;}let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;document.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;},{passive:true});function tick(){x+=(tx-x)*0.09;y+=(ty-y)*0.09;g.style.transform='translate(calc('+x+'px - 50%), calc('+y+'px - 50%))';requestAnimationFrame(tick);}tick();})();

function attachRipples(){document.querySelectorAll('.btn:not([data-r]),.type-chip:not([data-r]),.tab-btn:not([data-r]),.ec-tab:not([data-r])').forEach(el=>{el.dataset.r='1';el.addEventListener('click',e=>{const rect=el.getBoundingClientRect();const sz=Math.max(rect.width,rect.height)*1.9;const rpl=document.createElement('span');rpl.className='ripple';rpl.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-rect.left-sz/2)+'px;top:'+(e.clientY-rect.top-sz/2)+'px';el.appendChild(rpl);rpl.addEventListener('animationend',()=>rpl.remove());},{passive:true});});}
attachRipples();

function posInk(){const ink=document.getElementById('tabInk');const active=document.querySelector('.tab-btn.active');const bar=document.querySelector('.tabs-bar');if(!ink||!active||!bar)return;const br=bar.getBoundingClientRect();const ar=active.getBoundingClientRect();ink.style.left=(ar.left-br.left)+'px';ink.style.top=(ar.top-br.top)+'px';ink.style.width=ar.width+'px';ink.style.height=ar.height+'px';}
requestAnimationFrame(()=>requestAnimationFrame(posInk));
window.addEventListener('resize',posInk,{passive:true});
document.getElementById('generateBtn').onclick=generateQR;

function setBcTabActive(id){
  stableTabSwitch(()=>{
    document.querySelectorAll('.bc-tab-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.bctab===id));
    document.querySelectorAll('.bc-panel').forEach(p=>p.classList.toggle('active',p.id==='bc-panel-'+id));
    const ink=document.getElementById('bcTabInk');
    const active=document.querySelector('.bc-tab-btn.active');
    const bar=document.getElementById('bcTabsBar');
    if(!ink||!active||!bar)return;
    const br=bar.getBoundingClientRect();
    const ar=active.getBoundingClientRect();
    ink.style.left=(ar.left-br.left)+'px';
    ink.style.top=(ar.top-br.top)+'px';
    ink.style.width=ar.width+'px';
    ink.style.height=ar.height+'px';
  });
}
window.setBcTabActive=setBcTabActive;
document.querySelectorAll('.bc-tab-btn').forEach(btn=>{
  btn.onclick=()=>{
    const id=btn.dataset.bctab;
    setBcTabActive(id);
  };
});
requestAnimationFrame(()=>requestAnimationFrame(()=>setBcTabActive('generate')));
window.addEventListener('resize',()=>setBcTabActive(document.querySelector('.bc-tab-btn.active')?.dataset.bctab||'generate'),{passive:true});

// ══════════════════════════════════════════════
// BARCODE ENGINE — Pure canvas rendering
// ══════════════════════════════════════════════
(function(){
const BC_FORMATS=[
  // RETAIL
  {category:'Retail',id:'upca',label:'UPC-A',dot:'#f472b6',desc:'North American retail standard',maxChars:12,hint:'Exactly 11 digits (check digit auto-calculated)',features:['Numeric only','11 digits','North America'],validate:v=>/^\d{11,12}$/.test(v)},
  {category:'Retail',id:'ean13',label:'EAN-13',dot:'#4ade80',desc:'Retail product identification worldwide',maxChars:13,hint:'Exactly 12 digits (check digit auto-calculated)',features:['Numeric only','12 digits','Retail standard'],validate:v=>/^\d{12,13}$/.test(v)},
  {category:'Retail',id:'ean8',label:'EAN-8',dot:'#fb923c',desc:'Compact retail code for small items',maxChars:8,hint:'Exactly 7 digits (check digit auto-calculated)',features:['Numeric only','7 digits','Compact'],validate:v=>/^\d{7,8}$/.test(v)},
  // LOGISTICS & INDUSTRY
  {category:'Logistics & Industry',id:'code128',label:'CODE 128',dot:'#22d3ee',desc:'Universal alphanumeric — most widely used',maxChars:48,hint:'Any text or numbers (up to 48 chars)',features:['Alphanumeric','High density','Auto subset'],validate:v=>v.length>0&&v.length<=48},
  {category:'Logistics & Industry',id:'code39',label:'CODE 39',dot:'#a78bfa',desc:'Logistics & manufacturing standard',maxChars:43,hint:'A–Z, 0–9 and - . $ / + % SPACE',features:['Alphanumeric','Self-checking','Logistics'],validate:v=>/^[A-Z0-9\-\. \$\/\+\%]+$/i.test(v)&&v.length>0},
  {category:'Logistics & Industry',id:'itf14',label:'ITF-14',dot:'#38bdf8',desc:'GS1 shipping container code',maxChars:14,hint:'Exactly 13 digits (check digit auto-calculated)',features:['Numeric only','Shipping','Bearer bars'],validate:v=>/^\d{13,14}$/.test(v)},
  // GENERAL / LEGACY
  {category:'General / Legacy',id:'codabar',label:'CODABAR',dot:'#06b6d4',desc:'Legacy barcode format for libraries & blood banks',maxChars:20,hint:'0-9, - . $ / + : A-D (at start/end)',features:['Legacy format','Medical','Banking'],validate:v=>/^[A-D]?[0-9\-\.\$\/\+:]*[A-D]?$/.test(v)&&v.length>1},
  {category:'General / Legacy',id:'code93',label:'CODE 93',dot:'#8b5cf6',desc:'Improved version of Code 39',maxChars:45,hint:'ASCII characters (0-127)',features:['Full ASCII','Self-checking','Legacy'],validate:v=>v.length>0&&v.length<=45},
];

let bcFmt=null,bcBarColor='#000000',bcBgColor='#ffffff',bcHeight=80,bcScale=2,bcShowText=true,bcLastData='';

function showToast(msg,icon,color){const container=document.getElementById('toastContainer');const el=document.createElement('div');el.className='toast';el.style.borderLeftColor=color||'var(--c)';el.innerHTML=`<span class="toast-icon">${icon||'▬'}</span><span>${msg}</span>`;container.appendChild(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),300);},2800);}

function buildFormatRow(){
  const row=document.getElementById('bcFormatRow');row.innerHTML='';
  const categories={};
  BC_FORMATS.forEach(fmt=>{
    if(!categories[fmt.category])categories[fmt.category]=[];
    categories[fmt.category].push(fmt);
  });
  Object.entries(categories).forEach(([catName,formats])=>{
    const catDiv=document.createElement('div');
    catDiv.style.marginBottom='16px';
    const label=document.createElement('div');
    label.style.cssText='font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--txt3);margin-bottom:8px;padding-left:4px';
    label.textContent=catName;
    catDiv.appendChild(label);
    const btnGroup=document.createElement('div');
    btnGroup.style.display='flex';
    btnGroup.style.flexWrap='wrap';
    btnGroup.style.gap='8px';
    formats.forEach(fmt=>{
      const btn=document.createElement('button');btn.className='bc-fmt-btn';
      btn.dataset.format=fmt.id;
      btn.innerHTML=`<span class="bc-fmt-dot" style="background:${fmt.dot}"></span>${fmt.label}`;
      btn.onclick=()=>{document.querySelectorAll('.bc-fmt-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');bcFmt=fmt;updateFmtInfo();validateAndCount();if(bcLastData)generateBarcode();};
      btnGroup.appendChild(btn);
    });
    catDiv.appendChild(btnGroup);
    row.appendChild(catDiv);
  });
}

function updateFmtInfo(){
  if(!bcFmt){document.getElementById('bcFmtInfoText').textContent='Select a barcode format to see its capabilities';document.getElementById('bcInputLabel').textContent='Value';document.getElementById('bcInput').placeholder='Select a format first…';document.getElementById('bcTypeFeatures').innerHTML='';return;}
  document.getElementById('bcFmtInfoText').textContent=bcFmt.desc;
  document.getElementById('bcInputLabel').textContent=bcFmt.hint;
  document.getElementById('bcInput').placeholder=bcFmt.hint;
  document.getElementById('bcTypeFeatures').innerHTML=bcFmt.features.map(f=>`<span class="bc-feature-tag">${f}</span>`).join('');
}

function validateAndCount(){
  const val=document.getElementById('bcInput').value;const counter=document.getElementById('bcCharCounter');
  if(!bcFmt){counter.textContent='Select a format above';counter.className='bc-char-counter';return;}
  const max=bcFmt.maxChars;counter.textContent=`${val.length} / ${max} characters`;counter.className='bc-char-counter';
  if(val.length>max*0.85)counter.classList.add('warn');if(val.length>max)counter.classList.add('err');
}

function buildPlaceholderBars(){
  // QR grid placeholder — 9×9 = 81 square cells
  const wrap=document.getElementById('qrPlaceholderBars');
  if(wrap){
    wrap.innerHTML='';
    for(let i=0;i<81;i++){
      const s=document.createElement('span');
      s.style.animationDelay=(i*0.028)+'s';
      wrap.appendChild(s);
    }
  }
  // BC placeholder bars
  const bcWrap=document.getElementById('bcPlaceholderBars');
  if(bcWrap){
    bcWrap.innerHTML='';
    const heights=[0.4,0.9,0.6,1,0.5,0.8,0.3,1,0.7,0.5,0.9,0.4,1,0.6,0.8,0.3,0.9,0.5];
    heights.forEach((h,i)=>{const s=document.createElement('span');s.style.cssText=`width:${i%3===0?4:2}px;height:${Math.round(h*48)}px;animation-delay:${i*0.07}s`;bcWrap.appendChild(s);});
  }
}

function calcCheckDigit(digits,altWeight=false){const d=digits.split('').map(Number);let sum=0;for(let i=0;i<d.length;i++){const w=altWeight?(i%2===0?3:1):(i%2===0?1:3);sum+=d[i]*w;}return(10-(sum%10))%10;}

function encodeCode128(text){
  const CODE128B_START=104;const PATTERNS=[[2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],[1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],[2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],[1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],[2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],[3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],[2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],[1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],[2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[2,1,3,3,1,1],[2,3,3,1,1,1],[1,2,2,1,2,3],[1,2,2,3,2,1],[2,2,2,3,1,1],[1,2,3,2,1,2],[1,2,1,2,3,2],[1,2,1,3,3,1],[1,3,1,2,3,1],[2,2,3,1,2,1],[2,1,2,2,3,1],[2,1,1,2,3,2],[2,1,1,3,2,3],[2,1,1,3,3,2],[2,1,3,2,3,1],[1,1,1,2,3,2],[3,1,1,2,3,1],[1,1,2,2,1,3],[1,1,2,3,1,2],[1,1,3,2,1,2],[1,2,2,1,1,3],[1,2,2,2,1,2],[1,2,2,1,3,1],[1,2,3,1,1,2],[1,2,3,2,1,1],[3,1,2,1,1,2],[3,2,2,1,1,1],[1,1,1,1,3,3],[2,1,1,2,1,3],[2,1,1,3,1,2],[2,1,1,1,2,3],[2,1,1,1,3,2],[3,1,1,1,1,3],[2,2,1,1,2,2],[2,1,3,1,1,3],[1,1,2,1,1,4],[1,1,4,1,2,1],[1,2,4,1,1,1],[2,1,1,4,1,1],[3,1,1,1,2,2],[4,1,1,1,1,2],[4,1,1,2,1,1],[4,2,1,1,1,1],[2,1,2,1,4,1],[2,1,4,1,2,1],[2,2,1,4,1,1],[4,1,2,1,1,2],[2,1,1,1,4,2],[2,2,1,1,4,1],[4,1,2,1,2,1],[4,2,2,1,1,1],[2,3,2,1,1,2],[2,3,2,2,1,1],[2,1,4,2,1,1],[1,1,1,1,4,2],[1,4,1,1,1,3],[3,1,1,4,1,1],[1,1,1,4,1,3],[1,1,1,1,3,4],[1,1,1,4,3,1],[1,1,4,1,1,3],[1,4,1,1,3,1],[1,1,3,4,1,1],[1,1,3,1,4,1]];
  if(typeof window!=='undefined')window.__nexaCode128Patterns=PATTERNS;
  const STOP_PAT=[2,3,3,1,1,1,2];const QUIET=10;
  const chars=text.split('').map(c=>c.charCodeAt(0)-32);
  let checksum=CODE128B_START;chars.forEach((c,i)=>checksum+=c*(i+1));checksum=checksum%103;
  const codes=[CODE128B_START,...chars,checksum,106];
  const segs=[];
  for(let i=0;i<QUIET;i++)segs.push({w:1,dark:false});
  codes.forEach((code,idx)=>{
    const pat=idx===codes.length-1?STOP_PAT:PATTERNS[code];
    pat.forEach((w,j)=>segs.push({w,dark:j%2===0}));
  });
  for(let i=0;i<QUIET;i++)segs.push({w:1,dark:false});
  return segs;
}

function encodeCode39(text){
  const MAP={'0':[1,1,1,2,2,1,2,1,1],'1':[2,1,1,2,1,1,1,1,2],'2':[1,1,2,2,1,1,1,1,2],'3':[2,1,2,2,1,1,1,1,1],'4':[1,1,1,2,2,1,1,1,2],'5':[2,1,1,2,2,1,1,1,1],'6':[1,1,2,2,2,1,1,1,1],'7':[1,1,1,2,1,1,2,1,2],'8':[2,1,1,2,1,1,2,1,1],'9':[1,1,2,2,1,1,2,1,1],'A':[2,1,1,1,1,2,1,1,2],'B':[1,1,2,1,1,2,1,1,2],'C':[2,1,2,1,1,2,1,1,1],'D':[1,1,1,1,2,2,1,1,2],'E':[2,1,1,1,2,2,1,1,1],'F':[1,1,2,1,2,2,1,1,1],'G':[1,1,1,1,1,2,2,1,2],'H':[2,1,1,1,1,2,2,1,1],'I':[1,1,2,1,1,2,2,1,1],'J':[1,1,1,1,2,2,2,1,1],'K':[2,1,1,1,1,1,1,2,2],'L':[1,1,2,1,1,1,1,2,2],'M':[2,1,2,1,1,1,1,2,1],'N':[1,1,1,1,2,1,1,2,2],'O':[2,1,1,1,2,1,1,2,1],'P':[1,1,2,1,2,1,1,2,1],'Q':[1,1,1,1,1,1,2,2,2],'R':[2,1,1,1,1,1,2,2,1],'S':[1,1,2,1,1,1,2,2,1],'T':[1,1,1,1,2,1,2,2,1],'U':[2,2,1,1,1,1,1,1,2],'V':[1,2,2,1,1,1,1,1,2],'W':[2,2,2,1,1,1,1,1,1],'X':[1,2,1,1,2,1,1,1,2],'Y':[2,2,1,1,2,1,1,1,1],'Z':[1,2,2,1,2,1,1,1,1],'-':[1,2,1,1,1,1,2,1,2],'.':[2,2,1,1,1,1,2,1,1],' ':[1,2,2,1,1,1,2,1,1],'$':[1,2,1,2,1,2,1,1,1],'/':[1,2,1,2,1,1,1,2,1],'+':[1,2,1,1,1,2,1,2,1],'%':[1,1,1,2,1,2,1,2,1],'*':[1,2,1,1,2,1,2,1,1]};
  const NARROW=1,INTER=1;const str='*'+text.toUpperCase()+'*';const segs=[];
  str.split('').forEach((ch,i)=>{const p=MAP[ch]||MAP[' '];p.forEach((w,j)=>segs.push({w:w*NARROW,dark:j%2===0}));if(i<str.length-1)segs.push({w:INTER,dark:false});});
  return segs;
}

function encodeEAN13(raw){
  let digits=raw.replace(/\D/g,'');if(digits.length===12)digits+=calcCheckDigit(digits,true);if(digits.length!==13)return null;
  const L=[[0,0,0,1,1,0,1],[0,0,1,1,0,0,1],[0,0,1,0,0,1,1],[0,1,1,1,1,0,1],[0,1,0,0,0,1,1],[0,1,1,0,0,0,1],[0,1,0,1,1,1,1],[0,1,1,1,0,1,1],[0,1,1,0,1,1,1],[0,0,0,1,0,1,1]];
  const G=[[0,1,0,0,1,1,1],[0,1,1,0,0,1,1],[0,0,1,1,0,1,1],[0,1,0,0,0,0,1],[0,0,1,1,1,0,1],[0,1,1,1,0,0,1],[0,0,0,0,1,0,1],[0,0,1,0,0,0,1],[0,0,0,1,0,0,1],[0,0,1,0,1,1,1]];
  const R=[[1,1,1,0,0,1,0],[1,1,0,0,1,1,0],[1,1,0,1,1,0,0],[1,0,0,0,0,1,0],[1,0,1,1,1,0,0],[1,0,0,1,1,1,0],[1,0,1,0,0,0,0],[1,0,0,0,1,0,0],[1,0,0,1,0,0,0],[1,1,1,0,1,0,0]];
  const PARITY=[[0,0,0,0,0,0],[0,0,1,0,1,1],[0,0,1,1,0,1],[0,0,1,1,1,0],[0,1,0,0,1,1],[0,1,1,0,0,1],[0,1,1,1,0,0],[0,1,0,1,0,1],[0,1,0,1,1,0],[0,1,1,0,1,0]];
  const first=parseInt(digits[0]);const parityRow=PARITY[first];const bits=[];
  bits.push(...[1,0,1]);for(let i=0;i<6;i++){const p=parityRow[i];const pat=p===0?L[parseInt(digits[i+1])]:G[parseInt(digits[i+1])];bits.push(...pat);}
  bits.push(...[0,1,0,1,0]);for(let i=7;i<13;i++)bits.push(...R[parseInt(digits[i])]);bits.push(...[1,0,1]);
  return{bits,digits};
}

function encodeUPCA(raw){
  let digits=raw.replace(/\D/g,'');if(digits.length===11)digits+=calcCheckDigit(digits,true);if(digits.length!==12)return null;
  const L=[[0,0,0,1,1,0,1],[0,0,1,1,0,0,1],[0,0,1,0,0,1,1],[0,1,1,1,1,0,1],[0,1,0,0,0,1,1],[0,1,1,0,0,0,1],[0,1,0,1,1,1,1],[0,1,1,1,0,1,1],[0,1,1,0,1,1,1],[0,0,0,1,0,1,1]];
  const R=L.map(p=>p.map(b=>b^1));const bits=[];
  bits.push(...[1,0,1]);for(let i=0;i<6;i++)bits.push(...L[parseInt(digits[i])]);bits.push(...[0,1,0,1,0]);for(let i=6;i<12;i++)bits.push(...R[parseInt(digits[i])]);bits.push(...[1,0,1]);
  return{bits,digits};
}

function encodeEAN8(raw){
  let digits=raw.replace(/\D/g,'');if(digits.length===7)digits+=calcCheckDigit(digits,true);if(digits.length!==8)return null;
  const L=[[0,0,0,1,1,0,1],[0,0,1,1,0,0,1],[0,0,1,0,0,1,1],[0,1,1,1,1,0,1],[0,1,0,0,0,1,1],[0,1,1,0,0,0,1],[0,1,0,1,1,1,1],[0,1,1,1,0,1,1],[0,1,1,0,1,1,1],[0,0,0,1,0,1,1]];
  const R=L.map(p=>p.map(b=>b^1));const bits=[];
  bits.push(...[1,0,1]);for(let i=0;i<4;i++)bits.push(...L[parseInt(digits[i])]);bits.push(...[0,1,0,1,0]);for(let i=4;i<8;i++)bits.push(...R[parseInt(digits[i])]);bits.push(...[1,0,1]);
  return{bits,digits};
}

function encodeITF14(raw){
  let digits=raw.replace(/\D/g,'');if(digits.length===13)digits+=calcCheckDigit(digits,true);if(digits.length!==14)return null;
  const NARROW=1,WIDE=3;const PAT=[[1,1,2,2,1],[2,1,1,1,2],[1,2,1,1,2],[2,2,1,1,1],[1,1,2,1,2],[2,1,2,1,1],[1,2,2,1,1],[1,1,1,2,2],[2,1,1,2,1],[1,2,1,2,1]];
  const bars=[];
  bars.push({w:NARROW,dark:true},{w:NARROW,dark:false},{w:NARROW,dark:true},{w:NARROW,dark:false});
  for(let i=0;i<14;i+=2){const d1=PAT[parseInt(digits[i])];const d2=PAT[parseInt(digits[i+1])];for(let j=0;j<5;j++){bars.push({w:d1[j]===2?WIDE:NARROW,dark:true});bars.push({w:d2[j]===2?WIDE:NARROW,dark:false});}}
  bars.push({w:WIDE,dark:true},{w:NARROW,dark:false},{w:NARROW,dark:true});
  return{bars,digits};
}

function encodeCodeabar(raw){
  const MAP={'0':'00000110','1':'00001100','2':'00010100','3':'00110100','4':'00100100','5':'01100100','6':'01010100','7':'01011100','8':'01110100','9':'10000100','-':'10001100','.':'10100100','$':'10110100','/':'11000100','+':'11010100',':':'11100100','A':'11010010','B':'11010100','C':'11010101','D':'11010110'};
  const START='A',STOP='B',QUIET=10;
  const str=START+raw.toUpperCase()+STOP;const segs=[];
  for(let i=0;i<QUIET;i++)segs.push({w:1,dark:false});
  str.split('').forEach(ch=>{const bits=MAP[ch]||'00000000';bits.split('').forEach((bit,idx)=>{segs.push({w:1,dark:bit==='1'});if(idx<bits.length-1)segs.push({w:1,dark:false});});segs.push({w:1,dark:false});});
  for(let i=0;i<QUIET;i++)segs.push({w:1,dark:false});
  return segs;
}

function encodeCode93(raw){
  const ENCMAP={'0':'100010100','1':'101001000','2':'101000100','3':'101000010','4':'100101000','5':'100100100','6':'100100010','7':'101010000','8':'100010010','9':'100001010','A':'110101000','B':'110100100','C':'110100010','D':'110010100','E':'110010010','F':'110001010','G':'101101000','H':'101100100','I':'101100010','J':'100110100','K':'100011010','L':'101011000','M':'101001100','N':'101000110','O':'100101100','P':'100010110','Q':'110110100','R':'110101100','S':'110100110','T':'101101100','U':'101010110','V':'110101010','W':'100110110','X':'101011010','Y':'110110010','Z':'110011010','-':'100001110','.':'111010100',' ':'111001010','$':'111000110','/':'101101110','+':'101110110','%':'110101110','*':'100111010'};
  const ENCEXT={'!':['33','/D'],'\"':['34','/E'],'#':['35','/F'],'&':['38','/H'],'\'':['39','/I'],'^':['94','/J'],'`':['96','/K'],'{':['123','/K'],'}':['125','/L'],'|':['124','/L'],'~':['126','/O']};
  let str=raw.toUpperCase();for(let i=0;i<str.length;i++){if(ENCEXT[str[i]]){const[code,esc]=ENCEXT[str[i]];str=str.slice(0,i)+esc+str.slice(i+1);i++;}}
  const QUIET=10;const segs=[];
  for(let i=0;i<QUIET;i++)segs.push({w:1,dark:false});
  segs.push(...ENCMAP['*'].split('').map(b=>({w:1,dark:b==='1'})));segs.push({w:1,dark:false});
  str.split('').forEach(ch=>{const bits=ENCMAP[ch]||'100001010';bits.split('').forEach((bit,idx)=>{segs.push({w:1,dark:bit==='1'});if(idx<bits.length-1)segs.push({w:1,dark:false});});segs.push({w:1,dark:false});});
  segs.push(...ENCMAP['*'].split('').map(b=>({w:1,dark:b==='1'})));
  for(let i=0;i<QUIET;i++)segs.push({w:1,dark:false});
  return segs;
}

function renderBarcode(data,format){
  try {
    const canvas=document.getElementById('bcCanvas');
    if(!canvas){return false;}
    const ctx=canvas.getContext('2d');
    if(!ctx){return false;}
    const scale=bcScale;const barH=bcHeight*scale;const QUIET_PX=20*scale;const fontSize=Math.round(14*scale);const textPad=bcShowText?fontSize+8*scale:0;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(format==='code128'||format==='code39'){
      const segs=format==='code128'?encodeCode128(data):encodeCode39(data);
      if(!segs||!segs.length)return false;
      const unit=format==='code128'?scale:scale*1.4;
      const totalW=segs.reduce((s,seg)=>s+seg.w*unit,0)+QUIET_PX*2;
      canvas.width=totalW;canvas.height=barH+textPad+QUIET_PX;
      ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      let x=QUIET_PX;segs.forEach(seg=>{if(seg.dark){ctx.fillStyle=bcBarColor;ctx.fillRect(x,QUIET_PX/2,seg.w*unit,barH);}x+=seg.w*unit;});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='center';ctx.fillText(data,totalW/2,barH+QUIET_PX/2+fontSize+2);}
    } else if(format==='ean13'){
      const enc=encodeEAN13(data);if(!enc)return false;const{bits,digits}=enc;const unit=scale*1.5;
      const W=bits.length*unit+QUIET_PX*2+12*scale;canvas.width=W;canvas.height=barH+textPad+QUIET_PX;
      ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      const startX=QUIET_PX+6*scale;bits.forEach((bit,i)=>{if(bit){const isGuard=(i<3)||(i>44&&i<50)||(i>91);const h=isGuard?barH+4*scale:barH;ctx.fillStyle=bcBarColor;ctx.fillRect(startX+i*unit,QUIET_PX/2,unit,h);}});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='left';ctx.fillText(digits[0],2,barH+QUIET_PX/2+fontSize+2);ctx.textAlign='center';ctx.fillText(digits.slice(1,7),startX+3.5*7*unit,barH+QUIET_PX/2+fontSize+2);ctx.fillText(digits.slice(7),startX+3.5*7*unit+47*unit,barH+QUIET_PX/2+fontSize+2);}
    } else if(format==='ean8'){
      const enc=encodeEAN8(data);if(!enc)return false;const{bits,digits}=enc;const unit=scale*1.5;const W=bits.length*unit+QUIET_PX*2;
      canvas.width=W;canvas.height=barH+textPad+QUIET_PX;ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      bits.forEach((bit,i)=>{if(bit){const isGuard=(i<3)||(i>27&&i<32)||(i>58);const h=isGuard?barH+4*scale:barH;ctx.fillStyle=bcBarColor;ctx.fillRect(QUIET_PX+i*unit,QUIET_PX/2,unit,h);}});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='center';ctx.fillText(digits,W/2,barH+QUIET_PX/2+fontSize+2);}
    } else if(format==='upca'){
      const enc=encodeUPCA(data);if(!enc)return false;const{bits,digits}=enc;const unit=scale*1.5;const W=bits.length*unit+QUIET_PX*2;
      canvas.width=W;canvas.height=barH+textPad+QUIET_PX;ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      bits.forEach((bit,i)=>{if(bit){const isGuard=(i<3)||(i>44&&i<50)||(i>91);const h=isGuard?barH+4*scale:barH;ctx.fillStyle=bcBarColor;ctx.fillRect(QUIET_PX+i*unit,QUIET_PX/2,unit,h);}});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='center';ctx.fillText(digits,W/2,barH+QUIET_PX/2+fontSize+2);}
    } else if(format==='itf14'){
      const enc=encodeITF14(data);if(!enc)return false;const{bars,digits}=enc;const unit=scale*1.2;
      const totalW=bars.reduce((s,b)=>s+b.w*unit,0)+QUIET_PX*2;canvas.width=totalW;canvas.height=barH+textPad+QUIET_PX*2;
      ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      const bearerH=4*scale;ctx.fillStyle=bcBarColor;ctx.fillRect(0,QUIET_PX/2-bearerH,totalW,bearerH);ctx.fillRect(0,QUIET_PX/2+barH,totalW,bearerH);
      let x=QUIET_PX;bars.forEach(seg=>{if(seg.dark){ctx.fillStyle=bcBarColor;ctx.fillRect(x,QUIET_PX/2,seg.w*unit,barH);}x+=seg.w*unit;});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='center';ctx.fillText(digits,totalW/2,barH+QUIET_PX+fontSize+2);}
    } else if(format==='codabar'){
      const segs=encodeCodeabar(data);
      if(!segs||!segs.length)return false;
      const unit=scale*1.5;
      const totalW=segs.reduce((s,seg)=>s+seg.w*unit,0)+QUIET_PX*2;
      canvas.width=totalW;canvas.height=barH+textPad+QUIET_PX;
      ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      let x=QUIET_PX;segs.forEach(seg=>{if(seg.dark){ctx.fillStyle=bcBarColor;ctx.fillRect(x,QUIET_PX/2,seg.w*unit,barH);}x+=seg.w*unit;});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='center';ctx.fillText(data,totalW/2,barH+QUIET_PX/2+fontSize+2);}
    } else if(format==='code93'){
      const segs=encodeCode93(data);
      if(!segs||!segs.length)return false;
      const unit=scale;
      const totalW=segs.reduce((s,seg)=>s+seg.w*unit,0)+QUIET_PX*2;
      canvas.width=totalW;canvas.height=barH+textPad+QUIET_PX;
      ctx.fillStyle=bcBgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      let x=QUIET_PX;segs.forEach(seg=>{if(seg.dark){ctx.fillStyle=bcBarColor;ctx.fillRect(x,QUIET_PX/2,seg.w*unit,barH);}x+=seg.w*unit;});
      if(bcShowText){ctx.fillStyle=bcBarColor;ctx.font=`${fontSize}px monospace`;ctx.textAlign='center';ctx.fillText(data,totalW/2,barH+QUIET_PX/2+fontSize+2);}
    }
    return true;
  } catch(e) {
    console.error('renderBarcode error:',e);
    return false;
  }
}

// Helper: show/clear inline barcode input error
function bcShowInputError(msg){
  const errEl=document.getElementById('bcInputError');
  const inputEl=document.getElementById('bcInput');
  if(errEl){errEl.textContent='⚠ '+msg;errEl.classList.add('visible');}
  if(inputEl)inputEl.classList.add('input-error');
}
function bcClearInputError(){
  const errEl=document.getElementById('bcInputError');
  const inputEl=document.getElementById('bcInput');
  if(errEl){errEl.textContent='';errEl.classList.remove('visible');}
  if(inputEl)inputEl.classList.remove('input-error');
}

window.generateBarcode = generateBarcode;
function generateBarcode(){
  try {
    bcClearInputError();
    const inputEl=document.getElementById('bcInput');
    if(!bcFmt){showToast('Select a barcode format first','⚠','#fb923c');return;}
    if(!inputEl){showToast('UI error — please refresh.','⚠','#fb923c');return;}
    const val=inputEl.value.trim();
    if(!val){
      bcShowInputError('Please enter a value before generating.');
      showToast('Please enter data before generating a barcode.','⚠','#fb923c');
      inputEl.focus();
      return;
    }
    if(!bcFmt.validate(val)){
      bcShowInputError(`Invalid format for ${bcFmt.label}. ${bcFmt.hint}`);
      showToast(`Invalid data for ${bcFmt.label} — ${bcFmt.hint}`,'✕','#f472b6');
      inputEl.focus();
      return;
    }
    bcLastData=val;
    const renderFmtId=bcFmt.id==='other'?'code128':bcFmt.id;
    let ok=false;
    try { ok=renderBarcode(val,renderFmtId); }
    catch(renderErr) {
      console.error('renderBarcode threw:',renderErr);
      showToast('Rendering failed. Please check your input.','⚠','#fb923c');
      return;
    }
    if(!ok){
      bcShowInputError(`Could not encode this value as ${bcFmt.label}. Check the format requirements.`);
      showToast('Could not encode — check your input','⚠','#fb923c');
      return;
    }
    const canvas=document.getElementById('bcCanvas');
    const placeholderEl=document.getElementById('bcPlaceholder');
    const scanLineEl=document.getElementById('bcScanLine');
    const actionsEl=document.getElementById('bcActions');
    const vd=document.getElementById('bcValueDisplay');
    if(canvas)canvas.style.display='block';
    if(placeholderEl)placeholderEl.style.display='none';
    if(scanLineEl)scanLineEl.style.display='block';
    if(actionsEl)actionsEl.style.display='flex';
    if(vd){vd.textContent=val;vd.classList.add('on');}
    const bcStatGenEl=document.getElementById('bcStatGenerated');
    if(bcStatGenEl)bcStatGenEl.textContent=parseInt(bcStatGenEl.textContent||0)+1;
    showToast(`${bcFmt.label} barcode generated`,'▬▬','#22d3ee');
  } catch(e) {
    showToast('Unexpected error generating barcode.','⚠','#fb923c');
    console.error('generateBarcode error:',e);
  }
}

window.applyBcPreset=function(bar,bg){
  bcBarColor=bar;bcBgColor=bg;
  document.getElementById('bcBarColor').value=bar;document.getElementById('bcBgColor').value=bg;
  document.getElementById('bcDarkSwatchPreview').style.background=bar;document.getElementById('bcLightSwatchPreview').style.background=bg;
  document.getElementById('bcBarColorLabel').textContent=bar;document.getElementById('bcBgColorLabel').textContent=bg;
  if(bcLastData)generateBarcode();
};

function animateBcTitle(){
  const el=document.getElementById('bcTitle');if(!el)return;
  // "Bar" = white, "ix" = animated gradient italic
  el.innerHTML='Barix'.split('').map((ch,i)=>`<span class="bc-ch${i>=3?' bc-grad':''}" style="transition-delay:${i*80}ms">${ch}</span>`).join('');
  setTimeout(()=>el.querySelectorAll('.bc-ch').forEach(c=>c.classList.add('on')),200);
  setTimeout(()=>document.getElementById('bcSub').classList.add('on'),600);
}

buildFormatRow();updateFmtInfo();buildPlaceholderBars();
try{var defaultBcBtn=document.querySelector('.bc-fmt-btn[data-format="code128"]')||document.querySelector('.bc-fmt-btn');if(defaultBcBtn&&!bcFmt)defaultBcBtn.click();}catch(e){}

const bcTitleObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateBcTitle();bcTitleObs.unobserve(e.target);}});},{threshold:0.2});
const bcSec=document.getElementById('barcodeSection');if(bcSec)bcTitleObs.observe(bcSec);

document.getElementById('bcInput').addEventListener('input',()=>{ try{bcClearInputError();validateAndCount();}catch(e){} });
const bcGenerateBtnEl=document.getElementById('bcGenerateBtn');
if(bcGenerateBtnEl)bcGenerateBtnEl.onclick=generateBarcode;
document.getElementById('bcInput').addEventListener('keydown',e=>{ try{if(e.key==='Enter')generateBarcode();}catch(err){} });

document.getElementById('bcDownloadBtn').onclick=function(){
  try {
    const canvas=document.getElementById('bcCanvas');
    if(!bcLastData||!canvas||canvas.style.display==='none'){showToast('Generate a barcode first','⚠','#fb923c');return;}
    const a=document.createElement('a');
    a.download=`nexascan-barcode-${bcFmt?bcFmt.id:'custom'}-${bcLastData.slice(0,12)}.png`;
    a.href=canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Barcode downloaded','⬇','#22d3ee');
  } catch(e){ showToast('Download failed. Please try again.','⚠','#fb923c'); }
};

document.getElementById('bcCopyBtn').onclick=function(){
  try {
    const canvas=document.getElementById('bcCanvas');
    if(!bcLastData||!canvas){showToast('Generate a barcode first','⚠','#fb923c');return;}
    const copyTextFallback=async()=>{
      if(bcLastData&&navigator.clipboard&&navigator.clipboard.writeText){
        await navigator.clipboard.writeText(bcLastData);
        showToast('Barcode value copied','⧉','#22d3ee');
        return true;
      }
      return false;
    };
    if(!navigator.clipboard||!window.ClipboardItem){
      copyTextFallback().catch(()=>{}).then(ok=>{if(!ok)showToast('Clipboard not supported — use Download','!','#fb923c');});
      return;
    }
    canvas.toBlob(async blob=>{
      try {
        await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
        showToast('Copied to clipboard','⧉','#22d3ee');
      } catch(e){
        try{if(await copyTextFallback())return;}catch(fallbackErr){}
        showToast('Copy failed — use Download instead','!','#fb923c');
      }
    });
  } catch(e){ showToast('Copy not supported in this browser','!','#fb923c'); }
};

const bcHeightSliderEl=document.getElementById('bcHeightSlider');
const bcScaleSliderEl=document.getElementById('bcScaleSlider');
const bcShowTextEl=document.getElementById('bcShowText');
const bcBarColorEl=document.getElementById('bcBarColor');
const bcBgColorEl=document.getElementById('bcBgColor');
if(bcHeightSliderEl)bcHeightSliderEl.addEventListener('input',function(){try{bcHeight=parseInt(this.value);const lbl=document.getElementById('bcHeightLabel');if(lbl)lbl.textContent=bcHeight+' px';if(bcLastData)generateBarcode();}catch(e){}});
if(bcScaleSliderEl)bcScaleSliderEl.addEventListener('input',function(){try{bcScale=parseFloat(this.value);const lbl=document.getElementById('bcScaleLabel');if(lbl)lbl.textContent=bcScale+'×';if(bcLastData)generateBarcode();}catch(e){}});
if(bcShowTextEl)bcShowTextEl.addEventListener('change',function(){try{bcShowText=this.checked;if(bcLastData)generateBarcode();}catch(e){}});
if(bcBarColorEl)bcBarColorEl.addEventListener('input',function(){try{bcBarColor=this.value;const prev=document.getElementById('bcDarkSwatchPreview');const lbl=document.getElementById('bcBarColorLabel');if(prev)prev.style.background=this.value;if(lbl)lbl.textContent=this.value;if(bcLastData)generateBarcode();}catch(e){}});
if(bcBgColorEl)bcBgColorEl.addEventListener('input',function(){try{bcBgColor=this.value;const prev=document.getElementById('bcLightSwatchPreview');const lbl=document.getElementById('bcBgColorLabel');if(prev)prev.style.background=this.value;if(lbl)lbl.textContent=this.value;if(bcLastData)generateBarcode();}catch(e){}});

})(); // end barcode IIFE

// ══════════════════════════════════════════════
// QR HERO — SVG, fills box fully, loops forever
// ══════════════════════════════════════════════
(function(){
  function initQRHero(){
  const svg = document.getElementById('heQrSvg');
  if(!svg) return;
  const NS = 'http://www.w3.org/2000/svg';

  // 11×11 QR-style pattern  (1=dark, 0=light)
  const PAT = [
    [1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,1,1],
    [1,0,1,1,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,0,0,1,1,0,1,0],
    [0,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,1,0,1,0,1,0,1,1],
    [1,1,0,0,1,1,1,0,1,0,1],
  ];
  const S = 11;
  const BOX = 88;
  const PAD = 6;
  const CELL = (BOX - PAD * 2) / S; // ~6.9 per cell

  // colour per module — theme-aware, finder uses --v, data uses theme palette
  function getThemeColors(){
    const theme = document.documentElement.getAttribute('data-theme') || 'white';
    const palettes = {
      white:   { find:'#4f6ef7', data:['#4f6ef7','#3d59e8','#6366f1','#818cf8','#0ea5e9','#4f6ef7'] },
      obsidian:{ find:'#d4d4d4', data:['#d4d4d4','#ffffff','#8a8a8a','#b0b0b0','#e5e5e5','#9a9a9a'] },
      qrix:    { find:'#8a5cf6', data:['#8a5cf6','#7c3aed','#22d3ee','#a78bfa','#38bdf8','#c4b5fd'] },
      aerium:  { find:'#7eb8f7', data:['#7eb8f7','#a5f3fc','#38bdf8','#93c5fd','#bae6fd','#60a5fa'] },
      jewel:   { find:'#f59e0b', data:['#f59e0b','#fbbf24','#d97706','#fcd34d','#fb923c','#fef3c7'] },
    };
    return palettes[theme] || palettes.white;
  }

  const rects = [];
  for(let r=0;r<S;r++){
    for(let c=0;c<S;c++){
      if(!PAT[r][c]) continue;
      const el = document.createElementNS(NS,'rect');
      el.setAttribute('x',  (PAD + c*CELL + 0.5).toFixed(1));
      el.setAttribute('y',  (PAD + r*CELL + 0.5).toFixed(1));
      el.setAttribute('width',  (CELL - 1).toFixed(1));
      el.setAttribute('height', (CELL - 1).toFixed(1));
      el.setAttribute('rx', '1.5');
      // finder pattern = top-left 7×7 block — color assigned dynamically in cycle
      el.setAttribute('fill', '#8a5cf6');
      el.setAttribute('opacity','0');
      el.dataset.isFinder = (r<=5 && c<=5) ? '1' : '0';
      el.dataset.colorIdx = String(Math.floor(Math.random()*6));
      svg.appendChild(el);
      rects.push(el);
    }
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=0|Math.random()*(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; }

  const BUILD_INTERVAL = 8;   // ms between modules appearing — fast generation feel
  const HOLD           = 800; // ms fully built before dissolve

  // Typewriter decode text
  const QR_TEXTS = ['nexascan.local','QR ready','NexaScan V1.0','Offline decode'];
  let qrTextIdx = 0;
  const decodeEl  = document.getElementById('heDecodeText');
  const decodeWrap = document.getElementById('heDecodeWrap');

  function typeText(str, onDone){
    if(!decodeEl || !decodeWrap) { if(onDone) onDone(); return; }
    decodeWrap.classList.add('visible');
    decodeEl.textContent = '';
    decodeEl.classList.remove('flash');
    let i = 0;
    const iv = setInterval(()=>{
      decodeEl.textContent = str.slice(0, ++i);
      if(i >= str.length){
        clearInterval(iv);
        void decodeEl.offsetWidth; // reflow
        decodeEl.classList.add('flash');
        if(onDone) setTimeout(onDone, 600);
      }
    }, 55);
  }

  function clearText(onDone){
    if(!decodeEl || !decodeWrap) { if(onDone) onDone(); return; }
    const str = decodeEl.textContent;
    let i = str.length;
    const iv = setInterval(()=>{
      decodeEl.textContent = str.slice(0, --i);
      if(i <= 0){ clearInterval(iv); decodeWrap.classList.remove('visible'); if(onDone) setTimeout(onDone,200); }
    }, 30);
  }

  function cycle(){
    // Apply current theme colors to all rects and reset to invisible
    const tc = getThemeColors();
    rects.forEach(r=>{
      r.style.transition = 'none';
      r.setAttribute('opacity','0');
      r.setAttribute('fill', r.dataset.isFinder==='1' ? tc.find : tc.data[+r.dataset.colorIdx % tc.data.length]);
    });
    const order = shuffle([...Array(rects.length).keys()]);
    let i = 0;

    function nextModule(){
      if(i >= order.length){
        // When fully built — type the decode text
        typeText(QR_TEXTS[qrTextIdx % QR_TEXTS.length], ()=>{
          qrTextIdx++;
          setTimeout(()=>{
            clearText(()=> dissolve());
          }, 900);
        });
        return;
      }
      const r = rects[order[i++]];
      r.style.transition = 'none';
      r.setAttribute('opacity','1');
      setTimeout(nextModule, BUILD_INTERVAL);
    }

    // Step 2 — fade out all at once
    function dissolve(){
      rects.forEach(r=>{ r.style.transition='opacity 0.4s ease'; r.setAttribute('opacity','0'); });
      setTimeout(cycle, 500);
    }

    nextModule();
  }

  cycle(); // Start animation loop
  } // end initQRHero
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', initQRHero, {once:true});
  } else {
    initQRHero();
  }
})();

// ══════════════════════════════════════════════
// BARCODE HERO — canvas, grows bars, loops forever
// ══════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('bcHeroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height; // 360 × 120

  // Build bar segment list (Code-128 style)
  const QUIET = 12;
  const rawBars = [];
  // start guard
  rawBars.push(2,1,2);
  // data widths — alternating dark/light
  [2,1,3,1,2,2,1,3,1,1,2,1,3,2,1,2,1,3,1,2,2,1,2,1,3,1,2,1,1,2,3,1,2,1,2,1,3,1,1,2,2,1,3,2,1].forEach(w=>rawBars.push(w));
  // end guard
  rawBars.push(2,1,2,1);

  const totalW = rawBars.reduce((s,w)=>s+w,0);
  const unit   = (W - QUIET*2) / totalW;
  const barH   = Math.round(H * 0.70);
  const barTop = Math.round(H * 0.08);

  // precompute dark segments only
  const segs = [];
  let x = QUIET;
  rawBars.forEach((w,i)=>{
    const px = w * unit;
    if(i%2===0) segs.push({x, w:px}); // even index = dark
    x += px;
  });

  // Theme colours — reading current theme each cycle
  function getBcThemeColors(){
    const theme = document.documentElement.getAttribute('data-theme') || 'white';
    const palettes = {
      white:   { bg:'#f0f0f5', colors:['#e11d48','#0ea5e9','#7c3aed','#c2185b','#0284c7','#be185d'], num:'rgba(225,29,72,0.65)' },
      obsidian:{ bg:'#000000', colors:['#d4d4d4','#ffffff','#8a8a8a','#b0b0b0','#e5e5e5','#9a9a9a'], num:'rgba(255,255,255,0.55)' },
      qrix:    { bg:'#08061a', colors:['#22d3ee','#8a5cf6','#38bdf8','#a78bfa','#22d3ee','#7c3aed'], num:'rgba(34,211,238,0.55)' },
      aerium:  { bg:'#080c10', colors:['#7eb8f7','#a5f3fc','#38bdf8','#93c5fd','#bae6fd','#60a5fa'], num:'rgba(126,184,247,0.65)' },
      jewel:   { bg:'#120e05', colors:['#f59e0b','#fbbf24','#d97706','#fcd34d','#fb923c','#fef3c7'], num:'rgba(245,158,11,0.65)' },
    };
    return palettes[theme] || palettes.white;
  }

  // Initial dark fill
  ctx.fillStyle = '#08061a'; ctx.fillRect(0,0,W,H);

  function drawNum(numColor){
    ctx.fillStyle = numColor || 'rgba(34,211,238,0.55)';
    ctx.font = `bold ${Math.floor(H*0.16)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('4 07003 00027 3', W/2, H*0.97);
  }

  function drawBg(bgColor){
    ctx.fillStyle = bgColor || '#08061a';
    ctx.fillRect(0,0,W,H);
  }

  function drawBar(s, alpha){
    // Glow layer (wider, soft)
    ctx.save();
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(s.x - 1, barTop, s.w + 2, barH);
    ctx.restore();
    // Solid core
    ctx.save();
    ctx.globalAlpha = alpha * 0.92;
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, barTop, s.w, barH);
    ctx.restore();
  }

  // Typewriter decode for barcode
  const BC_TEXTS = ['4 07003 00027 3','CODE-128','NexaScan BC','012345678905'];
  let bcTextIdx = 0;
  const bcDecodeEl   = document.getElementById('bcDecodeText');
  const bcDecodeWrap = document.getElementById('bcDecodeWrap');

  function bcTypeText(str, onDone){
    if(!bcDecodeEl||!bcDecodeWrap){if(onDone)onDone();return;}
    bcDecodeWrap.classList.add('visible');
    bcDecodeEl.textContent='';
    bcDecodeEl.classList.remove('flash');
    let i=0;
    const iv=setInterval(()=>{
      bcDecodeEl.textContent=str.slice(0,++i);
      if(i>=str.length){
        clearInterval(iv);
        void bcDecodeEl.offsetWidth;
        bcDecodeEl.classList.add('flash');
        if(onDone)setTimeout(onDone,600);
      }
    },55);
  }

  function bcClearText(onDone){
    if(!bcDecodeEl||!bcDecodeWrap){if(onDone)onDone();return;}
    const str=bcDecodeEl.textContent;
    let i=str.length;
    const iv=setInterval(()=>{
      bcDecodeEl.textContent=str.slice(0,--i);
      if(i<=0){clearInterval(iv);bcDecodeWrap.classList.remove('visible');if(onDone)setTimeout(onDone,200);}
    },30);
  }

  function cycle(){
    // Get current theme colors at start of each cycle
    const tc = getBcThemeColors();
    segs.forEach((s,i)=>{ s.color = tc.colors[i % tc.colors.length]; });
    drawBg(tc.bg);

    let idx = 0;
    const batchPer = Math.max(1, Math.ceil(segs.length / 40));

    // Phase 1 — bars grow upward one by one
    function grow(){
      if(idx >= segs.length){
        drawNum(tc.num);
        // type the decode text once bars are done
        bcTypeText(BC_TEXTS[bcTextIdx % BC_TEXTS.length], ()=>{
          bcTextIdx++;
          setTimeout(()=>{
            bcClearText(()=> fadeOut());
          }, 900);
        });
        return;
      }
      drawBg(tc.bg);
      // all completed bars
      for(let i=0;i<idx;i++) drawBar(segs[i], 1);
      // growing batch
      const end = Math.min(idx + batchPer, segs.length);
      for(let i=idx;i<end;i++){
        const prog = (i - idx + 1) / batchPer;
        const s = segs[i];
        const h = Math.round(barH * Math.min(prog, 1));
        ctx.save();
        ctx.globalAlpha = Math.min(prog + 0.1, 1) * 0.92;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(s.x, barTop + (barH - h), s.w, h);
        ctx.restore();
      }
      idx = end;
      requestAnimationFrame(grow);
    }

    // Phase 2 — fade out
    function fadeOut(){
      let a = 1;
      function step(){
        a = Math.max(0, a - 0.042);
        drawBg(tc.bg);
        segs.forEach(s => drawBar(s, a));
        if(a > 0.05) drawNum(tc.num);
        if(a > 0) requestAnimationFrame(step);
        else setTimeout(cycle, 350);
      }
      requestAnimationFrame(step);
    }

    grow();
  }

  // Trigger on bc-revealed
  const bcSec=document.getElementById('barcodeSection');
  if(!bcSec) return;
  let started=false;
  function startOnce(){ if(started)return; started=true; setTimeout(cycle,200); }
  const ob=new MutationObserver(()=>{ if(bcSec.classList.contains('bc-revealed')){ob.disconnect();startOnce();} });
  ob.observe(bcSec,{attributes:true,attributeFilter:['class']});
  if(bcSec.classList.contains('bc-revealed')){ob.disconnect();startOnce();}
})();

// ══════════════════════════════════════════════
// SECTION NAV
// ══════════════════════════════════════════════
(function(){
  try {
    const nav=document.getElementById('sectionNav');
    const modeViewport=document.getElementById('modeViewport');
    const qrSection=document.getElementById('qrSection');
    const bcSection=document.getElementById('barcodeSection');
    const btnQR=document.getElementById('snavQR');
    const btnBC=document.getElementById('snavBC');
    const themeToggle=document.getElementById('scanThemeToggle');
    if(!nav||!btnQR||!btnBC)return;
    let bcRevealed=bcSection?bcSection.classList.contains('bc-revealed'):false;
    let navShown=false;
    function showNav(){if(navShown)return;navShown=true;try{nav.classList.add('nav-visible');if(themeToggle)themeToggle.classList.add('theme-visible');}catch(e){}}

    // Curtain auto-hides at 3000ms + 600ms fade = 3600ms total; show nav 200ms after it's gone
    setTimeout(showNav, 3800);

    // If user clicks curtain to skip early, show nav 650ms after that (after fade-out completes)
    const curtainEl=document.getElementById('curtain');
    if(curtainEl){
      curtainEl.addEventListener('click',()=>setTimeout(showNav,650),{once:true,capture:true});
    }

    function setActive(section){
      try {
        if(section==='qr'){btnQR.classList.add('snav-active');btnBC.classList.remove('snav-active');}
        else{btnBC.classList.add('snav-active');btnQR.classList.remove('snav-active');}
      } catch(e){}
    }

    function setMode(section){
      try {
        const qrOn=section==='qr';
        if(qrSection)qrSection.classList.toggle('is-active',qrOn);
        if(bcSection)bcSection.classList.toggle('is-active',!qrOn);
        if(!qrOn&&!bcRevealed&&bcSection){bcRevealed=true;bcSection.classList.add('bc-revealed');}
        if(!qrOn&&typeof window.setBcTabActive==='function')window.setBcTabActive('generate');
        setActive(section);
      } catch(e){}
    }

    window.snavSwitch=function(section){
      try {
        setMode(section==='bc'?'bc':'qr');
        if(modeViewport){
          try {
            const top=modeViewport.getBoundingClientRect().top+window.scrollY-20;
            window.scrollTo({top,behavior:'smooth'});
          } catch(e){}
        }
        if(section==='bc'){
          setTimeout(()=>{
            try { const bcStats=document.getElementById('bcStatsRow');if(bcStats)bcStats.classList.add('on'); } catch(e){}
          },400);
        }
      } catch(e){}
    };

    setMode('qr');

    setTimeout(function(){
      try { const heWrap=document.querySelector('.he-qr-wrap');if(heWrap)heWrap.classList.add('he-ready'); } catch(e){}
    }, 800);
  } catch(e){ console.error('Section nav error:',e); }
}());

// ══════════════════════════════════════════════════════════
// MOBILE APP CONTROLLER  (≤768px only — desktop untouched)
// ══════════════════════════════════════════════════════════
(function(){
  // Only run on mobile
  // Only init mobile UI on small screens


  // ── State ────────────────────────────────────────────────
  var _nav      = 'qr';
  var _qrType   = 'url';
  var _bcFmt    = '';
  var _ec       = 'M';
  var _qrSize   = 5;
  var _darkCol  = '#000000';
  var _lightCol = '#ffffff';
  var _bcBarCol = '#000000';
  var _bcBgCol  = '#ffffff';
  var _bcHeight = 80;
  var _bcScale  = 2;
  var _bcShowTx = true;
  var _qrHistory= [];
  var _bcHistory= [];

  // ── QR Type definitions ──────────────────────────────────
  // ── QR Categories & Types (20 total, no picture icons) ──
  var QR_CATEGORIES = [
    {cat:'Essentials', types:[
      {id:'url',      name:'Website URL'},
      {id:'text',     name:'Plain Text'},
      {id:'wifi',     name:'WiFi'},
      {id:'vcard',    name:'Contact Card'},
    ]},
    {cat:'Communication', types:[
      {id:'email',    name:'Email'},
      {id:'phone',    name:'Phone'},
      {id:'sms',      name:'SMS'},
      {id:'whatsapp', name:'WhatsApp'},
    ]},
    {cat:'Business & Events', types:[
      {id:'event',    name:'Calendar'},
      {id:'location', name:'Location'},
      {id:'review',   name:'Review Link'},
      {id:'document', name:'Document'},
      {id:'media',    name:'Media'},
    ]},
    {cat:'Freelance & Work', types:[
      {id:'freelance',name:'Work Profile'},
      {id:'instagram',name:'Social Link'},
    ]},
    {cat:'Payments', types:[
      {id:'upi',      name:'UPI Payment'},
      {id:'crypto',   name:'Crypto'},
    ]},
    {cat:'Developer', types:[
      {id:'app',      name:'App Deep Link'},
      {id:'totp',     name:'2FA / OTP'},
      {id:'json',     name:'JSON'},
      {id:'custom',   name:'Custom'},
    ]},
  ];
  var QR_TYPES = QR_CATEGORIES.flatMap(function(cat){ return cat.types; });

  // ── BC Formats ───────────────────────────────────────────
  var BC_FMTS = [
    {id:'CODE128', label:'CODE 128',hint:'Alphanumeric — most common'},
    {id:'EAN13',   label:'EAN-13',  hint:'13 digits — retail products'},
    {id:'EAN8',    label:'EAN-8',   hint:'8 digits — small packages'},
    {id:'UPCA',    label:'UPC-A',   hint:'12 digits — North American retail'},
    {id:'CODE39',  label:'CODE 39', hint:'Uppercase alphanumeric'},
    {id:'ITF14',   label:'ITF-14',  hint:'14 digits — shipping'},
    {id:'MSI',     label:'MSI',     hint:'Numeric — warehouse'},
    {id:'pharmacode',label:'Pharma',hint:'1–131071 — pharmaceutical'},
  ];

  // ── Helpers ──────────────────────────────────────────────
  function $id(id){ return document.getElementById(id); }
  // toast: uses global window.toast directly — no local shadow needed

  // ── Nav switch ───────────────────────────────────────────
  var navBtns = [];
  var pages   = [];
  var navKeys = ['qr','bc','decode','history'];
  function resolveNavElements(){
    navBtns = [$id('mnavQR'),$id('mnavBC'),$id('mnavScan'),$id('mnavHist')];
    pages   = [$id('mpQRGen'),$id('mpBCGen'),$id('mpDecode'),$id('mpHistory')];
  }

  window.mobNavGo = function(key){
    _nav = key;
    var idx = navKeys.indexOf(key);
    navBtns.forEach(function(b,i){ if(b) b.classList.toggle('active', i===idx); });
    pages.forEach(function(p,i){
      if(!p) return;
      p.classList.toggle('mob-active', i===idx);
      p.style.display = (i===idx) ? 'flex' : 'none';
    });
    if(key!=='decode' && _scanRunning) mobStopScan();
    var bd = $id('mobBody'); if(bd) bd.scrollTop=0;
    if(key==='history') renderHistory();
  };

  // TYPE_SVG = alias to colored version (single source of truth)

  // ── Colored SVG icons (match desktop exactly) ────────────
  var TYPE_SVG_COLOR = {
    url:       '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#22d3ee" stroke-width="1.3"/><ellipse cx="10" cy="10" rx="3.5" ry="7.5" stroke="#22d3ee" stroke-width="1" stroke-dasharray="2 1.5"/><line x1="2.5" y1="10" x2="17.5" y2="10" stroke="#22d3ee" stroke-width="1"/></svg>',
    text:      '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="1.5" rx="0.75" fill="#a78bfa"/><rect x="3" y="7.5" width="11" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.8"/><rect x="3" y="11" width="14" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.6"/><rect x="3" y="14.5" width="8" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.4"/></svg>',
    wifi:      '<svg viewBox="0 0 20 20" fill="none"><path d="M2.5 8C5 5.2 7.3 4 10 4s5 1.2 7.5 4" stroke="#38bdf8" stroke-width="1.3" stroke-linecap="round"/><path d="M5 11c1.4-1.6 3-2.4 5-2.4s3.6.8 5 2.4" stroke="#38bdf8" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/><path d="M7.5 14c.7-.9 1.5-1.4 2.5-1.4s1.8.5 2.5 1.4" stroke="#38bdf8" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/><circle cx="10" cy="16.5" r="1.2" fill="#38bdf8"/></svg>',
    vcard:     '<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="#4ade80" stroke-width="1.2"/><circle cx="7" cy="10" r="2" stroke="#4ade80" stroke-width="1"/><line x1="11" y1="8.5" x2="15.5" y2="8.5" stroke="#4ade80" stroke-width="1" stroke-linecap="round"/><line x1="11" y1="11" x2="14" y2="11" stroke="#4ade80" stroke-width="1" stroke-linecap="round" opacity="0.6"/></svg>',
    email:     '<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="#f472b6" stroke-width="1.2"/><polyline points="2,6 10,11 18,6" stroke="#f472b6" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    phone:     '<svg viewBox="0 0 20 20" fill="none"><path d="M6 2.5h8a1.5 1.5 0 011.5 1.5v12A1.5 1.5 0 0114 17.5H6A1.5 1.5 0 014.5 16V4A1.5 1.5 0 016 2.5z" stroke="#22d3ee" stroke-width="1.2"/><circle cx="10" cy="15" r="0.8" fill="#22d3ee"/></svg>',
    sms:       '<svg viewBox="0 0 20 20" fill="none"><path d="M3 4.5h14a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 2.5V5.5a1 1 0 011-1z" stroke="#a78bfa" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    whatsapp:  '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#4ade80" stroke-width="1.2"/><path d="M7 10.5c.5 1.5 2 2.5 3.5 2.5 1 0 2-.4 2.7-1.1" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/></svg>',
    event:     '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#fb923c" stroke-width="1.2"/><line x1="3" y1="8" x2="17" y2="8" stroke="#fb923c" stroke-width="1"/><line x1="7" y1="2" x2="7" y2="6" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/><line x1="13" y1="2" x2="13" y2="6" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/></svg>',
    location:  '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="#f472b6" stroke-width="1.2"/><circle cx="10" cy="8" r="2" stroke="#f472b6" stroke-width="1.1"/></svg>',
    review:    '<svg viewBox="0 0 20 20" fill="none"><polygon points="10,2.5 12.2,7.5 17.5,8 13.5,11.8 14.7,17 10,14.2 5.3,17 6.5,11.8 2.5,8 7.8,7.5" stroke="#facc15" stroke-width="1.1" stroke-linejoin="round" fill="none"/></svg>',
    document:  '<svg viewBox="0 0 20 20" fill="none"><path d="M5 2.5h7l4 4V17a.5.5 0 01-.5.5h-10A.5.5 0 015 17V2.5z" stroke="#38bdf8" stroke-width="1.2"/><path d="M12 2.5V6.5h4" stroke="#38bdf8" stroke-width="1" stroke-linejoin="round"/></svg>',
    media:     '<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="#a78bfa" stroke-width="1.2"/><polygon points="8,8 8,13 14,10.5" fill="#a78bfa" opacity="0.9"/></svg>',
    freelance: '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="1.5" stroke="#4ade80" stroke-width="1.2"/><path d="M7 7V5.5A3 3 0 0113 5.5V7" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/></svg>',
    instagram: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2L13.5 5.5M10 2L6.5 5.5M10 2v10" stroke="#f472b6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="14" r="1.5" fill="#f472b6"/><path d="M5 17h10" stroke="#f472b6" stroke-width="1.2" stroke-linecap="round"/></svg>',
    upi:       '<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="#22d3ee" stroke-width="1.2"/><line x1="2" y1="9" x2="18" y2="9" stroke="#22d3ee" stroke-width="1"/></svg>',
    crypto:    '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#facc15" stroke-width="1.2"/><path d="M8 7h3a2 2 0 010 4H8m3 0h-3a2 2 0 000 4h3" stroke="#facc15" stroke-width="1.2" stroke-linecap="round"/></svg>',
    app:       '<svg viewBox="0 0 20 20" fill="none"><rect x="5.5" y="1.5" width="9" height="17" rx="2" stroke="#8a5cf6" stroke-width="1.2"/><circle cx="10" cy="15.5" r="0.9" fill="#8a5cf6"/></svg>',
    totp:      '<svg viewBox="0 0 20 20" fill="none"><rect x="4" y="8" width="12" height="9" rx="2" stroke="#fb923c" stroke-width="1.2"/><path d="M7 8V6a3 3 0 016 0v2" stroke="#fb923c" stroke-width="1.2" stroke-linecap="round"/><circle cx="10" cy="12.5" r="1.5" fill="#fb923c" opacity="0.9"/></svg>',
    json:      '<svg viewBox="0 0 20 20" fill="none"><path d="M6 4.5C4.5 4.5 4 5 4 6.5v2C4 9.5 3 10 2.5 10 3 10 4 10.5 4 11.5v2C4 15 4.5 15.5 6 15.5" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/><path d="M14 4.5c1.5 0 2 .5 2 2v2c0 1 1 1.5 1.5 1.5C17 10 16 10.5 16 11.5v2c0 1-.5 1.5-2 1.5" stroke="#4ade80" stroke-width="1.2" stroke-linecap="round"/></svg>',
    custom:    '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 5.5H18l-4.9 3.5 1.9 5.7L10 13.2 5 16.7l1.9-5.7L2 7.5h6.2z" stroke="#f472b6" stroke-width="1.1" stroke-linejoin="round"/></svg>',
  };

  // TYPE_SVG aliased for backward compat
  var TYPE_SVG = TYPE_SVG_COLOR;

  // ── Icon bg/glow per type ─────────────────────────────────
  var TYPE_BG = {
    url:'rgba(34,211,238,.12)',text:'rgba(167,139,250,.12)',wifi:'rgba(56,189,248,.12)',
    vcard:'rgba(74,222,128,.12)',email:'rgba(244,114,182,.12)',phone:'rgba(34,211,238,.12)',
    sms:'rgba(167,139,250,.12)',whatsapp:'rgba(74,222,128,.12)',event:'rgba(251,146,60,.12)',
    location:'rgba(244,114,182,.12)',review:'rgba(250,204,21,.12)',document:'rgba(56,189,248,.12)',
    media:'rgba(167,139,250,.12)',freelance:'rgba(74,222,128,.12)',instagram:'rgba(244,114,182,.12)',
    upi:'rgba(34,211,238,.12)',crypto:'rgba(250,204,21,.12)',app:'rgba(138,92,246,.12)',
    totp:'rgba(251,146,60,.12)',json:'rgba(74,222,128,.12)',custom:'rgba(244,114,182,.12)',
  };
  var TYPE_GLOW = {
    url:'rgba(34,211,238,.35)',text:'rgba(167,139,250,.35)',wifi:'rgba(56,189,248,.35)',
    vcard:'rgba(74,222,128,.35)',email:'rgba(244,114,182,.35)',phone:'rgba(34,211,238,.35)',
    sms:'rgba(167,139,250,.35)',whatsapp:'rgba(74,222,128,.35)',event:'rgba(251,146,60,.35)',
    location:'rgba(244,114,182,.35)',review:'rgba(250,204,21,.35)',document:'rgba(56,189,248,.35)',
    media:'rgba(167,139,250,.35)',freelance:'rgba(74,222,128,.35)',instagram:'rgba(244,114,182,.35)',
    upi:'rgba(34,211,238,.35)',crypto:'rgba(250,204,21,.35)',app:'rgba(138,92,246,.35)',
    totp:'rgba(251,146,60,.35)',json:'rgba(74,222,128,.35)',custom:'rgba(244,114,182,.35)',
  };

  // ── QR Type Grid — categories with colored SVG icons ─────
  function renderTypeGrid(){
    try{
      var grid = $id('mobTypeGrid'); if(!grid) return;
      grid.innerHTML = '';
      QR_CATEGORIES.forEach(function(cat){
        var lbl = document.createElement('div');
        lbl.className = 'mob-type-cat-label';
        lbl.textContent = cat.cat;
        grid.appendChild(lbl);
        var row = document.createElement('div');
        row.className = 'mob-type-row';
        cat.types.forEach(function(t){
          var b = document.createElement('button');
          var isActive = t.id === _qrType;
          b.className = 'mob-type-chip' + (isActive ? ' active' : '');
          b.setAttribute('data-type', t.id);
          b.setAttribute('type', 'button');
          var bg   = TYPE_BG[t.id]   || 'rgba(255,255,255,0.07)';
          var glow = TYPE_GLOW[t.id] || 'rgba(255,255,255,0.2)';
          b.innerHTML =
            '<span class="mob-chip-icon" style="background:' + bg + ';' + (isActive ? 'box-shadow:0 0 12px ' + glow + ';' : '') + '">' + (TYPE_SVG_COLOR[t.id] || '') + '</span>' +
            '<span class="mob-chip-name">' + t.name + '</span>';
          // Use closure to capture t.id correctly
          b.addEventListener('click', (function(typeId){ return function(){ window.mobSelectType(typeId); }; })(t.id));
          row.appendChild(b);
        });
        grid.appendChild(row);
      });
    } catch(e){ console.error('renderTypeGrid:', e); }
  }

  window.mobSelectType = function(id){
    _qrType = id;
    document.querySelectorAll('.mob-type-chip').forEach(function(c){
      var tid = c.getAttribute('data-type');
      var isActive = tid===id;
      c.classList.toggle('active', isActive);
      var icon = c.querySelector('.mob-chip-icon');
      if(icon){
        var bg   = TYPE_BG[tid]   || 'rgba(255,255,255,0.07)';
        var glow = TYPE_GLOW[tid] || 'rgba(255,255,255,0.2)';
        icon.style.background  = bg;
        icon.style.boxShadow   = isActive ? '0 0 12px '+glow : '';
        icon.innerHTML = TYPE_SVG_COLOR[tid] || TYPE_SVG[tid] || '';
      }
    });
    renderQRForm();
    // Auto-scroll to the Content card after a short delay (let form render)
    setTimeout(function(){
      var formCard = $id('mobQRFormCard');
      if(formCard){
        formCard.scrollIntoView({behavior:'smooth', block:'start'});
        // Focus first input for quick typing
        var firstInput = formCard.querySelector('input,textarea,select');
        if(firstInput) setTimeout(function(){ firstInput.focus(); }, 400);
      }
    }, 80);
  };

  // ── QR Form builder ──────────────────────────────────────
  // ── Form definitions for all 20 types ────────────────────
  var MOB_FORMS = {
    url:       [{id:'url_url',     label:'Website URL',         type:'url',           ph:'https://example.com'}],
    text:      [{id:'text_text',   label:'Text Content',        type:'textarea',       ph:'Enter any text…'}],
    wifi:      [{id:'wifi_ssid',   label:'Network Name (SSID)', type:'text',           ph:'MyNetwork'},
                {id:'wifi_pass',   label:'Password',            type:'password',       ph:'Password'},
                {id:'wifi_enc',    label:'Security',            type:'select',         opts:['WPA','WEP','nopass']}],
    vcard:     [{id:'vc_name',     label:'Full Name',           type:'text',           ph:'Jane Doe'},
                {id:'vc_org',      label:'Organisation',        type:'text',           ph:'Acme Inc.'},
                {id:'vc_phone',    label:'Phone',               type:'tel',            ph:'+1 555 000 0000'},
                {id:'vc_email',    label:'Email',               type:'email',          ph:'jane@example.com'},
                {id:'vc_web',      label:'Website',             type:'url',            ph:'https://janedoe.com'}],
    email:     [{id:'email_to',    label:'To',                  type:'email',          ph:'hello@example.com'},
                {id:'email_sub',   label:'Subject',             type:'text',           ph:'Subject line'},
                {id:'email_body',  label:'Body',                type:'textarea',       ph:'Message…'}],
    phone:     [{id:'phone_num',   label:'Phone Number',        type:'tel',            ph:'+1 555 000 0000'}],
    sms:       [{id:'sms_num',     label:'Number',              type:'tel',            ph:'+1 555 000 0000'},
                {id:'sms_msg',     label:'Message',             type:'textarea',       ph:'Your message…'}],
    whatsapp:  [{id:'wa_num',      label:'WhatsApp Number',     type:'tel',            ph:'+1 555 000 0000'},
                {id:'wa_msg',      label:'Pre-filled Message',  type:'textarea',       ph:'Hello…'}],
    event:     [{id:'ev_title',    label:'Event Title',         type:'text',           ph:'Team Meeting'},
                {id:'ev_start',    label:'Start',               type:'datetime-local', ph:''},
                {id:'ev_end',      label:'End',                 type:'datetime-local', ph:''},
                {id:'ev_loc',      label:'Location',            type:'text',           ph:'Conference Room'}],
    location:  [{id:'geo_lat',     label:'Latitude',            type:'text',           ph:'40.7128'},
                {id:'geo_lng',     label:'Longitude',           type:'text',           ph:'-74.0060'}],
    review:    [{id:'rev_url',     label:'Review URL or Place ID', type:'text',        ph:'https://g.page/…'}],
    document:  [{id:'doc_url',     label:'Document URL',        type:'url',            ph:'https://example.com/file.pdf'},
                {id:'doc_title',   label:'Title (optional)',    type:'text',           ph:'Annual Report 2024'}],
    media:     [{id:'media_url',   label:'Media URL',           type:'url',            ph:'https://example.com/video'}],
    freelance: [{id:'fl_url',      label:'Profile URL',         type:'url',            ph:'https://upwork.com/freelancers/…'},
                {id:'fl_name',     label:'Your Name',           type:'text',           ph:'Jane Doe'},
                {id:'fl_role',     label:'Specialty',           type:'text',           ph:'UI/UX Designer'}],
    instagram: [{id:'social_platform', label:'Platform',        type:'select',         opts:['instagram','twitter','linkedin','tiktok','youtube','github']},
                {id:'social_user', label:'Username or URL',     type:'text',           ph:'@username'}],
    upi:       [{id:'upi_id',      label:'UPI ID',              type:'text',           ph:'name@upi'},
                {id:'upi_name',    label:'Payee Name',          type:'text',           ph:'John Doe'},
                {id:'upi_amt',     label:'Amount ₹ (optional)', type:'number',         ph:'500'}],
    crypto:    [{id:'crypto_coin', label:'Currency',            type:'select',         opts:['bitcoin','ethereum','litecoin']},
                {id:'crypto_addr', label:'Wallet Address',      type:'text',           ph:'1A1zP1eP5QGefi2…'},
                {id:'crypto_amt',  label:'Amount (optional)',   type:'number',         ph:'0.001'}],
    app:       [{id:'app_url',     label:'App Store URL',       type:'url',            ph:'https://apps.apple.com/…'},
                {id:'app_deep',    label:'Deep Link (optional)',type:'url',            ph:'myapp://screen/home'}],
    totp:      [{id:'totp_account',label:'Account Name',        type:'text',           ph:'user@example.com'},
                {id:'totp_issuer', label:'Issuer',              type:'text',           ph:'GitHub'},
                {id:'totp_secret', label:'Secret Key',          type:'text',           ph:'BASE32SECRET'}],
    json:      [{id:'json_data',   label:'JSON Payload',        type:'textarea',       ph:'{"key":"value"}'}],
    custom:    [{id:'custom_raw',  label:'Raw QR Content',      type:'textarea',       ph:'Any raw string or URI…'}],
  };

  function renderQRForm(){
    var area = $id('mobQRFormArea'); if(!area) return;
    area.innerHTML = '';
    var fields = MOB_FORMS[_qrType];
    if(!fields) return;
    var formCard = $id('mobQRFormCard');
    if(formCard) formCard.style.display = '';
    fields.forEach(function(f){
      var wrapper = document.createElement('div');
      wrapper.className = 'mob-field';
      var lbl = document.createElement('label');
      lbl.className = 'mob-field-label';
      lbl.textContent = f.label;
      wrapper.appendChild(lbl);
      var el;
      if(f.type==='textarea'){
        el = document.createElement('textarea');
        el.className = 'mob-input mob-textarea';
        el.rows = 3;
        el.placeholder = f.ph||'';
      } else if(f.type==='select'){
        el = document.createElement('select');
        el.className = 'mob-input mob-select';
        (f.opts||[]).forEach(function(o){
          var op = document.createElement('option');
          op.value = o; op.textContent = o;
          el.appendChild(op);
        });
      } else {
        el = document.createElement('input');
        el.type = f.type||'text';
        el.className = 'mob-input';
        el.placeholder = f.ph||'';
      }
      el.id = 'mob_'+f.id;
      wrapper.appendChild(el);
      area.appendChild(wrapper);
    });
  }

  // ── Build QR content string ──────────────────────────────
  function buildQRContent(){
    function v(id){ var el=$id('mob_'+id); return el?el.value.trim():''; }
    switch(_qrType){
      case 'url':       return v('url_url')||'https://example.com';
      case 'text':      return v('text_text');
      case 'wifi':      return 'WIFI:T:'+($id('mob_wifi_enc')?$id('mob_wifi_enc').value:'WPA')+';S:'+v('wifi_ssid')+';P:'+v('wifi_pass')+';;';
      case 'vcard':     return 'BEGIN:VCARD\nVERSION:3.0\nFN:'+v('vc_name')+'\nORG:'+v('vc_org')+'\nTEL:'+v('vc_phone')+'\nEMAIL:'+v('vc_email')+'\nURL:'+v('vc_web')+'\nEND:VCARD';
      case 'email': {var to=v('email_to');if(!to)return'';var pp=[];var sub=v('email_sub');var body=v('email_body');if(sub)pp.push('subject='+encodeURIComponent(sub));if(body)pp.push('body='+encodeURIComponent(body));return'mailto:'+to+(pp.length?'?'+pp.join('&'):'');}
      case 'phone':     return 'tel:'+v('phone_num');
      case 'sms':       return 'sms:'+v('sms_num')+(v('sms_msg')?'?body='+encodeURIComponent(v('sms_msg')):'');
      case 'whatsapp':  return 'https://wa.me/'+v('wa_num').replace(/\D/g,'')+(v('wa_msg')?'?text='+encodeURIComponent(v('wa_msg')):'');
      case 'event': {var fmt=function(s){return s?s.replace(/[-:T]/g,'').slice(0,15):'';};return'BEGIN:VEVENT\nSUMMARY:'+v('ev_title')+'\nDTSTART:'+fmt(($id('mob_ev_start')||{}).value||'')+'\nDTEND:'+fmt(($id('mob_ev_end')||{}).value||'')+'\nLOCATION:'+v('ev_loc')+'\nEND:VEVENT';}
      case 'location':  return 'geo:'+v('geo_lat')+','+v('geo_lng');
      case 'review': {var rid=v('rev_url');if(!rid)return'';return rid;}
      case 'document':  return v('doc_url');
      case 'media':     return v('media_url');
      case 'freelance': return v('fl_url');
      case 'instagram': {var user=v('social_user');if(!user)return'';if(user.startsWith('http'))return user;var plat=$id('mob_social_platform')?$id('mob_social_platform').value:'instagram';var bases={instagram:'https://instagram.com/',twitter:'https://twitter.com/',linkedin:'https://linkedin.com/in/',tiktok:'https://tiktok.com/@',youtube:'https://youtube.com/@',github:'https://github.com/'};return(bases[plat]||'https://')+user.replace('@','');}
      case 'upi':       return 'upi://pay?pa='+encodeURIComponent(v('upi_id'))+'&pn='+encodeURIComponent(v('upi_name'))+(v('upi_amt')?'&am='+v('upi_amt'):'');
      case 'crypto': {var coin=$id('mob_crypto_coin')?$id('mob_crypto_coin').value:'bitcoin';return coin+':'+v('crypto_addr')+(v('crypto_amt')?'?amount='+v('crypto_amt'):'');}
      case 'app':       return v('app_deep')||v('app_url');
      case 'totp':      return 'otpauth://totp/'+encodeURIComponent(v('totp_account'))+'?secret='+v('totp_secret')+(v('totp_issuer')?'&issuer='+encodeURIComponent(v('totp_issuer')):'');
      case 'json':      return v('json_data');
      case 'custom':    return v('custom_raw');
      default: return '';
    }
  }

  // ── Generate QR ──────────────────────────────────────────
  window.mobDoGenQR = function(){
    var content = buildQRContent();
    if(!content){ toast('Please enter some content first'); return; }
    try{
      var size = _qrSize * 40;
      var canvas = document.createElement('canvas');
      QRCode.toCanvas(canvas, content, {
        width: size,
        errorCorrectionLevel: _ec,
        color:{ dark:_darkCol, light:_lightCol }
      }, function(err){
        if(err){ toast('Generation failed: '+err.message); return; }
        var wrap = $id('mobQRCanvasWrap');
        if(wrap){
          wrap.innerHTML='';
          canvas.style.borderRadius='8px';
          canvas.style.maxWidth='100%';
          wrap.appendChild(canvas);
        }
        var pc = $id('mobQRPreviewCard');
        if(pc) pc.style.display='';
        // Show download/copy actions
        var actRow = $id('mobQRActions');
        if(actRow){
          actRow.style.display='flex';
          actRow.innerHTML =
            '<button class="btn btn-primary btn-sm" onclick="mobDLQR()">⬇ Download</button>'+
            '<button class="btn btn-ghost btn-sm" onclick="mobCopyQR()">⧉ Copy</button>'+
            '<button class="btn btn-ghost btn-sm" onclick="mobShareQR()">↗ Share</button>';
        }
        // History
        _qrHistory.unshift({type:_qrType, content:content, canvas:canvas, ts:Date.now()});
        if(_qrHistory.length>20) _qrHistory.pop();
        // Scroll to preview
        setTimeout(function(){ var p=$id('mobQRPreviewCard');if(p)p.scrollIntoView({behavior:'smooth',block:'nearest'}); },120);
        toast('QR code generated ✦');
      });
    }catch(e){ toast('Error: '+e.message); }
  };

  // Download / copy / share helpers for QR
  function getQRCanvas(){ return $id('mobQRCanvasWrap') && $id('mobQRCanvasWrap').querySelector('canvas'); }
  window.mobDLQR = function(){
    var c=getQRCanvas(); if(!c){toast('Generate a QR first');return;}
    var a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='nexascan-qr.png'; document.body.appendChild(a); a.click(); a.remove();
  };
  window.mobCopyQR = function(){
    var c=getQRCanvas(); if(!c){toast('Generate a QR first');return;}
    function copyTextFallback(){
      var item=_qrHistory&&_qrHistory[0];
      if(item&&item.content&&navigator.clipboard&&navigator.clipboard.writeText){
        return navigator.clipboard.writeText(item.content).then(function(){ toast('QR data copied ✦'); return true; });
      }
      return Promise.resolve(false);
    }
    if(!navigator.clipboard||!window.ClipboardItem){
      copyTextFallback().then(function(ok){ if(!ok)toast('Copy not supported in this browser'); }).catch(function(){ toast('Copy not supported in this browser'); });
      return;
    }
    c.toBlob(function(b){ navigator.clipboard.write([new ClipboardItem({'image/png':b})]).then(function(){ toast('Copied to clipboard ✦'); }).catch(function(){ copyTextFallback().then(function(ok){ if(!ok)toast('Copy not supported in this browser'); }).catch(function(){ toast('Copy not supported in this browser'); }); }); });
  };
  window.mobShareQR = function(){
    var c=getQRCanvas(); if(!c){toast('Generate a QR first');return;}
    c.toBlob(function(b){
      var f=new File([b],'nexascan-qr.png',{type:'image/png'});
      if(navigator.share && navigator.canShare&&navigator.canShare({files:[f]})){
        navigator.share({files:[f],title:'NexaScan QR Code'}).catch(function(){});
      } else { mobDLQR(); }
    });
  };

  // ── EC / Size / Color sync ────────────────────────────────
  window.mobSetEC = function(ec, btn){
    _ec = ec;
    document.querySelectorAll('.mob-ec-btn').forEach(function(b){ b.classList.remove('active'); });
    if(btn) btn.classList.add('active');
  };
  window.mobSyncSize = function(v){
    _qrSize = parseInt(v);
    var lbl = $id('mobSizeVal'); if(lbl) lbl.textContent = v+' px';
  };
  window.mobSyncColor = function(which, val){
    if(which==='dark'){
      _darkCol = val;
      var sw=$id('mobDarkSwatch'); if(sw) sw.style.background=val;
      var vl=$id('mobDarkVal'); if(vl) vl.textContent=val;
    } else {
      _lightCol = val;
      var sw=$id('mobLightSwatch'); if(sw) sw.style.background=val;
      var vl=$id('mobLightVal'); if(vl) vl.textContent=val;
    }
  };
  window.mobApplyQRPreset = function(dark, light){
    _darkCol=dark; _lightCol=light;
    var dc=$id('mobDarkColor'); if(dc){dc.value=dark; mobSyncColor('dark',dark);}
    var lc=$id('mobLightColor'); if(lc){lc.value=light; mobSyncColor('light',light);}
  };

  // ── BC Format Row ─────────────────────────────────────────
  function renderFmtRow(){
    var row = $id('mobFmtScroll'); if(!row) return;
    row.innerHTML='';
    BC_FMTS.forEach(function(f){
      var b=document.createElement('button');
      b.className='mob-fmt-btn'+(f.id===_bcFmt?' active':'');
      b.textContent=f.label;
      b.onclick=function(){ mobSelectFmt(f.id, f, b); };
      row.appendChild(b);
    });
  }
  window.mobSelectFmt = function(id, fmt, btn){
    _bcFmt=id;
    document.querySelectorAll('.mob-fmt-btn').forEach(function(b){ b.classList.remove('active'); });
    if(btn) btn.classList.add('active');
    var info=$id('mobFmtInfo'); if(info) info.textContent=(fmt&&fmt.hint)||id;
    var lbl=$id('mobBCInputLabel'); if(lbl) lbl.textContent=(fmt&&fmt.label)||'Value';
    var inp=$id('mobBCInput'); if(inp) inp.placeholder='Enter '+(fmt&&fmt.label)||'value'+'…';
    var hint=$id('mobBCHint');
    if(hint) hint.textContent=(fmt&&fmt.hint)||'';
    // also click the corresponding desktop format button
    try{
      var dBtn=document.querySelector('.bc-fmt-btn[data-format="'+id+'"]');
      if(!dBtn) dBtn=Array.from(document.querySelectorAll('.bc-fmt-btn')).find(function(b){ return b.textContent.trim().toUpperCase()===id.toUpperCase(); });
      if(dBtn) dBtn.click();
    }catch(e){}
  };

  // ── BC Input sync ─────────────────────────────────────────
  window.mobSyncBCInput = function(val){
    try{
      var dInput = $id('bcInput');
      if(dInput){ dInput.value=val; dInput.dispatchEvent(new Event('input',{bubbles:true})); }
    }catch(e){}
  };

  // ── Generate Barcode ──────────────────────────────────────
  window.mobDoGenBC = function(){
    var inp = $id('mobBCInput');
    var val = inp ? inp.value.trim() : '';
    if(!_bcFmt){ toast('Please select a barcode format first'); return; }
    if(!val){ toast('Please enter a value to encode'); return; }
    // Sync desktop fields
    try{
      var dInp=$id('bcInput'); if(dInp){ dInp.value=val; dInp.dispatchEvent(new Event('input',{bubbles:true})); }
      var dBar=$id('bcBarColor'); if(dBar){ dBar.value=_bcBarCol; dBar.dispatchEvent(new Event('input',{bubbles:true})); }
      var dBg=$id('bcBgColor'); if(dBg){ dBg.value=_bcBgCol; dBg.dispatchEvent(new Event('input',{bubbles:true})); }
      var dH=$id('bcHeightSlider'); if(dH){ dH.value=_bcHeight; dH.dispatchEvent(new Event('input',{bubbles:true})); }
      var dS=$id('bcScaleSlider'); if(dS){ dS.value=_bcScale; dS.dispatchEvent(new Event('input',{bubbles:true})); }
      var dTx=$id('bcShowText'); if(dTx){ dTx.checked=_bcShowTx; dTx.dispatchEvent(new Event('change',{bubbles:true})); }
    }catch(e){}
    // Trigger desktop generate
    try{
      var btn=$id('bcGenerateBtn'); if(btn) btn.click();
    }catch(e){}
    // Wait for canvas to render then copy it
    setTimeout(function(){
      try{
        var dCanvas=$id('bcCanvas');
        if(!dCanvas||!dCanvas.width){ toast('Error rendering barcode — check format/value'); return; }
        var newCanvas=document.createElement('canvas');
        newCanvas.width=dCanvas.width; newCanvas.height=dCanvas.height;
        newCanvas.getContext('2d').drawImage(dCanvas,0,0);
        newCanvas.style.maxWidth='100%'; newCanvas.style.borderRadius='8px';
        var wrap=$id('mobBCCanvasWrap');
        if(wrap){ wrap.innerHTML=''; wrap.appendChild(newCanvas); }
        var pc=$id('mobBCPreviewCard'); if(pc) pc.style.display='';
        var actRow=$id('mobBCActions');
        if(actRow){
          actRow.style.display='flex';
          actRow.innerHTML=
            '<button class="btn btn-cyan btn-sm" onclick="mobDLBC()">⬇ Download</button>'+
            '<button class="btn btn-ghost btn-sm" onclick="mobCopyBC()">⧉ Copy</button>';
        }
        _bcHistory.unshift({fmt:_bcFmt, val:val, canvas:newCanvas, ts:Date.now()});
        if(_bcHistory.length>20) _bcHistory.pop();
        setTimeout(function(){ var p=$id('mobBCPreviewCard');if(p)p.scrollIntoView({behavior:'smooth',block:'nearest'}); },120);
        toast('Barcode generated ▬▬');
      }catch(e){ toast('Render error: '+e.message); }
    }, 350);
  };

  function getBCCanvas(){ return $id('mobBCCanvasWrap')&&$id('mobBCCanvasWrap').querySelector('canvas'); }
  window.mobDLBC=function(){var c=getBCCanvas();if(!c){toast('Generate a barcode first');return;}var a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='nexascan-bc.png';document.body.appendChild(a);a.click();a.remove();};
  window.mobCopyBC=function(){
    var c=getBCCanvas();if(!c){toast('Generate a barcode first');return;}
    function copyTextFallback(){
      var item=_bcHistory&&_bcHistory[0];
      if(item&&item.val&&navigator.clipboard&&navigator.clipboard.writeText){
        return navigator.clipboard.writeText(item.val).then(function(){toast('Barcode value copied ✦');return true;});
      }
      return Promise.resolve(false);
    }
    if(!navigator.clipboard||!window.ClipboardItem){
      copyTextFallback().then(function(ok){if(!ok)toast('Copy not supported');}).catch(function(){toast('Copy not supported');});
      return;
    }
    c.toBlob(function(b){
      navigator.clipboard.write([new ClipboardItem({'image/png':b})]).then(function(){toast('Copied ✦');}).catch(function(){
        copyTextFallback().then(function(ok){if(!ok)toast('Copy not supported');}).catch(function(){toast('Copy not supported');});
      });
    });
  };

  // ── BC Style sync ──────────────────────────────────────────
  window.mobSyncBCColor=function(which,val){
    if(which==='bar'){ _bcBarCol=val; var sw=$id('mobBCBarSwatch');if(sw)sw.style.background=val; var vl=$id('mobBCBarVal');if(vl)vl.textContent=val; }
    else { _bcBgCol=val; var sw=$id('mobBCBgSwatch');if(sw)sw.style.background=val; var vl=$id('mobBCBgVal');if(vl)vl.textContent=val; }
  };
  window.mobSyncBCHeight=function(v){ _bcHeight=parseInt(v); var lbl=$id('mobBCHeightVal');if(lbl)lbl.textContent=v+' px'; };
  window.mobSyncBCScale=function(v){ _bcScale=parseFloat(v); var lbl=$id('mobBCScaleVal');if(lbl)lbl.textContent=v+'×'; };
  window.mobSyncBCShowText=function(v){ _bcShowTx=v; };
  window.mobApplyBCPreset=function(bar,bg){
    _bcBarCol=bar; _bcBgCol=bg;
    var bc=$id('mobBCBarColor');if(bc){bc.value=bar;mobSyncBCColor('bar',bar);}
    var bg2=$id('mobBCBgColor');if(bg2){bg2.value=bg;mobSyncBCColor('bg',bg);}
  };

  // ── Decode ────────────────────────────────────────────────
  // ── Live Camera Scanner ───────────────────────────────────
  var _scanStream  = null;
  var _scanRaf     = null;
  var _scanRunning = false;
  var _facingMode  = 'environment'; // rear cam first

  window.mobStartScan = function(){
    if(_scanRunning) return;
    if(!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'){
      toast('Camera requires a secure connection (HTTPS)'); return;
    }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
      toast('Camera not supported on this device'); return;
    }
    var constraints = {video:{facingMode:_facingMode,width:{ideal:1280},height:{ideal:1280}}};
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
      _scanStream  = stream;
      _scanRunning = true;
      var video = $id('mobScanVideo');
      video.srcObject = stream;
      video.style.display = 'block';
      video.onloadedmetadata = function(){
        var playPromise = video.play();
        if(playPromise && typeof playPromise.then === 'function'){
          playPromise.then(function(){ startFrameLoop(); }).catch(function(e){
            console.warn('video.play() rejected:',e);
            // Try starting the loop anyway after a short wait
            setTimeout(startFrameLoop, 300);
          });
        } else {
          setTimeout(startFrameLoop, 100);
        }
      };
      // UI switch — null-guard every element
      var vfIdle=$id('mobVFIdle');     if(vfIdle)   vfIdle.style.display='none';
      var vfAct=$id('mobVFActive');    if(vfAct)    vfAct.style.display='';
      var vfSucc=$id('mobVFSuccess');  if(vfSucc)   vfSucc.style.display='none';
      var scanAct=$id('mobScanActions'); if(scanAct) scanAct.style.display='none';
      var scanCtrl=$id('mobScanLiveCtrl'); if(scanCtrl) scanCtrl.style.display='flex';
      // Hide result while scanning
      var rc = $id('mobDecodeResultCard'); if(rc) rc.style.display='none';
    }).catch(function(err){
      var msg = err.name==='NotAllowedError'
        ? 'Camera permission denied — please allow camera access'
        : 'Could not start camera: '+err.message;
      toast(msg);
    });
  };

  function startFrameLoop(){
    var video  = $id('mobScanVideo');
    var canvas = $id('mobScanCanvas');
    if(!canvas||!video) return;
    var _noDataFrames = 0;
    function tick(){
      if(!_scanRunning) return;
      if(video.readyState >= video.HAVE_ENOUGH_DATA){
        _noDataFrames = 0;
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 480;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video,0,0,canvas.width,canvas.height);
        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        try{
          if(typeof jsQR === 'function'){
            // Primary attempt — no inversion
            var code = jsQR(imageData.data,canvas.width,canvas.height,{inversionAttempts:'dontInvert'});
            if(!code){
              // Fallback — try with inversion (white-on-dark QR codes)
              code = jsQR(imageData.data,canvas.width,canvas.height,{inversionAttempts:'onlyInvert'});
            }
            if(code && code.data){
              onScanSuccess(code.data); return;
            }
          }
          // jsQR not yet loaded — keep looping silently
        }catch(e){ console.warn('jsQR frame error:',e); }
      } else {
        _noDataFrames++;
        if(_noDataFrames > 300){ // ~5s of no data — abort
          toast('Camera stream lost — please try again');
          mobStopScan(); return;
        }
      }
      _scanRaf = requestAnimationFrame(tick);
    }
    _scanRaf = requestAnimationFrame(tick);
  }

  function onScanSuccess(data){
    _scanRunning = false;
    if(_scanRaf){ cancelAnimationFrame(_scanRaf); _scanRaf=null; }
    // Show success flash for 1.2s then stop camera
    var vfAct=$id('mobVFActive');   if(vfAct)  vfAct.style.display='none';
    var vfSucc=$id('mobVFSuccess'); if(vfSucc) vfSucc.style.display='';
    setTimeout(function(){
      mobStopScan(true);
      showMobDecodeResult(data);
    }, 1200);
  }

  window.mobStopScan = function(keepResult){
    _scanRunning = false;
    if(_scanRaf){ cancelAnimationFrame(_scanRaf); _scanRaf=null; }
    if(_scanStream){
      try{ _scanStream.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      _scanStream=null;
    }
    var video=$id('mobScanVideo');
    if(video){ try{ video.pause(); }catch(e){} video.srcObject=null; video.style.display='none'; }
    // Reset UI — use safe null-check for each element
    var idle=$id('mobVFIdle');    if(idle)   idle.style.display='';
    var act=$id('mobVFActive');   if(act)    act.style.display='none';
    var succ=$id('mobVFSuccess'); if(succ)   succ.style.display='none';
    var sa=$id('mobScanActions'); if(sa)     sa.style.display='flex';
    var lc=$id('mobScanLiveCtrl');if(lc)     lc.style.display='none';
  };

  window.mobFlipCamera = function(){
    _facingMode = (_facingMode==='environment') ? 'user' : 'environment';
    mobStopScan();
    // Small delay so tracks fully close before opening new stream
    setTimeout(function(){ mobStartScan(); }, 400);
  };

  window.mobScanAnother = function(){
    // Stop any running scan first
    if(_scanRunning) mobStopScan();
    // Reset viewfinder states
    var idle=$id('mobVFIdle');     if(idle)    idle.style.display='';
    var active=$id('mobVFActive'); if(active)  active.style.display='none';
    var succ=$id('mobVFSuccess');  if(succ)    succ.style.display='none';
    // Reset action buttons
    var sa=$id('mobScanActions');    if(sa)  sa.style.display='flex';
    var lc=$id('mobScanLiveCtrl');   if(lc)  lc.style.display='none';
    // Hide result card
    var rc=$id('mobDecodeResultCard'); if(rc) rc.style.display='none';
    // Reset file input so same file can be re-scanned
    var fi=$id('mobQRFileIn'); if(fi) fi.value='';
  };

  function showMobDecodeResult(data){
    var isURL   = /^https?:\/\//i.test(data);
    var isEmail = /^mailto:/i.test(data);
    var isTel   = /^tel:/i.test(data);
    var typeLabel = isURL?'URL':isEmail?'Email':isTel?'Phone':'Text';
    var displayData = data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // Build action HTML using data-attributes — no inline script strings
    var openBtn = isURL
      ? '<button class="btn btn-primary btn-sm mob-res-open">Open ↗</button>'
      : '';
    var copyBtn = '<button class="btn btn-ghost btn-sm mob-res-copy">⧉ Copy</button>';

    var rc=$id('mobDecodeResultCard');
    var rr=$id('mobQRDecodeResult');
    if(rr){
      rr.innerHTML =
        '<div class="mob-decode-result-type">'+typeLabel+'</div>'
        +'<div class="mob-decode-result-inner">'+displayData+'</div>'
        +'<div class="mob-decode-result-actions">'+openBtn+copyBtn+'</div>';

      // Wire buttons safely — no eval/interpolation
      var openEl = rr.querySelector('.mob-res-open');
      if(openEl) openEl.addEventListener('click', function(){ window.open(data,'_blank','noopener,noreferrer'); });
      var copyEl = rr.querySelector('.mob-res-copy');
      if(copyEl) copyEl.addEventListener('click', function(){
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(data).then(function(){ toast('Copied ✦'); }).catch(function(){ toast('Copy failed','error'); });
        } else {
          // Fallback for older browsers / non-HTTPS
          try{
            var ta=document.createElement('textarea'); ta.value=data;
            ta.style.cssText='position:fixed;top:-9999px;left:-9999px;opacity:0';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy');
            document.body.removeChild(ta); toast('Copied ✦');
          }catch(e){ toast('Copy not supported','error'); }
        }
      });
    }
    if(rc) rc.style.display='';
    // Add to history
    _qrHistory.unshift({type:'scan', content:data, canvas:null, ts:Date.now()});
    if(_qrHistory.length>20) _qrHistory.pop();
    setTimeout(function(){ if(rc) rc.scrollIntoView({behavior:'smooth',block:'nearest'}); },120);
    toast('QR code decoded ✦');
  }

  function setupDecode(){
    var qrIn=$id('mobQRFileIn');
    var qrDrop=$id('mobQRDrop');
    if(qrDrop){
      qrDrop.addEventListener('dragover',function(e){e.preventDefault();qrDrop.style.borderColor='var(--v)';});
      qrDrop.addEventListener('dragleave',function(){qrDrop.style.borderColor='';});
      qrDrop.addEventListener('drop',function(e){
        e.preventDefault(); qrDrop.style.borderColor='';
        var file=e.dataTransfer&&e.dataTransfer.files[0];
        if(file) decodeQRFile(file);
      });
    }
    if(qrIn) qrIn.onchange=function(){ if(this.files[0]) decodeQRFile(this.files[0]); };
    // Stop camera when page visibility changes (user switches apps)
    document.addEventListener('visibilitychange', function(){
      if(document.hidden && _scanRunning) mobStopScan();
    });
  }

  function decodeQRFile(file){
    if(!file) return;
    if(!file.type.startsWith('image/')){
      toast('Please upload an image file (PNG, JPG, WebP)','error'); return;
    }
    if(file.size > 20 * 1024 * 1024){ // 20MB guard
      toast('Image too large — please use a smaller file','error'); return;
    }
    var rc=$id('mobDecodeResultCard');
    var rr=$id('mobQRDecodeResult');
    if(rr) rr.innerHTML='<div class="mob-result-empty"><div class="mob-ph-icon">⟳</div>Decoding…</div>';
    if(rc) rc.style.display='';
    var reader=new FileReader();
    reader.onload=function(ev){
      var img=new Image();
      img.onload=function(){
        var cv=document.createElement('canvas');
        cv.width=img.width; cv.height=img.height;
        var ctx=cv.getContext('2d'); ctx.drawImage(img,0,0);
        var id2=ctx.getImageData(0,0,cv.width,cv.height);

        // 1) Try jsQR (QR codes — fast, no server)
        if(typeof jsQR==='function'){
          var qr=jsQR(id2.data,cv.width,cv.height,{inversionAttempts:'dontInvert'});
          if(!qr) qr=jsQR(id2.data,cv.width,cv.height,{inversionAttempts:'onlyInvert'});
          if(qr){ showMobDecodeResult(qr.data); return; }
        }

        // 2) Try native BarcodeDetector API (Chrome/Edge/Android — supports all formats)
        if('BarcodeDetector' in window){
          var bd=new BarcodeDetector({formats:['qr_code','ean_13','ean_8','upc_a','upc_e','code_128','code_39','code_93','itf','codabar','data_matrix','aztec','pdf417']});
          bd.detect(img).then(function(codes){
            if(codes.length>0){ showMobDecodeResult(codes[0].rawValue); }
            else { tryZXingFallback(cv,id2,rr); }
          }).catch(function(){ tryZXingFallback(cv,id2,rr); });
          return;
        }

        // 3) ZXing fallback (all barcode formats)
        tryZXingFallback(cv,id2,rr);
      };
      img.onerror=function(){
        if(rr) rr.innerHTML='<div class="mob-result-empty"><div class="mob-ph-icon">⊗</div>Failed to read image file</div>';
      };
      img.src=ev.target.result;
    };
    reader.onerror=function(){
      if(rr) rr.innerHTML='<div class="mob-result-empty"><div class="mob-ph-icon">⊗</div>Failed to read file</div>';
    };
    reader.readAsDataURL(file);
  }

  function tryZXingFallback(cv,imageData,rr){
    if(typeof ZXing==='undefined'){
      if(rr) rr.innerHTML='<div class="mob-result-empty"><div class="mob-ph-icon">⊗</div>No code found — try a clearer image</div>';
      return;
    }
    try{
      var codeReader=new ZXing.BrowserMultiFormatReader();
      var luminanceSource=new ZXing.RGBLuminanceSource(imageData.data,imageData.width,imageData.height);
      var binaryBitmap=new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(luminanceSource));
      var result=null;
      try{ result=codeReader.decode(binaryBitmap); }catch(e){}
      if(!result){
        // Try inverted — preserve alpha channel (same as desktop working version)
        var invertedData=new Uint8ClampedArray(imageData.data.length);
        for(var i=0;i<imageData.data.length;i+=4){
          invertedData[i]  =255-imageData.data[i];
          invertedData[i+1]=255-imageData.data[i+1];
          invertedData[i+2]=255-imageData.data[i+2];
          invertedData[i+3]=imageData.data[i+3]; // preserve alpha
        }
        var invSource=new ZXing.RGBLuminanceSource(invertedData,imageData.width,imageData.height);
        var invBitmap=new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(invSource));
        try{ result=codeReader.decode(invBitmap); }catch(e){}
      }
      // ZXing 0.21.3 uses result.text (not .getText())
      var resultText = result && (result.text || (typeof result.getText==='function' && result.getText()));
      if(resultText){
        showMobDecodeResult(resultText);
      } else {
        if(rr) rr.innerHTML='<div class="mob-result-empty"><div class="mob-ph-icon">⊗</div>No barcode or QR code found — try a clearer image</div>';
      }
    }catch(e){
      console.warn('ZXing decode error:',e);
      if(rr) rr.innerHTML='<div class="mob-result-empty"><div class="mob-ph-icon">⊗</div>Decode error — try a different image</div>';
    }
  }


  // ── History renderer ──────────────────────────────────────
  function renderHistory(){
    // QR
    var qrList=$id('mobQRHistList');
    if(qrList){
      if(_qrHistory.length===0){ qrList.innerHTML='<div class="mob-no-hist">No QR codes generated yet in this session</div>'; }
      else{
        qrList.innerHTML='';
        _qrHistory.forEach(function(h){
          var item=document.createElement('div');
          item.className='mob-hist-item';
          var thumb='';
          try{ if(h.canvas) thumb='<img src="'+h.canvas.toDataURL()+'" width="36" height="36" style="border-radius:4px;object-fit:cover">'; }catch(e){}
          item.innerHTML='<div class="mob-hist-thumb">'+(thumb||'▣')+'</div><div class="mob-hist-info"><div class="mob-hist-type">'+h.type+'</div><div class="mob-hist-val">'+h.content+'</div></div>';
          qrList.appendChild(item);
        });
      }
    }
    // BC
    var bcList=$id('mobBCHistList');
    if(bcList){
      if(_bcHistory.length===0){ bcList.innerHTML='<div class="mob-no-hist">No barcodes generated yet in this session</div>'; }
      else{
        bcList.innerHTML='';
        _bcHistory.forEach(function(h){
          var item=document.createElement('div');
          item.className='mob-hist-item';
          var thumb='';
          try{ if(h.canvas) thumb='<img src="'+h.canvas.toDataURL()+'" height="36" style="border-radius:4px;object-fit:contain;background:#fff;padding:2px">'; }catch(e){}
          item.innerHTML='<div class="mob-hist-thumb">'+(thumb||'▬')+'</div><div class="mob-hist-info"><div class="mob-hist-type">'+h.fmt+'</div><div class="mob-hist-val">'+h.val+'</div></div>';
          bcList.appendChild(item);
        });
      }
    }
  }

  // ── Init ──────────────────────────────────────────────────
  function init(){
    resolveNavElements();
    renderTypeGrid();
    renderQRForm();
    renderFmtRow();
    setupDecode();
    mobNavGo('qr');
    setTimeout(function(){
      try{
        if(!$id('mobTypeGrid')||$id('mobTypeGrid').children.length===0) renderTypeGrid();
        if(!$id('mobQRFormArea')||$id('mobQRFormArea').children.length===0) renderQRForm();
        if(!$id('mobFmtScroll')||$id('mobFmtScroll').children.length===0) renderFmtRow();
      }catch(e){}
    },100);
  }

  function runMobInit(){
    if(window.innerWidth > 768) return; // desktop: skip entirely
    // Show mobile app shell
    var app = document.getElementById('mobApp');
    if(app){ app.style.setProperty('display','flex','important'); }
    // Hide curtain (desktop splash)
    var crt = document.getElementById('curtain');
    if(crt){ crt.style.setProperty('display','none','important'); }
    // Hide desktop nav
    var snav = document.getElementById('sectionNav');
    if(snav){ snav.style.setProperty('display','none','important'); }
    var themeToggle = document.getElementById('scanThemeToggle');
    if(themeToggle){ themeToggle.classList.add('theme-visible'); }
    window._mobInitDone = true;
    init();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', runMobInit);
  } else {
    runMobInit();
  }
  window.addEventListener('resize', function(){
    if(window.innerWidth<=768 && !window._mobInitDone){
      runMobInit();
    }
  });
}());;

(function(){
  var labels={white:'White',qrix:'Purple'};
  var aliases={black:'white',obsidian:'white',blue:'white',aerium:'white',gold:'white',jewel:'white',purple:'qrix'};
  function normalize(theme){
    theme=aliases[theme]||theme;
    return labels[theme]?theme:'white';
  }
  function applyTheme(theme,persist){
    theme=normalize(theme);
    document.documentElement.setAttribute('data-theme',theme);
    var toggle=document.getElementById('scanThemeToggle');
    if(toggle){
      toggle.setAttribute('aria-pressed',theme==='qrix'?'true':'false');
      toggle.setAttribute('title','Current theme: '+labels[theme]);
    }
    if(persist!==false) localStorage.setItem('nexaScanSuiteTheme',theme);
  }
  window.applyScanSuiteTheme=applyTheme;
  window.mobApplyTheme=applyTheme;
  function init(){
    var saved=normalize(localStorage.getItem('nexaScanSuiteTheme')||document.documentElement.getAttribute('data-theme')||'white');
    applyTheme(saved,false);
    var toggle=document.getElementById('scanThemeToggle');
    if(toggle) toggle.addEventListener('click',function(){
      var next=document.documentElement.getAttribute('data-theme')==='qrix'?'white':'qrix';
      applyTheme(next,true);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();;

(function(){
  function ready(fn){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn,{once:true});}else{fn();}}
  function clean(s){return (s||'').replace(/\s+/g,' ').trim();}
  function labelFor(el){
    if(el.id){var explicit=document.querySelector('label[for="'+CSS.escape(el.id)+'"]');if(explicit)return clean(explicit.textContent);}
    var wrap=el.closest('label'); if(wrap) return clean(wrap.textContent);
    var group=el.closest('.field,.field-group,.mob-field,.control,.setting,.input-wrap,.pwned-input-wrap,.breach-field-wrap');
    if(group){var lab=group.querySelector('label,.field-label,.label'); if(lab) return clean(lab.textContent);}
    return clean(el.getAttribute('placeholder')||el.getAttribute('title')||el.textContent);
  }
  ready(function(){
    document.querySelectorAll('button:not([aria-label])').forEach(function(btn){var text=clean(btn.textContent||btn.title); if(text) btn.setAttribute('aria-label',text);});
    document.querySelectorAll('input:not([aria-label]),textarea:not([aria-label]),select:not([aria-label])').forEach(function(el){var text=labelFor(el); if(text) el.setAttribute('aria-label',text);});
    document.querySelectorAll('a[target="_blank"]').forEach(function(a){ if(!a.rel) a.rel='noopener noreferrer'; });
  });
})();;