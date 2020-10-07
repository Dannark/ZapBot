
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];

    console.log("Recebendo Click");
    
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});

  });
});


function sendMessage(destinationNumber, content){
	//content = content.replace("");
	content = JSON.stringify(content);
	console.log("Enviando menssagem para: "+destinationNumber+"/"+content);

	chrome.tabs.getAllInWindow(null, function(tabs) {
    	var size = tabs.length;
    	var founded = false;

    	for(var i=0;i<size;i= i + 1){
    		if(founded == true){
               console.log("sendMessage two tabs with web, breaking loop.");
               break;
            }
            var tab = tabs[i];
			var url = tab.url;
			//alert("tab url="+url);

			if(url.indexOf("web.whatsapp") > -1){
				console.log("founded tab.id=" + tab.id);
				founded = true;
				var tabId = tab.id;

				isWebActive(tab.id, function(webActive){
					console.log("isWebActive="+webActive);
					/*
					if(webActive == false){
						var scriptUseHere = getScriptUseHere(tabId);
						chrome.tabs.executeScript(tabId, {code: scriptUseHere}, 
							function(response) {
								console.log('scriptUseHere done' + response);
							});
						wait(15000);
					}*/

					var uuid = uuidv4();
					console.log("uuid="+uuid);

					//TRAS A JANELA DA CONVERSA PARA O FOREGROUND
					var scriptRedirect = getScriptToRedirect(uuid, destinationNumber);
					chrome.tabs.executeScript(tabId, {code: scriptRedirect}, 
						function(response) {
							console.log('redirect done' + response);
						});
					wait(4000);

					//PREPARA PARA ENVIAR A MENSSAGEM
					var scriptType = getScriptType(uuid, content);
					chrome.tabs.executeScript(tabId, {code: scriptType}, function(response) {
						console.log('type done' + response);
					});
					     

					var scriptType = getScriptDismiss(uuid);
					chrome.tabs.executeScript(tabId, {code: scriptType}, 
						function(response) {
						console.log('dismiss done' + response);
					});

				});
			}
    	}
    });
}


function getPhonenumber(tabId, callback){
  chrome.tabs.executeScript(tabId,
      {code:"document.getElementsByClassName('_3Jvyf')[0].getElementsByClassName('_3RWII')[0].innerHTML;"},
        function(result){
          try{
          var txt = result.toString();
          if(txt.indexOf("u=") > -1){
             var index = txt.indexOf("u=");
             var partial = txt.substring(index + 2, txt.length);
             index = partial.indexOf("%");
             partial = partial.substring(0, index);
             callback(partial);
          }else{
            callback("");
          }
        }catch(er){
          callback("");
        }
          
    });
}

function isWAOpenRetTab(callback){
    chrome.tabs.getAllInWindow(null, function(tabs) {
    if(tabs == undefined || tabs == null){
        callback(null);
        return;
    }
    var size = tabs.length;
    //console.log("tabls");
    for(var i=0;i<size;i= i + 1){
       var tab = tabs[i];
       var url = tab.url;
       console.log("url" + url);
       if(url.indexOf("web.whatsapp") > -1){
            callback(tab.id);
            return;
       }
    }
    callback(null);
                
  });
}

 function isWALogged(tabId, callback){
    /*
    Check with there is a valid session and tokens
    of whatsapp web.
    If there is a qr code validation is not enabled
    */
    getBodyIndexOf(tabId, "CLIQUE PARA CARREGAR O CÓDIGO QR NOVAMENTE", 
      function(qrResult){
         if(qrResult > 0){
            callback(false);
         }else{
            callback(true);
         }
      }
    );
}

function getBodyIndexOf(tabId, content, callback){
   if(content == undefined || content == ''){
      return callback(0);
   }else{
      chrome.tabs.executeScript(tabId,
        {code:"document.body.innerText.indexOf('"+content+"');"},
         function(result){
           return callback(result);
       });
   }
}

function isWebActive(tabId, callback){
  chrome.tabs.executeScript(tabId,
     {code:"document.getElementsByClassName('_2dA13').length;"},
     function(result){
        if(result == null || result == undefined || result == '0' || result == 0 ){
           return callback(result);
        }else{
          return callback(false);
        }
  });
}

 function getScriptUseHere(id){
     var script = "";
     script = script + "  try{";
     script = script + "    if(document.getElementsByClassName('_2dA13').length > 0){";
     script = script + "      var tear = document.getElementsByClassName('_2dA13')[0];";
     script = script + "      var useHere = tear.getElementsByClassName('PNlAR')[0];";
     script = script + "      useHere.click();";
     script = script + "     }";
     script = script + "}catch(ers){}";
     return script;
 }

 function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }
 }

 function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
     return v.toString(16);
   });
 }

 function getScriptToRedirect(id, phonenumber){
   var script = "";
   script = script + "console.log('ScriptToRedirect');";
   script = script + "var link = 'http://api.whatsapp.com/send?phone="+phonenumber+"';";
   script = script + "var element = document.createElement('a');";
   script = script + "element.setAttribute('href', link);";
   script = script + "element.innerHTML = '';";
   script = script + "element.setAttribute('id', '"+id+"_anchor');";
   script = script + "document.body.appendChild(element);";

   script = script + "var elementDiv = document.createElement('div');";
   script = script + "elementDiv.innerHTML = '';";
   script = script + "elementDiv.style.cssText = 'position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;background-color: black;opacity: 0.6;z-index: 999;';";
   script = script + "elementDiv.setAttribute('id', '"+id+"_canvas');";
   script = script + "document.body.appendChild(elementDiv);";

   script = script + "var elementLoading = document.createElement('span');";
   script = script + "elementLoading.innerHTML = 'Carregando...';";
   script = script + "elementLoading.style.cssText = 'position: absolute;top: 50%;left: 50%;width: 150px;height: 50px;font-size: 24px;color: white;z-index: 999;';";
   script = script + "elementLoading.setAttribute('id', '"+id+"_loading');";
   script = script + "document.body.appendChild(elementLoading);";

   script = script + "document.getElementById('"+id+"_anchor').click();";
   return script;
}

function getScriptDismiss(id){
   var script = "";
   script = script + "console.log('getScriptDismiss');";
   script = script + "document.getElementById('"+id+"_anchor').remove();";
   script = script + "document.getElementById('"+id+"_canvas').remove();";
   script = script + "document.getElementById('"+id+"_loading').remove();";
   return script;
}

function getScriptType(id, content){
  var script = "";
  script = script + "console.log('getScriptType-"+id+"');";
  script = script + "var errorFlag = false;";
  script = script + "try{";
  script = script + "var errorText = document.getElementsByClassName('_3lLzD')[0].innerText;";
  script = script + "if(errorText!=undefined && errorText.length > 10){";
  script = script + "  errorFlag = true;";
  script = script + "}";
  script = script + "}catch(err){console.log(err);}";
  script = script + "var invalidDiv = document.getElementsByClassName('_1WZqU');";
  script = script + "if(invalidDiv == undefined || invalidDiv.length == 0 || ";
  script = script + "   invalidDiv[0].attributes == undefined || errorFlag == false ){";
  script = script + "   var event = new Event('input', {bubbles: true});";
  script = script + "   var textbox = document.getElementsByClassName('_3u328');";
  script = script + "   textbox[0].textContent = "+content+";";
  script = script + "   textbox[0].dispatchEvent(event);";
  script = script + "   var sendbox = document.getElementsByClassName('_3M-N-');";
  script = script + "   sendbox[0].click();";
  script = script + "   "+getStatusCreateTagWithIdAndValue(id, '1');
  script = script + "}else{";
  script = script + "  invalidDiv[0].click();";
  script = script + "  console.log('invalidDiv b' + JSON.stringify(invalidDiv));";
  script = script + "   "+getStatusCreateTagWithIdAndValue(id, '2');
  script = script + "}";
  return script;
}

function getStatusCreateTagWithIdAndValue(id, value){
  var script = "";
  script = script + "var el_tmp = document.createElement('a');";
  script = script + "el_tmp.innerHTML = '"+value+"';";
  script = script + "el_tmp.setAttribute('id', 'el_"+id+"');";
  script = script + "document.body.appendChild(el_tmp);";
  return script;
}


// ================= RECIEVE AND SEND =======================

//chrome.runtime.onMessageExternal.addListener( // versão anterior
chrome.extension.onRequest.addListener( // versão chrome posterior a 19
    function(request, sender, sendResponse) {

    if(request != null && request != ''){
        
        //Comando recebido
        isWAOpenRetTab(function(data){
	    	var tabId = data;

	    	if(tabId != null){
		    	//alert("WhatsApp Web Is Open on tabId="+tabId);

		    	isWALogged(tabId, function(waLogged){
		    		if(waLogged == true){

		    			getPhonenumber(tabId,  function(phonenumber){
                console.log("myPhonenumber ="+phonenumber);

                if(phonenumber != null && phonenumber != ''){
					        var destinationNumber = request.to;

                  console.log("destinationNumber="+destinationNumber+" request.message="+request.message + " ");
					        if(destinationNumber != null && destinationNumber != '' 
					        	&& request.message != null && request.message != ''){

                    if(request.type == "group"){
                      //send request to content
                      console.log("send to group");
                      chrome.tabs.sendMessage(tabId, {"message": "send_message_to_group", "msg_content": request.message, "to_group": destinationNumber});
                    }
                    else{
							        sendMessage(destinationNumber, request.message);
                    }
  								}
  								else{
  									console.log("Informações invalidas");
  								}
						    }
						    else{
						    	//console.log("Seu plugin precisa de atualização!"); //not true
						    }
					    });

		    		}
		    		else{
		    			alert("WhatsApp Web is NOT ON");
		    		}
		    	});
		    }
		    else{
		    	alert("WhatsApp Web Não foi encontrado!");
          chrome.tabs.create({ url: "https://web.whatsapp.com" });
		    }
	    	
	    });
    }

});