/** http://github.com/foo123/FILTER.js
**
** Image Processing Filter Library for javascript and HTML5 canvas element by Nikos M.
** http://nikos-web-development-netai.net/
**/
var FILTER=FILTER||{};FILTER.Filter=function(a){this.image=a};FILTER.Filter.prototype.apply=function(){};FILTER.Image=function(a,b){this.height=this.width=0;this.image=null;this.canvasElement=document.createElement("canvas");this.context=this.canvasElement.getContext("2d");typeof a!=void 0&&this.setImage(a,b)};
FILTER.Image.prototype.clone=function(a){typeof a=="undefined"&&(a=!1);var b=new FILTER.Image;this.image!=void 0&&this.image!=null&&a?b.setImage(this.image.src):(b.setWidth(this.width),b.setHeight(this.height),b.setPixelData(this.getPixelData()));return b};FILTER.Image.prototype.createImageData=function(a,b){this.width=a;this.height=b;this.canvasElement.width=this.width;this.canvasElement.height=this.height;this.context=this.canvasElement.getContext("2d");return this.context.createImageData(a,b)};
FILTER.Image.prototype.getPixelData=function(){return this.context.getImageData(0,0,this.width,this.height)};FILTER.Image.prototype.setPixelData=function(a){this.context.putImageData(a,0,0)};FILTER.Image.prototype.setWidth=function(a){this.width=a;this.canvasElement.width=this.width;this.context=this.canvasElement.getContext("2d")};FILTER.Image.prototype.setHeight=function(a){this.height=a;this.canvasElement.height=this.height;this.context=this.canvasElement.getContext("2d")};
FILTER.Image.prototype.setImage=function(a,b){var c=this;a instanceof Image?(this.image=a,this.width=a.width,this.height=a.height,this.canvasElement.width=this.width,this.canvasElement.height=this.height,this.context=this.canvasElement.getContext("2d"),this.context.drawImage(this.image,0,0)):(this.image=new Image,this.image.onload=function(){c.width=c.image.width;c.height=c.image.height;c.canvasElement.width=c.width;c.canvasElement.height=c.height;c.context=c.canvasElement.getContext("2d");c.context.drawImage(c.image,
0,0);typeof b!="undefined"&&b.call(this)},this.image.src=a);this.image.crossOrigin=""};FILTER.ColorMatrixFilter=function(a,b){this.matrix=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];this.image=a;typeof b!="undefined"&&this.concat(b)};FILTER.ColorMatrixFilter.prototype=new FILTER.Filter;FILTER.ColorMatrixFilter.prototype.constructor=FILTER.ColorMatrixFilter;
FILTER.ColorMatrixFilter.prototype.concat=function(a){var b=[],c=0,d,e;for(e=0;e<4;e++){for(d=0;d<5;d++)b[c+d]=a[c]*this.matrix[d]+a[c+1]*this.matrix[d+5]+a[c+2]*this.matrix[d+10]+a[c+3]*this.matrix[d+15]+(d==4?a[c+4]:0);c+=5}this.matrix=b};
FILTER.ColorMatrixFilter.prototype.apply=function(){for(var a=this.image.getPixelData(),b=a.data,c=this.matrix,d=0;d<b.length;d+=4){var e=[b[d],b[d+1],b[d+2],b[d+3]];b[d]=c[0]*e[0]+c[1]*e[1]+c[2]*e[2]+c[3]*e[3]+c[4];b[d+1]=c[5]*e[0]+c[6]*e[1]+c[7]*e[2]+c[8]*e[3]+c[9];b[d+2]=c[10]*e[0]+c[11]*e[1]+c[12]*e[2]+c[13]*e[3]+c[14];b[d+3]=c[15]*e[0]+c[16]*e[1]+c[17]*e[2]+c[18]*e[3]+c[19]}this.image.setPixelData(a)};FILTER.LUMA_R=0.212671;FILTER.LUMA_G=0.71516;FILTER.LUMA_B=0.072169;
FILTER.ColorMatrixFilter.prototype.grayscale=function(){var a=FILTER.LUMA_R,b=FILTER.LUMA_G,c=FILTER.LUMA_B;this.concat([a,b,c,0,0,a,b,c,0,0,a,b,c,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.desaturate=function(){this.concat([FILTER.LUMA_R,FILTER.LUMA_G,FILTER.LUMA_B,0,0,FILTER.LUMA_R,FILTER.LUMA_G,FILTER.LUMA_B,0,0,FILTER.LUMA_R,FILTER.LUMA_G,FILTER.LUMA_B,0,0,0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.colorize=function(a,b){var c,d,e,f;typeof b=="undefined"&&(b=1);c=(a>>16&255)/255;d=(a>>8&255)/255;e=(a&255)/255;f=1-b;this.concat([f+b*c*FILTER.LUMA_R,b*c*FILTER.LUMA_G,b*c*FILTER.LUMA_B,0,0,b*d*FILTER.LUMA_R,f+b*d*FILTER.LUMA_G,b*d*FILTER.LUMA_B,0,0,b*e*FILTER.LUMA_R,b*e*FILTER.LUMA_G,f+b*e*FILTER.LUMA_B,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.invert=function(){this.concat([-1,0,0,0,255,0,-1,0,0,255,0,0,-1,0,255,0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.saturation=function(a){var b,c,d;b=1-a;c=b*FILTER.LUMA_R;d=b*FILTER.LUMA_G;b*=FILTER.LUMA_B;this.concat([c+a,d,b,0,0,c,d+a,b,0,0,c,d,b+a,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.contrast=function(a,b,c){typeof b=="undefined"&&(b=a);typeof c=="undefined"&&(c=a);a+=1;b+=1;c+=1;this.concat([a,0,0,0,128*(1-a),0,b,0,0,128*(1-b),0,0,c,0,128*(1-c),0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.brightness=function(a,b,c){typeof b=="undefined"&&(b=a);typeof c=="undefined"&&(c=a);this.concat([1,0,0,0,a,0,1,0,0,b,0,0,1,0,c,0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.adjustHue=function(a){a*=Math.PI/180;var b=Math.cos(a),a=Math.sin(a);this.concat([FILTER.LUMA_R+b*(1-FILTER.LUMA_R)+a*-FILTER.LUMA_R,FILTER.LUMA_G+b*-FILTER.LUMA_G+a*-FILTER.LUMA_G,FILTER.LUMA_B+b*-FILTER.LUMA_B+a*(1-FILTER.LUMA_B),0,0,FILTER.LUMA_R+b*-FILTER.LUMA_R+a*0.143,FILTER.LUMA_G+b*(1-FILTER.LUMA_G)+a*0.14,FILTER.LUMA_B+b*-FILTER.LUMA_B+a*-0.283,0,0,FILTER.LUMA_R+b*-FILTER.LUMA_R+a*-(1-FILTER.LUMA_R),FILTER.LUMA_G+b*-FILTER.LUMA_G+a*FILTER.LUMA_G,FILTER.LUMA_B+
b*(1-FILTER.LUMA_B)+a*FILTER.LUMA_B,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.blend=function(a,b){for(var c=1-b,d=0;d<20;)this.matrix[d]=c*this.matrix[d]+b*a.matrix[d],d++};FILTER.ColorMatrixFilter.prototype.average=function(a,b,c){typeof a=="undefined"&&(a=1/3);typeof b=="undefined"&&(b=1/3);typeof c=="undefined"&&(c=1/3);this.concat([a,b,c,0,0,a,b,c,0,0,a,b,c,0,0,0,0,0,1,0])};
FILTER.ColorMatrixFilter.prototype.threshold=function(a,b){typeof b=="undefined"&&(b=256);this.concat([FILTER.LUMA_R*b,FILTER.LUMA_G*b,FILTER.LUMA_B*b,0,-(b-1)*a,FILTER.LUMA_R*b,FILTER.LUMA_G*b,FILTER.LUMA_B*b,0,-(b-1)*a,FILTER.LUMA_R*b,FILTER.LUMA_G*b,FILTER.LUMA_B*b,0,-(b-1)*a,0,0,0,1,0])};FILTER.ColorMatrixFilter.prototype.threshold_rgb=function(a,b){typeof b=="undefined"&&(b=256);this.concat([b,0,0,0,-(b-1)*a,0,b,0,0,-(b-1)*a,0,0,b,0,-(b-1)*a,0,0,0,1,0])};
FILTER.ColorMatrixFilter.prototype.threshold_alpha=function(a,b){typeof a=="undefined"&&(a=0.5);typeof b=="undefined"&&(b=256);this.concat([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,b,-b*a])};FILTER.ConvolutionMatrixFilter=function(a,b,c){this.image=a;if(typeof b!="undefined")this.weights=b;this.opaque=!0;if(typeof c!="undefined")this.opaque=c};FILTER.ConvolutionMatrixFilter.prototype=new FILTER.Filter;FILTER.ConvolutionMatrixFilter.prototype.constructor=FILTER.ConvolutionMatrixFilter;
FILTER.ConvolutionMatrixFilter.prototype.apply=function(){for(var a=Math.round(Math.sqrt(this.weights.length)),b=Math.floor(a/2),c=this.image.getPixelData(),d=c.data,e=c.width,c=c.height,f=this.image.clone().getPixelData(),m=this.opaque?1:0,n=0;n<c;n++)for(var i=0;i<e;i++){for(var l=n,o=i,g=(n*e+i)*4,h=0,s=0,t=0,r=0,p=0;p<a;p++)for(var q=0;q<a;q++){var j=l+p-b,k=o+q-b;j>=0&&j<c&&k>=0&&k<e&&(j=(j*e+k)*4,k=this.weights[p*a+q],h+=d[j]*k,s+=d[j+1]*k,t+=d[j+2]*k,r+=d[j+3]*k)}f.data[g]=h;f.data[g+1]=s;
f.data[g+2]=t;f.data[g+3]=r+m*(255-r)}this.image.setPixelData(f)};FILTER.ConvolutionMatrixFilter.prototype.blur=function(){var a=1/9;this.weights=[a,a,a,a,a,a,a,a,a];return this};FILTER.ConvolutionMatrixFilter.prototype.blur4=function(){this.weights=[0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625];return this};FILTER.ConvolutionMatrixFilter.prototype.sharpen=function(){this.weights=[-1,-1,-1,-1,9,-1,-1,-1,-1];return this};
FILTER.ConvolutionMatrixFilter.prototype.gauss=function(){this.weights=[0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625];return this};FILTER.ConvolutionMatrixFilter.prototype.laplace=function(){this.weights=[0,1,0,1,-4,1,0,1,0];return this};FILTER.ConvolutionMatrixFilter.prototype.emboss=function(){this.weights=[-2,-1,0,-1,1,1,0,1,2];return this};FILTER.ConvolutionMatrixFilter.prototype.edge=function(){this.weights=[0,1,0,1,-4,1,0,1,0];return this};
FILTER.ConvolutionMatrixFilter.prototype.motionblur=function(a){var b=1/9;this.weights=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];if(a==0)for(a=0;a<9;a++)this.weights[36+a]=b;else if(a==2)for(a=0;a<9;a++)this.weights[9*a+5]=b;else if(a==1)for(a=0;a<9;a++)this.weights[9*Math.round(a)+Math.round(a)]=b;return this};
FILTER.DisplacementMapFilter=function(a,b){this.scaleY=this.scaleX=1;this.componentY=this.componentX=this.startY=this.startX=0;this.mode=FILTER.DisplacementMapFilter.CLAMP;this.image=a;this.map=b};FILTER.CHANNEL_RED=0;FILTER.CHANNEL_GREEN=1;FILTER.CHANNEL_BLUE=2;FILTER.CHANNEL_ALPHA=3;FILTER.MODE_IGNORE=0;FILTER.MODE_WRAP=1;FILTER.MODE_CLAMP=2;FILTER.DisplacementMapFilter.prototype=new FILTER.Filter;FILTER.DisplacementMapFilter.prototype.constructor=FILTER.DisplacementMapFilter;
FILTER.DisplacementMapFilter.prototype.apply=function(){for(var a=this.image.getPixelData(),b=a.width,c=this.map.clone().getPixelData(),d=c.data,e=c.width,c=c.height,f=this.image.clone().getPixelData(),m=this.scaleX/256,n=this.scaleY/256,i=0;i<c;i++)for(var l=0;l<e;l++){var o=((i+this.startY)*b+(l+this.startX))*4,g=(i*e+l)*4,h=i+this.startY+Math.floor((d[g+this.componentY]-128)*n),g=l+this.startX+Math.floor((d[g+this.componentX]-128)*m);if(h>=a.height||h<0||g>=a.width||g<0)switch(this.mode){case FILTER.MODE_IGNORE:continue;
case FILTER.MODE_WRAP:h>=a.height&&(h-=a.height);h<0&&(h+=a.height);g>=a.width&&(g-=a.width);g<0&&(g+=a.width);break;default:h>=a.height&&(h=a.height-1),h<0&&(h=0),g>=a.width&&(g=a.width-1),g<0&&(g=0)}h=(h*b+g)*4;f.data[o]=a.data[h];f.data[o+1]=a.data[h+1];f.data[o+2]=a.data[h+2];f.data[o+3]=a.data[h+3]}this.image.setPixelData(f)};FILTER.SobelFilter=function(a){this.image=a};FILTER.SobelFilter.prototype=new FILTER.Filter;FILTER.SobelFilter.prototype.constructor=FILTER.SobelFilter;
FILTER.SobelFilter.prototype.apply=function(){(new FILTER.ColorMatrixFilter(this.image)).grayscale().apply();var a=this.image.getPixelData();(new FILTER.ConvolutionMatrixFilter(this.image,[-1,0,1,-2,0,2,-1,0,1])).apply();var b=this.image.getPixelData();this.image.setPixelData(a);(new FILTER.ConvolutionMatrixFilter(this.image,[-1,-2,-1,0,0,0,1,2,1])).apply();for(var c=this.image.getPixelData(),d=[],e=0;e<a.data.length;e+=4){var f=Math.abs(b.data[e]);d[e]=f;var m=Math.abs(c.data[e]);d[e+1]=m;d[e+2]=
(f+m)/4;d[e+3]=255}a=this.image.getPixelData();for(e=0;e<a.data.length;e++)a.data[e]=d[e];this.image.setPixelData(a,0,0)};
