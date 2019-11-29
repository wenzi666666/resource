/**
 * 编辑器 文件上传
 * 创建者 张连刚 lgzhang08@gmail.com
 * 2016-10-27
 */

// debug开启控制，console
var debug = false;
if(!!debug) {
    window.console = {};
    window.console.log = function(){};
}
 /**
 * 解析window.location.serch
*/
window.getSeachByName = function (name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r!=null) return (r[2]); return null; 
}

// 上传绝对路径
window.uploadServerUrl =  getSeachByName('uploadUrl') + "&ver=1";
// 文件服务器地址
window.FileServerUrl = window.uploadServerUrl.split('push.do')[0] + 'nor/';

// 上传进度条模版
var progreeTplLeft = '<div class="progress"><span class="progressbar green" style="width:';
var progreeTplRight = '"></span></div>'

/**
 * 各类文件存取方式
 * 图片：<img src="41805ff0-96b4-4e52-9ed8-4a43de258549-010.jpg" type="uploadImg" style="max-width: 560px; width: 560px; height: 466px;">
     ie: <img width="288" height="287" style="width: 421px; height: 269px; max-width: 560px;" src="d6a9271f-34fe-4cff-869f-abeadd119fd7-061.png" type="uploadImg">
 * 音频：music
 * 视频：video
 * 附件：attachment
 */

// 正则表达式
var regImg = /<(img|IMG)(\s|[^>]+)type(\=|\s\=\s)\"uploadImg\"([^>]+\>|\>)/gi  //匹配 img

var regImgAudio = /<(img|IMG)(\s|[^>]+)type(\=|\s\=\s)\"music\"([^>]+\>|\>)/gi  //匹配 regImgAudio
var regAudioPath = /<(audio|AUDIO)(\s|[^>]+)type(\=|\s\=\s)\"music\"([^>]+\>|\>)<\/(audio|AUDIO)>/gi  //regImgAudio

var regImgVideo = /<(img|IMG)(\s|[^>]+)type(\=|\s\=\s)\"video\"([^>]+\>|\>)/gi  //regVideo
var regVideoPath = /<(video|VIDEO)(\s|[^>]+)type(\=|\s\=\s)\"video\"([^>]+\>|\>)<\/(video|VIDEO)>/gi  //regVideo
// 附件
var regImgAttach = /<(img|IMG)(\s|[^>]+)type(\=|\s\=\s)\"attachment\"([^>]+\>|\>)/gi  //regImgAttach
var regAttachPath = /<(a|A)(\s|[^>]+)type(\=|\s\=\s)\"attachment\"([^>]+\>|\>)([^>]+|)<\/(a|A)>/gi  //regAttachPath
var regAttachEdit = /<(a|A)(\s|[^>]+)type(\=|\s\=\s)\"attachment\"([^>]+\>|\>)/gi  // 编辑

/**
 * 提取music、attachment、video,并按指定样式展示,
 * 去掉 绝对路径
 * 存入数据库使用
*/
function replaceContent(content){
    // 去掉从2.6导入过来的换行显示问题
    content = content.replace(/\r\n/g, '<br>');
    // 去掉 空内容
    content = content.replace("<p><br></p>", '');
    
    //找到所有type="uploadImg"的img标签，对内容进行修改
    content = content.replace(regImg, function(str){
        //根据type类型，判断内容
        var url = "";
        // 提取url
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            str1 = 'src="' + str1.split('"')[1].split('/nor/')[1] + '" ';
            return str1;
        })
        return str;
    });

    //找到所有type="muisc"的img标签，对内容进行修改,暂替换成<audio></audio>
    // 并将真实值从url提取出来，赋值给url
    content = content.replace(regImgAudio, function(str){
        //根据type类型，判断内容
        var url = "";
        //交换 src与url的值， 暂存src的值
        var tmpSrc = '';
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            tmpSrc = str1
            str1 = '';
            return str1;
        })
        // 提取url 改成 src
        str = str.replace(/url\=\"[^"]+\"/gim, function(str1){
          str1 = 'src="' + str1.split('"')[1].split('/nor/')[1] + '" ' + tmpSrc.replace('src=', 'url=');
          return str1;
        })

        // 修改str 变成 <audio></audio>
        str = str.replace('img', 'audio') + '</audio>';
        // 去掉 前自动加上的 /
        str = str.replace('/></audio>', '></audio>')
        return str;

    });

    //找到所有type="video"的img标签，对内容进行修改,暂替换成<audio></audio>
    content = content.replace(regImgVideo, function(str){
        console.log(str)
        //根据type类型，判断内容
        var url = "";
         //交换 src与url的值， 暂存src的值
        var tmpSrc = '';
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            tmpSrc = str1
            str1 = '';
            return str1;
        })
        // 提取url 改成 src
        str = str.replace(/url\=\"[^"]+\"/gim, function(str1){
          str1 = 'src="' + str1.split('"')[1].split('/nor/')[1] + '" ' + tmpSrc.replace('src=', 'url=');
          return str1;
        })

        // 修改str 变成 <audio></audio>
        str = str.replace('img', 'video') + '</video>';
        // 去掉 前自动加上的 /
        str = str.replace('/></video>', '></video>')
        return str;
    });

    //找到所有type="attachment"的img标签，对内容进行修改,暂替换成a
    content = content.replace(regImgAttach, function(str){
        //根据type类型，判断内容
        var url = "";
        //交换 src与url的值， 暂存src的值
        var tmpSrc = '';
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            tmpSrc = str1
            str1 = '';
            return str1;
        })
        // 提取url 改成,href, 并增加'target="_blank"
        str = str.replace(/url\=\"[^"]+\"/gim, function(str1){
          str1 = 'target="_blank" href="' + str1.split('"')[1].split('/nor/')[1] + '" ' + tmpSrc.replace('src=', 'url=');
          return str1;
        })

        // name
        var name = '';
        str.replace(/name\=\"[^"]+\"/gim, function(str2){
            name = str2.split('"')[1];
        })

        // 修改str 变成a,并增加内容
        str = str.replace('img', 'a') + name + '</a>';
        // 去掉 前自动加上的 /
        str = str.replace('/>', '>');
        return str;
    });
    // 返回数据
    return content; 
};



/*提取music、attachment、video,并按指定样式放入编辑器*/
function setContent(content){
    content = decodeURIComponent(content)
    // 去掉从2.6导入过来的换行显示问题
    content = content.replace(/\r\n/g, '<br>');
     //找到所有type="uploadImg"的img标签，对内容进行修改
     content = content.replace(regImg, function(str){
        //根据type类型，判断内容
        var url = "";
        var name = "";
        // 提取 src 增加绝对路径
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
           // 添加全路径
           str1 = 'src="' + window.FileServerUrl + str1.split('"')[1] + '"';
           return str1;
        })
        return str;
    });


    //找到所有type="muisc"的img标签，对内容进行修改,暂替换成<audio></audio>
     content = content.replace(regAudioPath, function(str){
        //根据type类型，判断内容
        var url = "";

        //交换 src与url的值， 暂存src的值
        var tmpSrc = '';
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            tmpSrc = str1
            str1 = '';
            return str1;
        })
        // 提取url 改成 src
        str = str.replace(/url\=\"[^"]+\"/gim, function(str1){
          // 交换值
          str1 = 'src="' + str1.split('"')[1] + '" ' + 'url="' +  window.FileServerUrl + tmpSrc.split('"')[1] + '"';
          return str1;
        })

        // 修改<audio></audio>  变成  img
        str = str.replace('</audio>', '').replace('audio', 'img');
        return str;
    });

    //找到所有type="video"的img标签，对内容进行修改,暂替换成<audio></audio>
    content = content.replace(regVideoPath, function(str){
        var url = "";
        //交换 src与url的值， 暂存src的值
        var tmpSrc = '';
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            tmpSrc = str1
            str1 = '';
            return str1;
        })
        // 提取url 改成 src
        str = str.replace(/url\=\"[^"]+\"/gim, function(str1){
          // 交换值
          str1 = 'src="' + str1.split('"')[1] + '" ' + 'url="' +  window.FileServerUrl + tmpSrc.split('"')[1] + '"';
          return str1;
        })

        // 修改<audio></audio>  变成  img
        str = str.replace('</video>', '').replace('video', 'img');
        return str;
    });

    //找到所有type="attachment"的img标签，对内容进行修改,暂替换成 img
    content = content.replace(regAttachPath, function(str){
        var url = "";
        //去掉name 及后面的a标签
        str.replace(regAttachEdit, function(str3){
            str = str3
        })
        //交换 href与url的值， 暂存href的值
        var tmpSrc = '';
        str = str.replace(/href\=\"[^"]+\"/gim, function(str1){
            tmpSrc = str1
            str1 = '';
            return str1;
        })
        // 提取url 改成 src
        str = str.replace(/url\=\"[^"]+\"/gim, function(str1){
          // 交换值
          str1 = 'src="' + str1.split('"')[1] + '" ' + 'url="' +  window.FileServerUrl + tmpSrc.split('"')[1] + '"';
          return str1;
        })

        // 修改<a  变成  img
        str = str.replace('<a', '<img');
        return str;
    });
    // 返回数据
    return content; 
};


/*提取music、attachment、video,并加入文件服务器全路径*/
function addServerToPath(content){
    console.log(content)
    //找到所有type="uploadImg"的img标签，对内容进行修改
    content = content.replace(regImg, function(str){
        //根据type类型，判断内容
        var url = "";
        var name = "";
        // 提取url
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
           // 添加全路径
           str1 = 'src="' + window.FileServerUrl + str1.split('"')[1] + '"';
           return str1;
        })
        return str;

    });

    //找到所有type="muisc"的img标签，对内容进行修改
    content = content.replace(regAudioPath, function(str){
    	var audioLeft = '<embed src="/editor/assets/mp3.swf" allowfullscreen="true" flashvars="qmp3=';
        var audioRight ='" quality="high" bgcolor="#ffffff" width="250" height="60" name="ASPFLV" align="middle" allowscriptaccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed>'
        //根据type类型，判断内容
        var url = "";
        var name = "";
        // 提取url
       
         // 提取url
        // if(isIE()) {
        //     str.replace(/src\=\"[^"]+\"/gim, function(str1){
        //         // 添加全路径, 格式都转换成 mp3
        //         str = audioLeft +  window.FileServerUrl + str1.split('"')[1].split('.')[0]  + '.mp3"' + audioRight;
        //     })

        // } else {
            str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
               // 添加全路径
               str1 = 'src="' + window.FileServerUrl + str1.split('"')[1].split('.')[0]  + '.mp3"';
               return str1;
            })
        // }

        // str.replace(/src\=\"[^"]+\"/gim, function(str1){
        //     // 添加全路径, 格式都转换成 mp3
        //     str = audioLeft +  window.FileServerUrl + str1.split('"')[1].split('.')[0]  + '.mp3"' + audioRight;
        // })
        return str;
    });

    //找到所有type="video"的img标签，对内容进行修改,暂替换成<audio></audio>
    content = content.replace(regVideoPath, function(str){
        console.log(str)
        //根据type类型，判断内容
        var url = "";
        var name = "";
        // 提取url
        str = str.replace(/src\=\"[^"]+\"/gim, function(str1){
            // 添加全路径, 格式都转换成 mp4

           str1 = 'src="' + window.FileServerUrl + str1.split('"')[1].split('.')[0]  + '.mp4"';
           return str1;
        })
        return str;
    });

    //找到所有type="attachment"的img标签，对内容进行修改,暂替换成<audio></audio>
    content = content.replace(regAttachPath, function(str){
       var url = "";
        var name = "";
        // 提取url
        str = str.replace(/href\=\"[^"]+\"/gim, function(str1){
            // 添加全路径
           str1 = 'href="' + window.FileServerUrl + str1.split('"')[1] + '"';
           return str1;
        })
        return str;
    });
    // 返回数据
    return content; 
};

// 从资源返回的内容插入编辑器
function insertHTML(html) {
    um.execCommand('insertHtml', html)

}

//判断是否是ie
function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}