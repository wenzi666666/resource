/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-9-26
 * Time: 下午1:09
 * To change this template use File | Settings | File Templates.
 */

(function createTab(content) {

    var charsContent = [
        { name:"tsfh", title:'特殊字符', content:toArray("、,。,·,ˉ,ˇ,¨,〃,々,—,～,‖,…,‘,’,“,”,〔,〕,〈,〉,《,》,「,」,『,』,〖,〗,【,】,±,×,÷,∶,∧,∨,∑,∏,∪,∩,∈,∷,√,⊥,∥,∠,⌒,⊙,∫,∮,≡,≌,≈,∽,∝,≠,≮,≯,≤,≥,∞,∵,∴,♂,♀,°,′,″,℃,＄,¤,￠,￡,‰,§,№,☆,★,○,●,◎,◇,◆,□,■,△,▲,※,→,←,↑,↓,〓,〡,〢,〣,〤,〥,〦,〧,〨,〩,㊣,㎎,㎏,㎜,㎝,㎞,㎡,㏄,㏎,㏑,㏒,㏕,︰,￢,￤,℡,ˊ,ˋ,˙,–,―,‥,‵,℅,℉,↖,↗,↘,↙,∕,∟,∣,≒,≦,≧,⊿,═,║,╒,╓,╔,╕,╖,╗,╘,╙,╚,╛,╜,╝,╞,╟,╠,╡,╢,╣,╤,╥,╦,╧,╨,╩,╪,╫,╬,╭,╮,╯,╰,╱,╲,╳,▁,▂,▃,▄,▅,▆,▇,�,█,▉,▊,▋,▌,▍,▎,▏,▓,▔,▕,▼,▽,◢,◣,◤,◥,☉,⊕,〒,〝,〞")},
        { name:"lmsz", title:'罗马数字', content:toArray("ⅰ,ⅱ,ⅲ,ⅳ,ⅴ,ⅵ,ⅶ,ⅷ,ⅸ,ⅹ,Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ,Ⅵ,Ⅶ,Ⅷ,Ⅸ,Ⅹ,Ⅺ,Ⅻ")},
        { name:"szfh", title:'数学字符', content:toArray("⒈,⒉,⒊,⒋,⒌,⒍,⒎,⒏,⒐,⒑,⒒,⒓,⒔,⒕,⒖,⒗,⒘,⒙,⒚,⒛,⑴,⑵,⑶,⑷,⑸,⑹,⑺,⑻,⑼,⑽,⑾,⑿,⒀,⒁,⒂,⒃,⒄,⒅,⒆,⒇,①,②,③,④,⑤,⑥,⑦,⑧,⑨,⑩,㈠,㈡,㈢,㈣,㈤,㈥,㈦,㈧,㈨,㈩")},
        // { name:"rwfh", title:'lang.rwfh', content:toArray("ぁ,あ,ぃ,い,ぅ,う,ぇ,え,ぉ,お,か,が,き,ぎ,く,ぐ,け,げ,こ,ご,さ,ざ,し,じ,す,ず,せ,ぜ,そ,ぞ,た,だ,ち,ぢ,っ,つ,づ,て,で,と,ど,な,に,ぬ,ね,の,は,ば,ぱ,ひ,び,ぴ,ふ,ぶ,ぷ,へ,べ,ぺ,ほ,ぼ,ぽ,ま,み,む,め,も,ゃ,や,ゅ,ゆ,ょ,よ,ら,り,る,れ,ろ,ゎ,わ,ゐ,ゑ,を,ん,ァ,ア,ィ,イ,ゥ,ウ,ェ,エ,ォ,オ,カ,ガ,キ,ギ,ク,グ,ケ,ゲ,コ,ゴ,サ,ザ,シ,ジ,ス,ズ,セ,ゼ,ソ,ゾ,タ,ダ,チ,ヂ,ッ,ツ,ヅ,テ,デ,ト,ド,ナ,ニ,ヌ,ネ,ノ,ハ,バ,パ,ヒ,ビ,ピ,フ,ブ,プ,ヘ,ベ,ペ,ホ,ボ,ポ,マ,ミ,ム,メ,モ,ャ,ヤ,ュ,ユ,ョ,ヨ,ラ,リ,ル,レ,ロ,ヮ,ワ,ヰ,ヱ,ヲ,ン,ヴ,ヵ,ヶ")},
        { name:"xlzm", title:'希腊字母', content:toArray("Α,Β,Γ,Δ,Ε,Ζ,Η,Θ,Ι,Κ,Λ,Μ,Ν,Ξ,Ο,Π,Ρ,Σ,Τ,Υ,Φ,Χ,Ψ,Ω,α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω")},
        // { name:"ewzm", title:'lang.ewzm', content:toArray("А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я,а,б,в,г,д,е,ё,ж,з,и,й,к,л,м,н,о,п,р,с,т,у,ф,х,ц,ч,ш,щ,ъ,ы,ь,э,ю,я")},
        { name:"pyzm", title:'拼音字母', content:toArray("ā,á,ǎ,à,ē,é,ě,è,ī,í,ǐ,ì,ō,ó,ǒ,ò,ū,ú,ǔ,ù,ǖ,ǘ,ǚ,ǜ,ü")},
        { name:"yyyb", title:'英语音标', content:toArray("i:,i,e,æ,ʌ,ə:,ə,u:,u,ɔ:,ɔ,a:,ei,ai,ɔi,əu,au,iə,εə,uə,p,t,k,b,d,g,f,s,ʃ,θ,h,v,z,ʒ,ð,tʃ,tr,ts,dʒ,dr,dz,m,n,ŋ,l,r,w,j,")},
        // { name:"zyzf", title:'lang.zyzf', content:toArray("ㄅ,ㄆ,ㄇ,ㄈ,ㄉ,ㄊ,ㄋ,ㄌ,ㄍ,ㄎ,ㄏ,ㄐ,ㄑ,ㄒ,ㄓ,ㄔ,ㄕ,ㄖ,ㄗ,ㄘ,ㄙ,ㄚ,ㄛ,ㄜ,ㄝ,ㄞ,ㄟ,ㄠ,ㄡ,ㄢ,ㄣ,ㄤ,ㄥ,ㄦ,ㄧ,ㄨ")}
    ];
    
    var specharsTpl = '';

    var utils = UM.utils,
        browser = UM.browser,
        Base = {
        close: function ($img) {

            $img.css({
                top: ($img.parent().height() - $img.height()) / 2,
                left: ($img.parent().width()-$img.width())/2
            }).prev().on("click",function () {

                if ( $(this).parent().remove().hasClass("edui-spechars-upload-item") ) {
                    //显示图片计数-1
                    Upload.showCount--;
                    Upload.updateView();
                }

            });

            return this;
        },
        callback: function (editor, $w, text, state) {
           

                specharsTpl = text

                // var $spechars = $("<audio src='" +  file._url + "' class='edui-spechars-pic'></audio>");
                // var $specharsItem = $("<div class='edui-spechars-item edui-spechars-upload-item'></div>");
                // var $item = $specharsItem.append($muisc);
                // var tmpTpl = '<div class="spechars-item-details"><div>' + file_name + '</div></div>' 
                // $item = $specharsItem.after(tmpTpl);
                Upload.updateView();

                Upload.toggleMask();

                $('.edui-spechars-custom').hide();

                $('.edui-spechars-content').append(specharsTpl);
        }
    };

    UM.registerWidget('spechars', {
        tpl: '',
        initContent: function (editor, $dialog) {

            var headerTps = '<div id="tabHeads" class="tabhead"><span tabsrc="tsfh" class="">特殊字符</span>' +
            '<span tabsrc="lmsz" class="">罗马字符</span>' +
            '<span tabsrc="szfh" class="focus">数学字符</span>' +
            '<span tabsrc="xlzm" class="">希腊字母</span>' +
            '<span tabsrc="pyzm" class="">拼音字母</span>' +
            '<span tabsrc="yyyb" class="">英语音标</span>' +
            '</div>'



            // 循环 创建span标签
            var charTpl = '<div></div>';
            for(var k=0; k<charsContent.length; k++) {
                var  ci = charsContent[k];
                for (var i = 0; i<ci.content.length; i++) {
                    var span = document.createElement("span");
                    span.setAttribute("tabsrc", ci.name);
                    span.innerHTML = ci.content[i];
                    // console.log(span)
                    charTpl = $(charTpl).append(span)
                }


            }
           
            this.root().html(headerTps + '<div class="tabBodys">' +$(charTpl).html()) + '</div>';

            var header = $('#tabHeads>span');
            var item = $('.tabBodys>span')
            header.each(function(index){
               $(this).on('click', function(){
                    header.removeClass('active')
                    header.eq(index).addClass('active')
                    item.css('display', 'none')
                    for(var i=0; i<item.length; i++) {
                        // 判断属性相等，显示
                        if( item.eq(i).attr('tabsrc') == header.eq(index).attr('tabsrc')){
                            item.eq(i).css('display', 'inline-block')
                        }
                    }   
               })
            })
            // 显示第一个
            header.eq(0).trigger('click')

            //单击字符回到编辑器显示
            item.each(function(index){
               $(this).on('click', function(){
                    item.removeClass('active')
                    item.eq(index).addClass('active')
                    um.execCommand('insertHtml', item.eq(index).html());  
               })
            })
           

        },
        initEvent: function (editor, $w) {
           
        },
        buttons: {
            'ok': {
                exec: function (editor, $w) {}
            }
        },
        width: 700,
        height: 358
    }, function (editor, $w, url, state) {
        Base.callback(editor, $w, url, state)
    })
})();

function toArray(str) {
    return str.split(",");
}
