(function () {

    var ctrl = 0;
    var attachmentTpl = '';

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

//                if (node.width > editor.options.initialFrameWidth) {
//                    me.scale(node, editor.options.initialFrameWidth -
//                        parseInt($(editor.body).css("padding-left"))  -
//                        parseInt($(editor.body).css("padding-right")));
//                }

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

                if ( $(this).parent().remove().hasClass("edui-attachment-upload-item") ) {
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
                var $img = $('<div class="attachment-item-details"><div>' + file[1] + '</div></div>'),
                    $item = $("<div class='edui-attachment-item edui-attachment-upload-item'></div>").append($img);

                attachmentTpl = '<img src="dialogs/attachment/images/attach-editor.png" url="' +  file[0] + '" name="' + file[1] + '" type="attachment" path="'+ file[2]+'"/>';
                Upload.updateView();

                Upload.toggleMask();

                $('.edui-attachment-custom').hide();

                $('.edui-attachment-content').append($item);
                
        }
    };

    /*
     * 本地上传
     * */
    var Upload = {
        showCount: 0,
        uploadTpl: '<div class="edui-attachment-upload%%">' +
            '<span class="edui-attachment-icon"></span>' +
            '<form class="edui-attachment-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input style=\"filter: alpha(opacity=0);\" class="edui-attachment-file" type="file" hidefocus name="upfile" accept="file/*"/>' +
            '</form>' +

            '</div>',
        init: function (editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;
            me.render(".edui-attachment-local", 1);
            me.config(".edui-attachment-upload1");
            me.submit();
            me.drag();

            $(".edui-attachment-upload1").hover(function () {
                $(".edui-attachment-icon", this).toggleClass("hover");
            });

            if (!(UM.browser.ie && UM.browser.version <= 9)) {
                $(".edui-attachment-dragTip", me.dialog).css("display", "block");
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
                url=me.editor.options.attachmentUrl;

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
                var lang = me.editor.getLang('attachment');
                Base.callback(me.editor, me.dialog, '', (lang && lang.uploadError) || 'Error!');
            }
        },
        uploadAudioToQiNiu: function() {
            var me = this;
                    
            var uploader = new plupload.Uploader({
                browse_button: 'pickfiles-attach',
                url: window.uploadServerUrl,
                multi_selection: false, // 多文件上传
                max_file_size : '100mb'
            });

            //在实例对象上调用init()方法进行初始化
            uploader.init();

            // 处理滚动条
            var $progress = $('#fsUploadProgress-attach')

            //绑定各种事件，并在事件监听函数中做你想做的事
            uploader.bind('FilesAdded', function(up,files){
                $('table').show();
                $('#success').hide();
               
                // 清空
                $progress.html('');
                $progress.html(progreeTplLeft + '0%' + progreeTplRight)
                up.start();
            });
            uploader.bind('UploadProgress',function(up,file){
                $progress.find('.progressbar').css('width', file.percent + '%');
            });

            uploader.bind('UploadComplete', function() {
                $('#success').show();
            });

            uploader.bind('FileUploaded', function(up, file, info) {
                console.log(JSON.parse(info.response)[0])
                var response = JSON.parse(info.response)[0];
                // 文件类型
                var fileType = '.' + response.save_file.split('.')[response.save_file.split('.').length-1];
                // var progress = new FileProgress(file, 'fsUploadProgress-img');
                Base.callback(me.editor, me.dialog, [window.FileServerUrl + response.uuid + fileType, response.save_file, response.save_path.replace('\/upFile', '')], 'SUCCESS');
            })
            
            uploader.bind('error', function(up, file, info) {
              alert('抱歉上传失败，可能原因：文件过大 或 上传超时。\n请重新上传')
            })
        },
        submit: function (callback) {

           Upload.uploadAudioToQiNiu();
            // $file.on('change', function(){
            //     $('.edui-attachment-dragTip').html($file)
            // })
            

            // return me;
        },
        //更新input
        updateInput: function ( inputField ) {

            $( ".edui-attachment-file", this.dialog ).each( function ( index, ele ) {

                ele.parentNode.replaceChild( inputField.cloneNode( true ), ele );

            } );

        },
        //更新上传框
        updateView: function () {

            if ( Upload.showCount !== 0 ) {
                return;
            }

            $(".edui-attachment-upload1", this.dialog).hide();
            $(".edui-attachment-dragTip", this.dialog).hide();
            // $(".edui-attachment-upload1", this.dialog).show();

        },
        drag: function () {
            var me = this;
            //做拽上传的支持
            if (!UM.browser.ie9below) {
                me.dialog.find('.edui-attachment-content').on('drop',function (e) {

                    //获取文件列表
                    var fileList = e.originalEvent.dataTransfer.files;
                    var img = document.createElement('img');
                    var hasImg = false;
                    $.each(fileList, function (i, f) {
                        if (/^attachment/.test(f.type)) {
                            //创建图片的base64
                            Base.createImgBase64(img, f, me.dialog);

                            var xhr = new XMLHttpRequest();
                            xhr.open("post", me.editor.getOpt('attachmentUrl') + "?type=ajax", true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                            //模拟数据
                            var fd = new FormData();
                            fd.append(me.editor.getOpt('attachmentFieldName'), f);

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
            var $mask = $(".edui-attachment-mask", me.dialog);
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
                $ele = $(".edui-attachment-searchTxt", me.dialog);

            $(".edui-attachment-searchAdd", me.dialog).on("click", function () {
                url = Base.checkURL($ele.val());

                if (url) {

                    $("<img src='" + url + "' class='edui-attachment-pic' />").on("load", function () {



                        var $item = $("<div class='edui-attachment-item'><div class='edui-attachment-close'></div></div>").append(this);

                        $(".edui-attachment-searchRes", me.dialog).append($item);

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

    UM.registerWidget('attachment', {
        // "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=attachment_url%>attachment.css\">" +
        tpl: "<div id=\"container\" class=\"edui-attachment-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item edui-active\"><a data-context=\".edui-attachment-local\" class=\"edui-tab-text\"><%=lang_tab_local%></a></li>" +
            // "<li  class=\"edui-tab-item\"><a data-context=\".edui-attachment-JimgSearch\" class=\"edui-tab-text\"><%=lang_tab_imgSearch%></a></li>" +
            "<br>&nbsp;&nbsp;：限制100M</ul>" +
            "<div id=\"fsUploadProgress-attach\"></div>" +
            "<div class=\"edui-tab-content\">" +
            "<div id=\"pickfiles-attach\" class=\"edui-attachment-local edui-tab-pane edui-active\">" +
            "<div class=\"edui-attachment-content\"><div class=\"edui-attachment-custom\"></div></div>" +
            "<div class=\"edui-attachment-mask\"></div>" +
            "<div class=\"edui-attachment-dragTip\"><%=lang_input_dragTip%></div>" +
            "</div>" +
            "<div class=\"edui-attachment-JimgSearch edui-tab-pane\">" +
            "<div class=\"edui-attachment-searchBar\">" +
            "<table><tr><td><input class=\"edui-attachment-searchTxt\" type=\"text\"></td>" +
            "<td><div class=\"edui-attachment-searchAdd\"><%=lang_btn_add%></div></td></tr></table>" +
            "</div>" +
            "<div class=\"edui-attachment-searchRes\"></div>" +
            "</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor, $dialog) {
            var lang = editor.getLang('attachment')["static"],
                opt = $.extend({}, lang, {
                    attachment_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/attachment/'
                });

            Upload.showCount = 0;

            if (lang) {
                var html = $.parseTmpl(this.tpl, opt);
            }

            currentDialog = $dialog.edui();

            this.root().html(html);

        },
        initEvent: function (editor, $w) {
            $tab = $.eduitab({selector: ".edui-attachment-wrapper"})
                .edui().on("beforeshow", function (e) {
                    e.stopPropagation();
                });

            Upload.init(editor, $w);

            NetWork.init(editor, $w);
        },
        buttons: {
            'ok': {
                exec: function (editor, $w) {

                    um.execCommand('insertHtml', attachmentTpl);
                    // 清空模版，防止下次上传失败时 调用到
                    attachmentTpl = "";
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

