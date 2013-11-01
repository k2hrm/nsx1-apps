var text2sysex=function(){
    this.sysExPrefix=[ 0xF0, 0x43, 0x79, 0x09, 0x00, 0x50, 0x10 ];
    this.sysExSuffix=[ 0x60, 0xF7 ];
    this.textMap={
        1: {
            "あ": "a",   "い": "i",    "う": "M",     "え": "e",   "お": "o",
            "か": "k a", "き": "k' i",  "く": "k M",   "け": "k e", "こ": "k o",
            "さ": "s a", "し": "s i",  "す": "s M",   "せ": "s e", "そ": "s o",
            "た": "t a", "ち": "t i",  "つ": "t M",   "て": "t e", "と": "t o",
            "な": "n a", "に": "J i",  "ぬ": "n M",   "ね": "n e", "の": "n o",
            "は": "h a", "ひ": "C i",  "ふ": "p\\ M", "へ": "h e", "ほ": "h o",
            "ま": "m a", "み": "m' i", "む": "m M",   "め": "m e", "も": "m o",
            "や": "j a", "ゆ": "j M",  "よ": "j o",
            "ら": "4 a", "り": "4' i", "る": "4 M",   "れ": "4 e", "ろ": "4 o",
            "わ": "w a", "ゐ": "w i",  "ゑ": "w e",   "を": "w o", "ん": "N\\",
            "ば": "b a", "び": "b' i", "ぶ": "b M",   "べ": "b e", "ぼ": "b o",
            
            "が": "g a",  "ぎ": "g             i",   "ぐ": "g M",  "げ": "g e",  "ご": "g o",
            "ざ": "dZ a", "じ": "dZ i", "ず": "dZ M", "ぜ": "dZ e", "ぞ": "dZ o",
            "だ": "d a",  "ぢ": "d i",  "づ": "d M",  "で": "d e",  "ど": "d o",

            "ぱ": "p a",  "ぴ": "p' i", "ぷ": "p M", "ぺ": "p e", "ぽ": "p o",

            "ぁ": "a",  "ぃ": "i",  "ぅ": "M",  "ぇ": "e",  "ぉ":"o",
            "ゃ": "j a", "ゅ": "j M", "ょ": "j o", "ゎ": "w a"
        },
        2: {
            "きゃ": "k' a",  "きゅ": "k' M",  "きょ": "k' o",
            "しゃ": "S a",   "しゅ": "S M",   "しょ": "S o",
            "ちゃ": "t S a", "ちゅ": "t S M", "ちょ": "t S o",
            "てゃ": "t' a",  "てゅ": "t' M",  "てょ": "t' o",
            "にゃ": "J a",   "にゅ": "J M",   "にょ": "J o",
            "ひゃ": "C a",   "ひゅ": "C M",   "ひょ": "C o",
            "みゃ": "m' a",  "みゅ": "m' M",  "みょ": "m' o",
            "りゃ": "4' a",  "りゅ": "4' M",  "りょ": "4' o",

            "ふぁ": "p\ a",

            "ぎゃ": "g' a",  "ぎゅ": "g' M",  "ぎょ": "g' o",
            "じゃ": "d Z a", "じゅ": "d Z m", "じょ": "d Z o",
            "でゃ": "d' a",  "でゅ": "d' M",  "でょ": "d' o",
            "みゃ": "m' a",  "みゅ": "m' M",  "みょ": "m' o",
            "びゃ": "b' a",  "びゅ": "b' M",  "びょ": "b' o",
            "ぴゃ": "p' a",  "ぴゅ": "P' M",  "ぴょ": "p' o",
            "ふゃ": "p\' a", "ふゅ": "p\' M" /* [定義がない] "ふょ":"" */



        }
    };
};

text2sysex.prototype={
    getSysExByText: function(ls) {
        console.log(ls);
        var out=new Array();
        for(var i=0; i<ls.length; i++) {
            var t;
            t=this.textMap[2][ls.substring(i, i+2)];
            if(typeof t==="undefined") {
                t=this.textMap[1][ls.substring(i, i+1)];
            } else {
                i++;
            }
            if(typeof t==="undefined") {
                console.log("[ERROR] "+ls.substring(i, i+1));
            }
            for(var j=0; j<t.length; j++) {
                out.push(t.charCodeAt(j));
                //console.log(t.charCodeAt(j));
            }
            out.push(0x2c); // "," between each letter 
        }
        out=this.sysExPrefix.concat(out, this.sysExSuffix);
        return out;
    }
};

var t2s=new text2sysex();
