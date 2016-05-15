"use strict";


function init () {

    //connect to socket.io
    //remember the io library was imported as socket.io
    var socket = io.connect(); 
    var GIPHY_API_KEY = "dc6zaTOxFJmzC";
    var gifs = [];
    var SC = new SoundCloud();

    
    //when the stream connects, start streaming our video to the server
    socket.on('connect', function(){

      
    	console.log('connected');

        getGiphy('cats');
        SC.setSC('Janet Jackso');
       

    });

    socket.on('UserCount_toClient', function(data){
        console.log(data.count);
        //set user count in client.html
    });


    socket.on('SC_Suggestion_toClient', function(suggestionsString){

        $('#sc-suggestion-list').empty();
        var suggestionsObj = $.parseJSON(suggestionsString); 
        var suggestions =  $.map(suggestionsObj, function(el) { return el; });

        for(var i = 0; i < suggestions.length; i++){

            var suggestion = suggestions[i].name;
            var votes = suggestions[i].votes;
            var li = document.createElement('li');
            li.addEventListener("click", sendSCSuggestion)

            $(li).addClass('pure-menu-item');
            $(li).addClass('sc-suggestion');

            $(li).append('<span class = "sc-suggestion-vote">' + votes + '</span');
            $(li).append('<span class = "sc-suggestion-content"> ' + suggestion + ' </span>');

            document.getElementById('sc-suggestion-list').appendChild(li);
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

            //console.log('name : ' + sug + ' votes: ' + votes);
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

        setBackground();
        var suggestion_votes = $(this).find('.gif-suggestion-vote').html();
        suggestion_votes = parseInt(suggestion_votes);

        var suggestion_name = $(this).find('.gif-suggestion-content').html();

        //suggestion_name = suggestion_name.replace(/\s+/g,'');
        suggestion_name = suggestion_name.slice(1, -1)
        socket.emit('Giphy_Suggestion_toServer', { suggestion: suggestion_name, votes: suggestion_votes } );
    }


    function sendSCSuggestion(){
        var suggestion_votes = $(this).find('.sc-suggestion-vote').html();
        suggestion_votes = parseInt(suggestion_votes);

        var suggestion_name = $(this).find('.sc-suggestion-content').text();

        suggestion_name = suggestion_name.slice(1, -1)
        //var suggestion_name = suggestion_name.replace(/\s+/g,'');
        //suggestion_name = suggestion_name.substr(0);
        socket.emit('SC_Suggestion_toServer', { suggestion: suggestion_name, votes: suggestion_votes } );
    }



    function getGiphy(gifTopic){
        gifs = []; 
        var api_url = "https://api.giphy.com/v1/gifs/search?"
        var searchQuery = gifTopic;
        var queryStripped = searchQuery.split(' ').join('+');
        var url = api_url + 'q=' + queryStripped + '&api_key=' + GIPHY_API_KEY;

        $.getJSON(url, function( data ) {
            $.each( data.data, function( i , item ) {
                var url = item.images.downsized.url;
                console.log(url);
                gifs.push(url);


            });
        });        
    }

    function setBackground(){
        var rand = Math.floor((Math.random() * gifs.length) + 1);
        $('body').css('background-image', 'url(' + gifs[rand] + ')');

    }



}

window.onload = init;