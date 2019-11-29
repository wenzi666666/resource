(function () {
    var ctrl = 0;

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
            }).prev().on("click",function (e) {
                e.stopPropagation();
                // if(Upload.showCount == 1){
                //     $('.edui-resource-custom').css('display', 'block')
                // }

                // if ( $(this).parent().remove().hasClass("edui-resource-upload-item") ) {
                //     //显示图片计数-1
                //     Upload.showCount--;
                //     Upload.updateView();
                // }

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
        callback: function (editor, $w, url, state) {

        }
    };

    var $tab = null,
        currentDialog = null;

    UM.registerWidget('resource', {
        tpl: "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=resource_url%>resource.css\">" +
            "<div id=\"container\" class=\"edui-resource-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item edui-active\"><a data-context=\".edui-resource-local\" class=\"edui-tab-text\"><%=lang_tab_local%></a></li>" +
            // "<li  class=\"edui-tab-item\"><a data-context=\".edui-resource-JimgSearch\" class=\"edui-tab-text\"><%=lang_tab_imgSearch%></a></li>" +
            "</ul>" +
            "<div class=\"edui-tab-content\">" +
            "<div id=\"pickfiles-img\" class=\"edui-resource-local edui-tab-pane edui-active\"><br><br>请在新打开的页面中添加资源，上传完毕后点击确认" +
            "<div id=\"fsUploadProgress-img\"></div>" +
            "<div class=\"edui-resource-content\"><div class=\"edui-resource-custom\"></div></div>" +
            "<div class=\"edui-resource-mask\"></div>" +
            "<div class=\"edui-resource-dragTip\"><%=lang_input_dragTip%></div>" +
            "</div>" +
            "<div class=\"edui-resource-JimgSearch edui-tab-pane\">" +
            "<div class=\"edui-resource-searchBar\">" +
            "<table><tr><td><input class=\"edui-resource-searchTxt\" type=\"text\"></td>" +
            "<td><div class=\"edui-resource-searchAdd\"><%=lang_btn_add%></div></td></tr></table>" +
            "</div>" +
            "<div class=\"edui-resource-searchRes\"></div>" +
            "</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor, $dialog) {
            // var lang = editor.getLang('resource')["static"],
            //     opt = $.extend({}, lang, {
            //         resource_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/resource/'
            //     });

            // Upload.showCount = 0;

            // if (lang) {
            //     var html = $.parseTmpl(this.tpl, opt);
            // }

            // currentDialog = $dialog.edui();

            // this.root().html(html);

            // 隐藏
            setTimeout(function(){
                $('.edui-dialog-resource').hide()
                $('.edui-modal-backdrop').hide()
                
            },100)
            

            // 新页面打开链接
            window.parent.show('insert_res');

        },
        initEvent: function (editor, $w) {
            // $tab = $.eduitab({selector: ".edui-resource-wrapper"})
            //     .edui().on("beforeshow", function (e) {
            //         e.stopPropagation();
            //     });
        },
        buttons: {
            'ok': {
                exec: function (editor, $w) {
                    // editor.execCommand('insertresource', '');
                }
            },
            'cancel': {}
        },
        width: 700,
        height: 408
    }, function (editor, $w, url, state) {
        Base.callback(editor, $w, url, state)
    })
})();

