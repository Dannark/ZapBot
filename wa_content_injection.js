var userObject = "_210SC";//_2WP9Q
var userContainerClick = "eJ0yJ";
var userTitle = "_3CneP";
var userTitleTextObject = "_3ko75";
var userMsg = "_2iq-U";
var notReadMsg = "m61XR";

var containerCaixaDeTexto = '_2UL8j'
var caixaTexto = "_3FRCZ";
var sendButton = "_1U1xa";

// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      //console.log(firstHref);

      
      

      //X7YrQ contato item

      //sendToGroup("GSOL CENTRO DE OPERAÇÕES");

      setExtensionId();
      
      getNewMessages(true);
      setInterval("getNewMessages(false)", 3000);
    }
    else if( request.message === "send_message_to_group" ) {
    	console.log("Enviar menssagem: "+request.msg_content +" toGroup: "+request.to_group);

    	sendToGroup(request.msg_content, request.to_group);
    }
  }
);

function sendToGroup(msgToSend, toGroup){

	var myVar;
	$('.'+userObject).each(function(){
		
		if($(this).find('.'+userTitle).attr('title') != undefined && $(this).find('.'+userMsg).attr('title') != undefined){

			var myTitle = ""+$(this).find('.'+userTitle).attr('title').toString().trim();
			var myMsg = ""+$(this).find('.'+userMsg).attr('title').toString().trim();

			//lastAnsweredUsers.push({name:myTitle, value:myMsg});
			
			if(myTitle == toGroup){
				myVar = $(this);
			}
		}
		else{
			console.log("erro ao encontrar classe do usuario title/msg");
		}
	});

	var elementoClick = myVar.find("."+userContainerClick);
	triggerMouseEvent(elementoClick, "mousedown");
	
	sendMsg(msgToSend, sendButton);

}

var lastAnsweredUsers = [];
function getNewMessages(isFirstTime){
	
	

	if(isFirstTime == true){
		//console.log("salvando copia das menssagens...");
		$('.'+userObject).each(function(){
			
			var title = $(this).find('.'+userTitle).find('.'+userTitleTextObject).attr('title')
			var msg = $(this).find('.'+userMsg).attr('title')
			
			if(title != undefined && msg != undefined){
				var myTitle = ""+title.toString().trim();
				var myMsg = ""+msg.toString().trim();

				lastAnsweredUsers.push({name:myTitle, value:myMsg});
			
			}
			else{
				if(title == null){
					console.log("erro ao encontrar classe do usuario title", title);
				}
				if (msg == null){
					console.log("erro ao encontrar classe do usuario msg", msg);
				}
			}
		});
		console.log("Salvo ["+lastAnsweredUsers.length+"] menssagens.");
	}
	
	console.log("fazendo varredura de menssagens, anterior: ["+lastAnsweredUsers.length+"]");
	$('.'+userObject).each(function(){

		/*
		var hasNotRead = $(this).find("."+notReadMsg);

		if(hasNotRead.length > 0){ 
			//This is a unread message
	    }
	    else{
	    	//This is a message read
	    }
	    */

	   var title = $(this).find('.'+userTitle).find('.'+userTitleTextObject).attr('title')
	   var msg = $(this).find('.'+userMsg).attr('title')

	    if(title != undefined && msg != undefined){

			var myTitle = title.toString().trim();
			var myMsg = msg.toString().trim().slice(1,-1);

	        for (var i = 0; i < lastAnsweredUsers.length; i++) {
	    		if(lastAnsweredUsers[i].name.includes(myTitle)){
	        		if(lastAnsweredUsers[i].value.includes(myMsg)){
						//conversa salva anteriormente
						
	        		}
	        		else{
	        			//nova conversa
	        			console.log("new message of "+myTitle+": "+myMsg);
	        			var lastAnswer = lastAnsweredUsers[i].value;

	        			lastAnsweredUsers[i].value = myMsg;
	        			var newMsg = myMsg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll("ç","c");

	        			var elementoClick = $(this).find("."+userContainerClick)[0];
	        			triggerMouseEvent(elementoClick, "mousedown");

						var inputField = document.getElementsByClassName(caixaTexto)[0];
						
	        			if(inputField != undefined){

							var answer = getAnswer(newMsg.toLowerCase(), myTitle.toLowerCase(), lastAnswer.toLowerCase())

							if(answer != null){
								lastAnsweredUsers[i].value = sendMsg(answer, sendButton);
							}
							
							return;
						}
						else{
	        				console.log("search field not found, aborting!");
	        			}

	        		}
	        	}
	    	}
	    }
	    else{
	    	console.log("fail to find class title/msg");
	    }

    });

}

function triggerMouseEvent(node, eventType) {
    var event = document.createEvent('MouseEvents');
	event.initEvent(eventType, true, true);
	
	console.log('simulando click',node, eventType)
	try {
		node.dispatchEvent(event);
	}catch (e) {
		console.log('> Simulating Click Error: User Class Container not Found.',e)
	}
	
}

function setExtensionId(){
	var isConnectedId = $("#isExtensionConnected");

	if(isConnectedId != null){
		var myToken = chrome.runtime.id;

		document.cookie = "extensionID="+myToken;
		isConnectedId.text("Success in connecting to: "+myToken);
		$("#btnSend").removeClass("hide");
	}
	
}

function sendMsg(msg, sendButton){
	// this block will fire in future because wp can take some tome to download page content
	setTimeout(function() { sendMsgDelay(msg, sendButton); }, 1500);
	return msg.replaceAll("*","");
}
$(this).find('.'+userTitle)
function sendMsgDelay(msg, sendButton){
	var event = new Event('input', {bubbles: true});
	var textbox =  $('.'+containerCaixaDeTexto).find('.'+caixaTexto) //document.getElementsByClassName(caixaTexto);
	console.log(textbox)
	textbox[0].textContent = msg;
	textbox[0].dispatchEvent(event);
	var sendbox = document.getElementsByClassName(sendButton);
	sendbox[0].click();
	console.log("message sent!");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}