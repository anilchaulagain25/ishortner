//utils
var utils = {    
    getUuidv4:  function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    overlay:{
        on:function(text){
            document.getElementById("overlay").style.display = "block";
            if(text)
            document.getElementById("overlay").innerText = text;
        },
        off:function(){
            document.getElementById("overlay").style.display = "none";
        }
    }
}
// end of utils

function initlizeApp(){
    
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
        utils.overlay.on('Loading data');
        
        $.ajax({
            url:"/url?user-id="+userId,
            dataType : "json",
            method : "GET",
            contentType: "application/json; charset=utf-8",
            success : function(result) {
                var tbody="";
                if(result && Array.isArray(result)){
                    for (let index = 0; index < result.length; index++) {
                        var element = result[index];
                        tbody+="<tr>";
                        
                        tbody+="<td>";
                        tbody+=(index+1);
                        tbody+="</td>";
                        
                        tbody+="<td>";
                        tbody+=element.l_url;
                        tbody+="</td>";
                        
                        tbody+="<td><a target='_blank' href='"+ element.s_url +"'>";
                        tbody+=element.s_url;
                        tbody+="</a></td>";
                        
                        tbody+="</tr>";
                    }
                }
                $("#tableMain #tbodyMain").html(tbody);
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



