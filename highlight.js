var lamb = document.createElement("lamb");
var escapeHTML = function(text){
    lamb.textContent = text;
    return lamb.innerHTML;
};

function colorToken(token){
    var txt = token.text;
    var outp = ['<tok_'+token.name+' class="colorized">'];
    for (var i=0; i < token.data.length; i++){
        for(var c=0; c < token.data[i].items.length; c++){
            var t = token.data[i].items[c];
            if(typeof(t)=="string"){
                var starts = txt.indexOf(t);
                outp.push('<tok_comment class="colorized">'+escapeHTML(txt.substring(0,starts))+'</tok_comment>');
                outp.push(escapeHTML(t));
                txt = txt.substring(starts + t.length);
                continue;
            }
            var startp = txt.indexOf(t.text);
            var endp = startp + t.text.length;
            var res = colorToken(t);
            outp.push('<tok_comment class="colorized">'+escapeHTML(txt.substring(0,startp))+'</tok_comment>');
            outp.push(res);
            txt = txt.substring(endp,txt.length);
        }
    }
    outp.push('<tok_comment class="colorized">'+escapeHTML(txt)+'</tok_comment>');
    outp.push('</tok_'+token.name+'>');
    return outp.join("");
}

window.addEventListener("load", ()=>{
    // When a key is pushed, we need to update the stuff.
    var editor = document.getElementById("editor")
    var underlay = document.getElementById("underlay")
    var updateEditor = -1
    editor.addEventListener("keyup", ()=>{
        underlay.innerHTML = ''
        editor.style = 'height: ' + Math.max(16, editor.scrollHeight) + '; color:black;'
        if(updateEditor >= 0){
            clearTimeout(updateEditor)
        }
        updateEditor = setTimeout(()=>{
            updateEditor = -1
            var prgm = TOKENIZER.compile(editor.value)
            underlay.innerHTML = colorToken(prgm) + '<tok_comment class="colorized">'+escapeHTML(prgm.remainder)+'</tok_comment>'
            editor.style = 'height: ' + Math.max(16, editor.scrollHeight) + ';'
        }, 100)
    })
})