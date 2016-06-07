/**
 * Simple storage service which uses browser localStorage service to store
 * application data. Main usage of this is to store user data and JWT token
 * to browser.
 *
 * But this can be also used to cache some data from backend to users browser
 * cache, just remember that local storage IS NOT intended to store "large"
 * amounts of data.
 */
(function() {
    'use strict';
    angular.module('webApp.core.services')
        .factory('Image', ['$compile', function service($compile) {
            return {
                /** 提取主题中的图片
                * @param   [array]    data  ：主题内容
                * @param   int    n : 提取图片数
                */
                'getImg': function getImg(data, n) {
                    //获取回帖中图片，最多取3张
                    if (!data) {
                        return;
                    };
                    for (var i = 0; i < data.length; i++) {
                        //获取发表的图片
                        var tmpImg = data[i].content;
                        var j = 0;
                        data[i].img = [];
                        //提取图片，暂时提取以 http://ac-打头的图片，因为图片存在七牛云上。
                        tmpImg.replace(/\http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)/gim, function(str) {
                            //最多取3张图片
                            if (j < n) {
                                data[i].img[j] = str.split('"')[0];
                            }
                            j++;
                        });
                    }
                    return data;
                },
                /** 提取 单个主题中的图片
                * @param   [array]    data  ：主题内容
                * @param   int    n : 提取图片数
                */
                'getImgItem': function getImgItem(data, n) {
                    //获取回帖中图片，最多取3张
                    if (!data) {
                        return;
                    };
                    //获取发表的图片
                    var j = 0;
                    var imgs = [];
                    //提取图片，暂时提取以 http://ac-打头的图片，因为图片存在七牛云上。
                    data.replace(/\http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)/gim, function(str) {
	                    //最多取n张图片 jpg png gif jpeg bmp
	                    var tmpStr = str.split('.');
	                    tmpStr[6] = tmpStr[6].split('"')[0];
	                    if(tmpStr[6] == 'jpg' || tmpStr[6] == 'png' || tmpStr[6] == 'gif' || tmpStr[6] == 'jpeg' || tmpStr[6] == 'bmp'){
                    		if (j < n) {
                            	imgs[j] = str.split('"')[0] + window.imgLargeCompress;
	                        }
	                        j++;
                    	}
                    })
                    return imgs;
                },
                
                //去掉audio attachment的img
                'replaceImgLabel': function replaceImgLabel(content){
                    content = content.replace(/<img src\=\"dialogs\/[^>]+>/gim, '');
                    return content;
                },
                
                 //将表情替换为 图片
                'replaceEmojiToImg': function replaceEmojiToImg(content){
                	
                    content = content.replace(/<[^>]+>/gim, function(str){
                    	str = str.replace('<','').replace('>', '');
                    	var imgTpl = "<img class='emoji-thumbnail' src='assets/emoji/" + str + ".png'>";
                    	return imgTpl;
                    });
                    return content;
                },

                /* replace content*/
                'replaceContent': function repalceContent(content){
                    var imgs = [];//存放图片
                    var attachments = [];//存放附件
                    var emojis = [];//存放表情
                    var music = [];//存放音乐
                    var uploadimgs = [];//存放图片

                    var result = {
                        "attachment": [],
                        "music": [],
                        "uploadImg": [],
                        "content": "",
                        "pricontent": content
                    }
                    ;//存放最终结果
                    var flag = false;
                    //找到所有img标签，对内容进行修改
                    content = content.replace(/<img src\=\"[^>]+>/gim, function(str){
                    //根据type类型，判断内容    
                        var tmpstr = str;
                        str = str.replace(/type\=\"[^"]+\"/, function(str1){
                            var type = str1.split('"')[1];
                            if (type == "attachment"){
                                flag = true;
                                /*retract attachments*/
                                var url = "";
                                var name = "";
                                str.replace(/url\=\"http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)[^"]+\"/gim, function(str2){
                                    url = str2.split('"')[1];
                                });
                                str.replace(/name\=\"[^"]+\"/gim, function(str3){ 
                                    name = str3.split('"')[1];
                                });
                                attachments.push({
                                    "url": url,
                                    "name": name
                                });
                                result.attachment = attachments;
                                return "";
                            }
                            else if(type == "music"){
                                flag = true;
                                /*retract attachments*/
                                var url = "";
                                var name = "";
                                str.replace(/url\=\"http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)[^"]+\"/gim, function(str2){
                                    url = str2.split('"')[1];
                                });
                                str.replace(/name\=\"[^"]+\"/gim, function(str3){ 
                                    name = str3.split('"')[1];
                                });
                                music.push({
                                    "url": url,
                                    "name": name
                                });
                                result.music = music;
                                return "";
                            }
                            else if(type == "uploadImg") {
                                flag = true;
                                /*retract attachments*/
                                var url = "";
                                var name = "";
                                str.replace(/\"http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)[^"]+\"/gim, function(str4){
                                    url = str4.split('"')[1];
                                });
                                uploadimgs.push({
                                    "url": url,
                                });
                                // console.log(url);
                                result.uploadImg = uploadimgs;
                                return "";
                            }
                            else{
                                flag = false;
                                return str1;
                            }
                        });
                        if(flag) return "";
                        else return str;
                    });
                    result.content = content;
                    return result;
                },

                /** 提取主题内容页图片增加属性，添加ng-lightbox标签，从而使用插件
                * @param   string    content  ：主题内容
                */

                'replaceContentImg': function replaceContentImg(content, num) {
                    if (!content) {return};
                    //获取content中图片
                    // var j = 100*num;
                    var imgs = []
                    var index = num;
                    var j = 0;

                   
                    
                   
                    //找到所有img标签，对内容进行修改

                    content.replace(/<img src\=\"http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)>/gim, function(str){

                        var tmpcontent = content.split(str);
                        //对src进行缩略图裁剪

                        str = str.replace(/"http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)\"/gim, function(newstr){
                            var img = new Object();
                            var tmpnewstr = newstr.split('"');
                            img.src = tmpnewstr[1];
                            tmpnewstr[1] += window.imgTopicThumb;
                            str = '"' + tmpnewstr[1] + '"';
                            imgs = imgs.concat(img);
                            // console.log(imgs);
                            return str;
                        });



                        //对img标签增加属性，同时新加一个img标签
                        var tmpimgs = str.split(" ");

                        var tmpstr = "";
                        // var lightbox = " ng-lightbox=" + "\'" + "{" + "\"" + "element" +"\"" + ":" + "\"img" + j + "\"" + "}" + "\'" + " ";
                        var slide = ' ng-click="goToSlide(aImages, ' + index +  ')" ';
                        for (var i = 0; i < tmpimgs.length-1; i++) {
                            tmpstr += " ";
                            tmpstr += tmpimgs[i];
                        };
                        tmpstr += slide;

                        tmpstr += tmpimgs[tmpimgs.length-1];

                        content = tmpcontent[0] + tmpstr + tmpcontent[1];

                        index++;
                        j++;
                    })
                    var result = {
                            "content": content,
                            "imgs": imgs,
                            "index": index
                    }
                    // console.log(imgs)
                    return result;
                },

                /** 提取主题内容页图片增加属性，添加class及id，与replaceContentImg中的图片对应
                * @param   string    content  ：主题内容
                */

                'maganifyImages': function maganifyImages(content, num) {
                    if (!content) {return};
                    //获取content中图片
                    var j = 100　*　num;
                    var imgs = [];

                    //找到所有img标签，对内容进行修改
                    content.replace(/<img ng-lightbox\=[^>]+>/gim, function(str){
                        //对src进行缩略图裁剪
                        str = str.replace(/"http\:\/\/(ac-[^>]+|7x[^>]+|skt7n[^>]+)[^>]+\"/gim, function(newstr){
                            var tmpnewstr = newstr.split('"');
                            tmpnewstr = tmpnewstr[1].split('?');
                            tmpnewstr[0] += window.imgLargeCompress;
                            str = '"' + tmpnewstr[0] + '"';
                            return str;
                        });
                        //对img标签增加属性，同时新加一个img标签
                        var tmpimgs = str.split(" ");
                        var tmpstr = "";
                        var newimg = " class=" + "\"" + "lightbox topicLageImages" + "\""  + " id=\"img" + j + "\"" + " ";
                        for (var i = 0; i < tmpimgs.length-1; i++) {
                            tmpstr += " ";
                            tmpstr += tmpimgs[i];
                        };
                        tmpstr += newimg;
                        tmpstr += tmpimgs[tmpimgs.length-1];
                        imgs.push(tmpstr);
                        j ++;
                    })
                    return imgs;
                },

                /*提取music和attachment,并按指定样式展示*/
                'replaceContentAttachment': function replaceContentAttachment(content){
                    //找到所有type="attachment"的img标签，对内容进行修改
                    content.replace(/<img src\=\"[^"]+\"\stype(\=|\s\=\s)\"music\"[^>]+\>/gi, function(str){
                    //根据type类型，判断内容
                        var url = "";
                        var name = "";
                        // 提取url
                        str.replace(/url\=\"[^"]+\"/gim, function(str1){
                            url =  str1.split('"')[1];
                        })
                        // 提取name
                        str.replace(/name\=\"[^"]+\"/gim, function(str1){
                            name =  str1.split('"')[1].split('.')[0].toString().replace(/\s/g, '');
                        })
                        var contents = content.split(str);
                        var musicBox = '<div class="musicBox" ng-audio="' + url + '" name="' + name + '"></div>';
                        content = contents[0] + musicBox + contents[1];
                    });

                    content.replace(/<img src\=\"[^"]+\"\stype(\=|\s\=\s)\"attachment\"[^>]+\>/gim, function(str2){
                    //根据type类型，判断内容
                        var url = "";
                        var name = "";
                        str2.replace(/url\=\"[^"]+\"/gim, function(str1){
                            url =  str1.split('"')[1];
                        })
                        str2.replace(/name\=\"[^"]+\"/gim, function(str3){
                            name =  str3.split('"')[1];
                        })

                        var contents = [];
                        contents = content.split(str2);

                        var attachmentBox = '<p class="musicBox"><button class="btn btn-primary btn-img attachment-item"></button><a class="attachment-name" target="_new" href="' + url + '">' + name + '</a></p>';

                        content = contents[0] + attachmentBox + contents[1];
                    });
                    return content;
                },
                
                // 过滤特殊表情符号
                'replaceSpecialSymbol': function replaceSpecialSymbol(content){
                	  // console.log(content.toString())
//              	 content = content.replace(/&#\w+;/g,'');
//              	 content = $compile(content);
                	 return content;
                }
            }
        }
	])
}());