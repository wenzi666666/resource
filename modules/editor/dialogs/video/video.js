(function () {

    var ctrl = 0;
    var videoTpl = '';

    var utils = UM.utils,
        browser = UM.browser,
        Base = {
        checkURL: function (url) {
            if(!url)    return false;
            url = utils.trim(url);
            if (url.length <= 0) {
                return false;
            }
            if (url.search(/http:\/\/|https:\/\//) !== 0) {
                url += 'http://';
            }

            url=url.replace(/\?[\s\S]*$/,"");

            if (!/(.gif|.jpg|.jpeg|.png)$/i.test(url)) {
                return false;
            }
            return url;
        },
        getAllPic: function (sel, $w, editor) {
            var me = this,
                arr = [],
                $imgs = $(sel, $w);

            $.each($imgs, function (index, node) {
                $(node).removeAttr("width").removeAttr("height");

                return arr.push({
                    _src: node.src,
                    src: node.src
                });
            });

            return arr;
        },
        scale: function (img, max, oWidth, oHeight) {
            var width = 0, height = 0, percent, ow = img.width || oWidth, oh = img.height || oHeight;
            if (ow > max || oh > max) {
                if (ow >= oh) {
                    if (width = ow - max) {
                        percent = (width / ow).toFixed(2);
                        img.height = oh - oh * percent;
                        img.width = max;
                    }
                } else {
                    if (height = oh - max) {
                        percent = (height / oh).toFixed(2);
                        img.width = ow - ow * percent;
                        img.height = max;
                    }
                }
            }

            return this;
        },
        close: function ($img) {

            $img.css({
                top: ($img.parent().height() - $img.height()) / 2,
                left: ($img.parent().width()-$img.width())/2
            }).prev().on("click",function () {

                if ( $(this).parent().remove().hasClass("edui-video-upload-item") ) {
                    //显示图片计数-1
                    Upload.showCount--;
                    Upload.updateView();
                }

            });

            return this;
        },
        createImgBase64: function (img, file, $w) {
            if (browser.webkit) {
                //Chrome8+
                img.src = window.webkitURL.createObjectURL(file);
            } else if (browser.gecko) {
                //FF4+
                img.src = window.URL.createObjectURL(file);
            } else {
                //实例化file reader对象
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.src = this.result;
                    $w.append(img);
                };
                reader.readAsDataURL(file);
            }
        },
        callback: function (editor, $w, file, state) {
            // console.log("state:", file);
           

            // if (state == "SUCCESS") {
                //显示图片计数+1
                // Upload.showCount++;
                var $img = $('<div class="video-item-details"><div>' + file[1] + '</div></div>'),
                    $item = $("<div class='edui-video-item edui-video-upload-item'></div>").append($img);

                videoTpl = '<img src="dialogs/video/images/spacer.gif" url="' +  file[0] + '" class="edui-faked-video"  name="' + file[1] + '" controls type="video" style="max-width:800px" path="'+ file[2]+'"/>';
                Upload.updateView();

                Upload.toggleMask();

                $('.edui-video-custom').hide();

                $('.edui-video-content').append($item);
        }
    };

    /*
     * 本地上传
     * */
    var Upload = {
        showCount: 0,
        uploadTpl: '<div class="edui-video-upload%%">' +
            '<span class="edui-video-icon"></span>' +
            '<form class="edui-video-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input style=\"filter: alpha(opacity=0);\" class="edui-video-file" type="file" hidefocus name="upfile" accept="audio/*"/>' +
            '</form>' +

            '</div>',
        init: function (editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;
            me.render(".edui-video-local", 1);
            me.config(".edui-video-upload1");
            me.submit();
            me.drag();

            $(".edui-video-upload1").hover(function () {
                $(".edui-video-icon", this).toggleClass("hover");
            });

            if (!(UM.browser.ie && UM.browser.version <= 9)) {
                $(".edui-video-dragTip", me.dialog).css("display", "block");
            }


            return me;
        },
        render: function (sel, t) {
            var me = this;

            $(sel, me.dialog).append($(me.uploadTpl.replace(/%%/g, t)));

            return me;
        },
        config: function (sel) {
            var me = this,
                url=me.editor.options.videoUrl;

            // url=url + (url.indexOf("?") == -1 ? "?" : "&") + "editorid="+me.editor.id;//初始form提交地址;

            // $("form", $(sel, me.dialog)).attr("action", url);

            return me;
        },
        uploadComplete: function(r){
            var me = this;
            try{
                var json = eval('('+r+')');
                Base.callback(me.editor, me.dialog, json.url, json.state);
            }catch (e){
                var lang = me.editor.getLang('video');
                Base.callback(me.editor, me.dialog, '', (lang && lang.uploadError) || 'Error!');
            }
        },
        uploadAudioToQiNiu: function() {
            var me = this;
                    
            var uploader = new plupload.Uploader({
                browse_button: 'pickfiles-video',
                url: window.uploadServerUrl,
                max_file_size : '150mb',
                multi_selection: false, // 多文件上传
                filters: [{title: "视频文件", extensions: "mp4,flv"}] //文件过滤
            });

            //在实例对象上调用init()方法进行初始化
            uploader.init();
             // 处理滚动条
            var $progress = $('#fsUploadProgress-video')

            //绑定各种事件，并在事件监听函数中做你想做的事
            uploader.bind('FilesAdded', function(up,files){
                $('table').show();
                $('#success').hide();
                // 清空
                $progress.show();
                $progress.html('');
                $progress.html(progreeTplLeft + '0%' + progreeTplRight)
                up.start();
            });
            uploader.bind('UploadProgress',function(up,file){
                 $progress.find('.progressbar').css('width', file.percent + '%');
            });

            uploader.bind('UploadComplete', function() {
                console.log("upload complete")
                $('#success').show();
            });

            uploader.bind('FileUploaded', function(up, file, info) {
                var response = JSON.parse(info.response)[0];
                // 文件类型
                var fileType = '.' + response.save_file.split('.')[response.save_file.split('.').length-1];
                // var progress = new FileProgress(file, 'fsUploadProgress-img');
                Base.callback(me.editor, me.dialog, [window.FileServerUrl + response.uuid + fileType, response.save_file, response.save_path.replace('\/upFile', '')], 'SUCCESS');
            });

            uploader.bind('error', function(up, file, info) {
              alert('抱歉上传失败，可能原因：文件过大 或 上传超时。\n请重新上传')
            })
        },
        submit: function (callback) {
            Upload.uploadAudioToQiNiu();
        },
        //更新input
        updateInput: function ( inputField ) {

            $( ".edui-video-file", this.dialog ).each( function ( index, ele ) {

                ele.parentNode.replaceChild( inputField.cloneNode( true ), ele );

            } );

        },
        //更新上传框
        updateView: function () {

            if ( Upload.showCount !== 0 ) {
                return;
            }

            $(".edui-video-upload1", this.dialog).hide();
            $(".edui-video-dragTip", this.dialog).hide();
            // $(".edui-video-upload1", this.dialog).show();

        },
        drag: function () {
            var me = this;
            //做拽上传的支持
            if (!UM.browser.ie9below) {
                me.dialog.find('.edui-video-content').on('drop',function (e) {

                    //获取文件列表
                    var fileList = e.originalEvent.dataTransfer.files;
                    var img = document.createElement('img');
                    var hasImg = false;
                    $.each(fileList, function (i, f) {
                        if (/^video/.test(f.type)) {
                            //创建图片的base64
                            Base.createImgBase64(img, f, me.dialog);

                            var xhr = new XMLHttpRequest();
                            xhr.open("post", me.editor.getOpt('videoUrl') + "?type=ajax", true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                            //模拟数据
                            var fd = new FormData();
                            fd.append(me.editor.getOpt('videoFieldName'), f);

                            xhr.send(fd);
                            xhr.addEventListener('load', function (e) {
                                var r = e.target.response, json;
                                me.uploadComplete(r);
                                if (i == fileList.length - 1) {
                                    $(img).remove()
                                }
                            });
                            hasImg = true;
                        }
                    });
                    if (hasImg) {
                        e.preventDefault();
                        me.toggleMask("上传中....");
                    }

                }).on('dragover', function (e) {
                        e.preventDefault();
                    });
            }
        },
        toggleMask: function (html) {
            var me = this;
            var $mask = $(".edui-video-mask", me.dialog);
            // console.log("html:", html)
            if (html) {
                  $mask.addClass("edui-active").html(html);
            } else {

                $mask.removeClass("edui-active").html('');
                 // $mask.addClass("edui-active").html(html);
            }

            return me;
        }
    };

    /*
     * 网络图片
     * */
    var NetWork = {
        init: function (editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;

            me.initEvt();
        },
        initEvt: function () {
            var me = this,
                url,
                $ele = $(".edui-video-searchTxt", me.dialog);

            $(".edui-video-searchAdd", me.dialog).on("click", function () {
                url = Base.checkURL($ele.val());

                if (url) {

                    $("<img src='" + url + "' class='edui-video-pic' />").on("load", function () {

                        var $item = $("<div class='edui-video-item'><div class='edui-video-close'></div></div>").append(this);

                        $(".edui-video-searchRes", me.dialog).append($item);

                        Base.scale(this, 120);

                        $item.width($(this).width());

                        Base.close($(this));

                        $ele.val("");
                    });
                }
            })
                .hover(function () {
                    $(this).toggleClass("hover");
                });
        }
    };

    var $tab = null,
        currentDialog = null;

    UM.registerWidget('video', {
        // "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=video_url%>video.css\">" +
        tpl: "<div id=\"container\" class=\"edui-video-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item edui-active\"><a data-context=\".edui-video-local\" class=\"edui-tab-text\"><%=lang_tab_local%></a></li>" +
            // "<li  class=\"edui-tab-item\"><a data-context=\".edui-video-JimgSearch\" class=\"edui-tab-text\"><%=lang_tab_imgSearch%></a></li>" +
            "<br>&nbsp;&nbsp;视频：mp4、flv ，限制150M；</ul>" +
            "<div class=\"edui-tab-content\">" +
            "<div id=\"pickfiles-video\" class=\"edui-video-local edui-tab-pane edui-active\">" +
            "<div id=\"fsUploadProgress-video\"></div>" +
            "<div class=\"edui-video-content\"><div class=\"edui-video-custom\"></div></div>" +
            "<div class=\"edui-video-mask\"></div>" +
            "<div class=\"edui-video-dragTip\"><%=lang_input_dragTip%></div>" +
            "</div>" +
            "<div class=\"edui-video-JimgSearch edui-tab-pane\">" +
            "<div class=\"edui-video-searchBar\">" +
            "<table><tr><td><input class=\"edui-video-searchTxt\" type=\"text\"></td>" +
            "<td><div class=\"edui-video-searchAdd\"><%=lang_btn_add%></div></td></tr></table>" +
            "</div>" +
            "<div class=\"edui-video-searchRes\"></div>" +
            "</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor, $dialog) {
            var lang = editor.getLang('video')["static"],
                opt = $.extend({}, lang, {
                    video_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/video/'
                });

            Upload.showCount = 0;

            if (lang) {
                var html = $.parseTmpl(this.tpl, opt);
            }

            currentDialog = $dialog.edui();

            this.root().html(html);

        },
        initEvent: function (editor, $w) {
            $tab = $.eduitab({selector: ".edui-video-wrapper"})
                .edui().on("beforeshow", function (e) {
                    e.stopPropagation();
                });

            Upload.init(editor, $w);

            NetWork.init(editor, $w);
        },
        buttons: {
            'ok': {
                exec: function (editor, $w) {

                    um.execCommand('insertHtml', videoTpl);
                    // 清空模版，防止下次上传失败时 调用到
                    videoTpl = "";
                }
            },
            'cancel': {}
        },
        width: 700,
        height: 358
    }, function (editor, $w, url, state) {
        Base.callback(editor, $w, url, state)
    })
})();

