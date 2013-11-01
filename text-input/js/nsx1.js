var Nsx1=function(){
    this.sysExPrefix={
        "update" : [ 0xF0, 0x43, 0x79, 0x09, 0x00, 0x50, 0x10 ],
        "append" : [ 0xF0, 0x43, 0x79, 0x09, 0x00, 0x50, 0x11 ]
    };
    this.sysExSuffix=[ 0x00, 0xF7 ];
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
    this.key={ };
    this.key={
        "note": ["C", "D", "E", "F", "G", "A", "B", "C+"],
        "order": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        "itnl2Key": {},
        "key2Itnl": []
    };
    for(var i=24, j=0, number=1; i<=108; i++) {
        this.key["itnl2Key"][this.key["order"][j]+number]=i;
        this.key["key2Itnl"][i]=this.key["order"][j]+number;
        j++;
        if(j==this.key["order"].length) {
            j=0; number++;
        }
    }
    this.key["itnl2Key"]["A0"]=21,  this.key["key2Itnl"][21]="A0";
    this.key["itnl2Key"]["A#0"]=22, this.key["key2Itnl"][22]="A#0";
    this.key["itnl2Key"]["B0"]=23,  this.key["key2Itnl"][23]="B0";
};

Nsx1.prototype={
    getSysExByText: function(ls) {
        var outTmp=[], outArray=[];
        var devide=9;
        var i=0;
        
        while(ls.length>0) {
            outTmp=[];
            
            var tmp=ls.substr(0, devide);
            if(ls.substr(devide-1, 2).length==2 && typeof this.textMap[2][ls.substr(devide-1, 2)]!="undefined") {
                tmp=ls.substr(0, devide+1);
            }

            var re= new RegExp("^"+tmp);
            ls=ls.replace(re, "");
            
            for(var j=0; j<tmp.length; j++) {
                var t;
                t=this.textMap[2][tmp.substring(j, j+2)];
                if(typeof t==="undefined") {
                    t=this.textMap[1][tmp.substring(j, j+1)];
                } else {
                    j++;
                }
                if(typeof t==="undefined") {
                    console.log("[ERROR] "+tmp.substring(j, j+1));
                }
                for(var k=0; k<t.length; k++) {
                    outTmp.push(t.charCodeAt(k));
                }
                if(j!=tmp.length-1) {
                    outTmp.push(0x2c); // "," between each letter 
                }
            }
            if(i==0) {
                outArray.push(this.sysExPrefix.update.concat(outTmp, this.sysExSuffix));
            } else {
                outArray.push(this.sysExPrefix.append.concat(outTmp, this.sysExSuffix));
            }
            i++;
        }
        return outArray;
    },
    getSysExByNoteNo: function(noteNo) {
        var nw=this.key["key2Itnl"][noteNo].substr(0, this.key["key2Itnl"][noteNo].length-1);
        var t, type; // type: natural:n, sharp:s, flat:f
        switch(nw) {
          case "C":
            t="ど";
            type="n";
            break;
          case "C#":
            t="どしゃぷ";
            type="s";
            break;
          case "D":
            t="れ";
            type="n";
            break;
          case "D#":
            t="れしゃぷ";
            type="s";
            break;
          case "E":
            t="み";
            type="n";
            break;
          case "F":
            t="ふぁ";
            type="n";
            break;
          case "F#":
            t="ふぁしゃぷ";
            type="s";
            break;
          case "G":
            t="そ";
            type="n";
            break;
          case "G#":
            t="そしゃぷ";
            type="s";
            break;
          case "A":
            t="ら";
            type="n";
            break;
          case "A#":
            t="らしゃぷ";
            type="s";
            break;
          case "B":
            t="し";
            type="n";
            break;
        }
        var w=this.getSysExByText(t);
        return [w[0], type];
    }
    
};

var nsx1=new Nsx1();
