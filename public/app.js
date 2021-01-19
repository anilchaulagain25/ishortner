//utils
var utils = {    
    getUuidv4:  function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    overlay:{
        on:function(text, disapperInSeconds){
            document.getElementById("overlay").style.display = "block";
            if(text)
            $("#overlay span").text(text);
            if(disapperInSeconds)
            setTimeout(utils.overlay.off, 1000* disapperInSeconds);
        },
        off:function(){
            $("#overlay span").text("Please wait ...");
            document.getElementById("overlay").style.display = "none";
        }
    },
    getLongUrlFormat:function(input){
        var maxLength = 20;
        input = input || "";
        if(input.length > maxLength){
            return input.substr(0,maxLength-1)+"...";
        }
        return input;
    },
    copyToClipboard:function (text) {
        var input = document.body.appendChild(document.createElement("input"));
        input.value = text;
        input.focus();
        input.select();
        document.execCommand('copy');
        input.parentNode.removeChild(input);
    }
}
// end of utils

function initlizeApp(){
    
    //url list
    var urlList  =ko.observableArray([])
    var vm = {urlList:urlList, formatLongUrl:function(input){return utils.getLongUrlFormat(input)}};
    vm.copySUrl=function(data){
        utils.copyToClipboard(data.s_url);
        utils.overlay.on("copied successfully",1);
    }
    ko.applyBindings(vm);
    
    
    // set/get local storage
    var userId = window.localStorage.getItem('user-id');
    if(!window.localStorage) alert('local storage not availeble')
    if(!userId) localStorage.setItem('user-id',utils.getUuidv4())
    
    //event listeners
    
    window.submitForm=function () {
        utils.overlay.on();
        var l_url = $("#txtLongUrl").val();
        if(l_url){
            var data = {
                l_url : l_url,
                usr :userId
            };
            $.ajax({
                url:"/url",
                dataType : "json",
                method : "POST",
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(data),
                success : function(result) {
                    utils.overlay.on('Created successfully');
                    $("#txtLongUrl").val('')
                    loadData()
                },
                complete:function(){
                    utils.overlay.off();
                }            
            })
        }
    }
    function loadData(){
        utils.overlay.on('Loading data...');
        
        $.ajax({
            url:"/url?user-id="+userId,
            dataType : "json",
            method : "GET",
            contentType: "application/json; charset=utf-8",
            success : function(result) {
                if(result && Array.isArray(result)){
                    urlList(result);
                }
            },
            complete:function(){
                utils.overlay.off();
            }
        })
    }
    
    
    utils.overlay.off();
    loadData();
    
    
}



$(document).ready(function(){
    initlizeApp();
})



