"use strict";

function init () {

    //connect to socket.io
    //remember the io library was imported as socket.io
    var socket = io.connect(); 
    
    //when the stream connects, start streaming our video to the server
    socket.on('connect', function(){
    	console.log('connected bitch');
    });



    socket.on('SC_Suggestion_toClient', function(suggestionsString){

    	$('#SC_suggestions').empty();
    	var suggestionsObj = $.parseJSON(suggestionsString); 
    	var suggestions = $.map(suggestionsObj, function(el) { return el; });

    	for(var i = 1; i < suggestions.length; i++){
    		var suggestion = suggestions[i];
    		var p = document.createElement('p');
    		p.innerHTML = suggestion;
    		document.getElementById('SC_suggestions').appendChild(p);
    	}

    });


    socket.on('Giphy_Suggestion_toClient', function(suggestionsString){


        $('#gif-suggestion-list').empty();
        var suggestionsObj = $.parseJSON(suggestionsString); 
        var suggestions =  $.map(suggestionsObj, function(el) { return el; });

        for(var i = 0; i < suggestions.length; i++){
            var suggestion = suggestions[i].name;
            var votes = suggestions[i].votes;
            var li = document.createElement('li');
            li.addEventListener("click", sendGiphySuggestion)

            $(li).addClass('pure-menu-item');
            $(li).addClass('gif-suggestion');

            $(li).append('<span class = "gif-suggestion-vote">' + votes + '</span');
            $(li).append('<span class = "gif-suggestion-content"> ' + suggestion + ' </span>');


            document.getElementById('gif-suggestion-list').appendChild(li);
        }



    }); 

    function sendGiphySuggestion(){
        //console.log(this);
        var suggestion_votes = $(this).find('.gif-suggestion-vote').html();
        suggestion_votes = parseInt(suggestion_votes);
        suggestion_votes++;

        var suggestion_name = $(this).find('.gif-suggestion-content').html();
        socket.emit('Giphy_Suggestion_toServer', { suggestion: suggestion_name, votes: suggestion_votes } );

        console.log('suggestion_name : ' + suggestion_name + ' suggestion_votes: ' + suggestion_votes);
      
    }


    $( "#SC_suggestions_submit" ).click(function() {
        var suggestion_votes = $(this).find('.gif-suggestion-vote').html();
        suggestion_votes += 1;
    	var suggestion = $('#SC_suggestions_input').val();
    	socket.emit('SC_Suggestion_toServer', { suggestion: suggestion, votes: suggestion_votes});
    });






}

window.onload = init;