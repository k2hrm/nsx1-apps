//regulation
var tou_url="regulations/yamaha_webapp.txt";
var dRgl=new DispRegulation();
dRgl.show(tou_url);

document.getElementById("showToUJ").addEventListener("click", function() {
    dRgl.getRegulation(tou_url, dRgl);
    var tTimerId=setInterval(function() {
        if(dRgl.xhrDone==true) {
            clearInterval(tTimerId);
            document.getElementById("regContent").innerHTML=dRgl.regulationText;
        }
    },10);
});

// midi out select modal
var $midiOutModal=$("#midiOutSelM").modal({
    show: false
});
$("#divSetOutput").on("click", function() {
    $midiOutModal.modal("show");
});
$("#midiOutSelM").on("shown.bs.modal", function(event) {
    clearAllAlertMessageInModal();
    showMidiOutSelM("divMidiOutSelWarning", "OUT");
});
$("#midiOutSelM").on("hidden.bs.modal", function(event) {
    clearAllAlertMessageInModal();
});
function clearAllAlertMessageInModal() {
    var messageInModal=document.getElementById("divMidiOutSelWarning");
    while(messageInModal.firstChild) {
        messageInModal.removeChild(messageInModal.firstChild);
    }
}

function showMidiOutSelM(elem, checkType) {
    var message="", className="";
    switch(checkType) {
      case "IN":
        if(outputs.length<1) {
            message="Please Connect MIDI devices. This application needs at least one MIDI Device.";
        }
        break;
      case "OUT":
        if(outputs.length<1) {
            message="Please Connect MIDI devices. This application needs at least one MIDI Device.";
            className="alert alert-danger";
        } else {
            message="Select MIDI device.";
            className="alert alert-info";
        } 
        break;
      case "INOUT":
        if(typeof mIn!="object" || typeof mOut!="object") {
        }
        break;
    }

    if(message!="") {
        var divAlert=document.createElement("div");
        divAlert.className=className;
        divAlert.innerHTML=message;
        document.getElementById(elem).appendChild(divAlert);
    }
    var type="click";
    var e=document.createEvent('MouseEvent');
    var b=document.getElementById("divSetOutput");
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);
}


function lubi (word) {
    // To use Kanji to Hiragana API, it is allow nsx-1 to speech every Japanese.
    // play sound 
    var now=window.performance.now();
    mOut.send([0xc1, 0x0b], now);
    mOut.send([0x91, 0x4f, 0x7f], now);
    mOut.send([0x91, 0x4f, 0x00], now+50);
    mOut.send([0x91, 0x48, 0x7f], now+100);
    mOut.send([0x91, 0x4a, 0x7f], now+200);
    mOut.send([0x91, 0x48, 0x00], now+380);
    mOut.send([0x91, 0x4a, 0x00], now+420);
    
    speechWord=word.replace(/ /g, "");
    document.getElementById("final_span").innerHTML=speechWord;
    if(playbackMode=="repeat") {
        playKodama(speechWord, 650);
    }
}

// play mode
var playbackMode="repeat"; // or step
document.getElementById("repeatMode").addEventListener("click", function(event) {
    playbackMode="repeat";
    document.getElementById("modeName").innerHTML="<span class=\"glyphicon glyphicon-repeat\"></span> Repeat</span>";
    document.getElementById("start").setAttribute("disabled", "disabled");
});
document.getElementById("stepForwardMode").addEventListener("click", function(event) {
    playbackMode="step";
    document.getElementById("modeName").innerHTML="<span class=\"glyphicon glyphicon-step-forward\"></span> Step</span>";
    document.getElementById("start").removeAttribute("disabled");
});


// speech api
var recognition = new webkitSpeechRecognition();
var isRecognition=false;
recognition.continuous = true;
recognition.lang="ja-JP";
recognition.interimResults = true;

document.getElementById("start_img").addEventListener("click", function() {
    // check whether midi out is set or not
    if(typeof mOut!="object") {
        showMidiOutSelM("divMidiOutSelWarning", "OUT", "start_img");
        return;
    }

    if(isRecognition===false) {
        isRecognition=true;
        document.getElementById("interim_span").innerHTML="";
        document.getElementById("final_span").innerHTML="";
        console.log("[Recignition Start]");
        recognition.start();
    } else {
        isRecognition=false;
        document.getElementById("start_img").className="";
        console.log("[Recignition Stop]");
        recognition.stop();
    }
});
recognition.onaudiostart = function(event) {
    document.getElementById("start_img").className="blinkMic";

    // play sound
    var now=window.performance.now();
    mOut.send([0xc1, 0x0b], now);
    mOut.send([0x91, 0x48, 0x7f], now);
    mOut.send([0x91, 0x4a, 0x7f], now+100);
    mOut.send([0x91, 0x48, 0x00], now+150);
    mOut.send([0x91, 0x4a, 0x00], now+150);
};
recognition.onaudioend = function(event) {
    document.getElementById("start_img").className="";
};
recognition.onerror = function(event) {
    switch(event.error) {
      case "not-allowed":
        document.getElementById("divMicInputWarning").innerHTML="ブラウザのマイク入力の許可が必要です。アドレスバーのビデオアイコンをクリックしてマイクの利用を許可してください。<br>--<br>Mic Input is not allowd in your browser. Check the mic permission in addres bar.";
        document.getElementById("divMicInputWarning").className="alert alert-danger";
        break;
      case "network":
        document.getElementById("divMicInputWarning").innerHTML="ネットワークエラーです。アプリケーションのご利用はこのコンピュータがインターネットへ接続されている必要があります。<br>--<br>Network Error. This application needs internet connection. Please connect your computer to the internet.";
        document.getElementById("divMicInputWarning").className="alert alert-danger";
        break;
    }
    var $micInputErrorM=$("#micInputErrorM").modal({
        show: false
    });
    $micInputErrorM.modal("show");
};
recognition.onend = function(event) {
    document.getElementById("start_img").className="";
    isRecognition=false;

    // play sound
    var now=window.performance.now();
    mOut.send([0xc1, 0x0b], now);
    mOut.send([0x91, 0x4a, 0x7f], now);
    mOut.send([0x91, 0x4a, 0x7f], now+100);
    mOut.send([0x91, 0x4a, 0x00], now+170);
    mOut.send([0x91, 0x4a, 0x00], now+170);
};
recognition.onresult = function(event){
    var results = event.results;
    for (var i = event.resultIndex; i<results.length; i++){
        // final answer
        if(results[i].isFinal){
            document.getElementById("interim_span").innerHTML="";
            var final_answer=results[i][0].transcript;
            document.getElementById("final_span").innerHTML=final_answer;
            if(final_answer!="") lubi(results[i][0].transcript);

            document.getElementById("start_img").className="blinkMic";
            document.getElementById("start_img").style.setProperty("background-position", "left top");
        }
        // interim answer
        else{
            // play sound
            var now=window.performance.now();
            mOut.send([0xc1, 0x0b], now);
            mOut.send([0x91, 0x4f, 0x1c], now);
            mOut.send([0x91, 0x4f, 0x00], now+150);

            document.getElementById("final_span").innerHTML="";
            document.getElementById("interim_span").innerHTML=results[i][0].transcript;

            document.getElementById("start_img").className="blinkMicR";
            document.getElementById("start_img").style.setProperty("background-position", "left bottom");
        }
    }
};

// sing mode
var singMode="autodoremi"; // autodoremi

// kodama play
var speechWord="おんせいにんしきさせてね";
document.getElementById("start").addEventListener("click", function(event) {
    // check whether midi out is set or not
    if(typeof mOut!="object") {
        showMidiOutSelM("divMidiOutSelWarning", "OUT", "start");
        return;
    }
    playKodama(speechWord, 0);
});


function playKodama(spWord ,delay) {
    
    spWord=spWord.replace(/。/g, "").replace(/ /g, "");

    var notHiragana=false;
    if(spWord.match(/^[\u3040-\u309F]+$/)==null) {
        spWord="ごめんなさいひらがなしかよめません";
        document.getElementById("kanji").style.removeProperty("visibility");
        notHiragana=true;
    }
    
    var sysEx=nsx1.getSysExByText(spWord);
    var now=window.performance.now();
    for(var i=0; i<sysEx.length; i++) {
        mOut.send(sysEx[i], now+i*10);
    }
    var interval=240;
    var start=window.performance.now()+delay+150;
    var stringSearch = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "っ", "ゃ", "ゅ","ょ", "ゎ", "。"];
    var count, aCount=0;
    for(var si=0; si<stringSearch.length; si++) {
        var ss=stringSearch[si];
        for(var ci=count=0; ci<spWord.length; count+=+(ss===spWord[ci++]));
        aCount+=count;
    }
    for(var i=0; i<spWord.length-aCount; i++) {
        mOut.send([0x90, 0x3c, 0x7f],start+i*interval);
        mOut.send([0x90, 0x3c, 0x00],start+(i+1)*interval);
        if(notHiragana==true) {
            notHiragana=false;
            var timerId=setInterval(function() {
                document.getElementById("kanji").style.setProperty("visibility", "hidden");
                clearInterval(timerId);
            }, 5000);
        }
    }
}

// Web MIDI API
var midi, midiIsConnected;
var inputs, outputs;
var mOut;

navigator.requestMIDIAccess( { sysex: true } ).then( scb, ecb );

function scb(access){
    var midi=access;
    inputs=midi.inputs();
    outputs=midi.outputs();    
    
    // MIDI OUT
    var mo=document.getElementById("midiOutSel");
    for(var i=0; i<outputs.length; i++) {
        // in modal
        mo.options[i]=new Option(outputs[i]["name"], i);
    }
    // set device in modal
    document.getElementById("midiOutSelB").addEventListener("click", function(){
        var selIdx=document.getElementById("midiOutSel").selectedIndex;
        if(selIdx<0) {
            return;
        }
        selectMidiOut(selIdx);
        $("#midiOutSelM").modal("hide");

    });
}
function selectMidiOut(selIdx) {
    mOut = outputs[selIdx];
    document.getElementById("setOutput").innerHTML=outputs[selIdx].name;
    document.getElementById("divSetOutput").style.setProperty("background-color", "#5cb85c");
    document.getElementById("divSetOutput").style.setProperty("border-color", "#5cb8af");
    document.getElementById("divSetOutput").style.setProperty("color", "#ffffff");
}


function ecb(msg) {
    console.log("[Error Callback]", msg);
}

function midiInputEvent(event) {
    mOut.send(event.data);
}

document.getElementById("resetAllController").addEventListener("click", function(event){
    // check whether midi out is set or not
    if(typeof mOut!="object") {
        showMidiOutSelM("divMidiOutSelWarning", "OUT", "resetAllController");
        return;
    }

    var msg=[ 0xB0, 0x79, 0x00 ];
    mOut.send( msg );
    
    var msg=[ 0xB0, 0x7B, 0x00 ];
    mOut.send( msg );

    var msg=[ 0xB0, 0x78, 0x00 ];
    mOut.send( msg );

});
