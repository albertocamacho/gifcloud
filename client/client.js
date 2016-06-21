"use strict";

function init () {

    var audio = document.getElementById('player');
    var initialized = false;

    var GIPHY_API_KEY = "dc6zaTOxFJmzC";
    var GIPHY_API_URL_SEARCH = "https://api.giphy.com/v1/gifs/search?";
    var gifs = [];

    var canvas = document.getElementById('viewport');
    var context = canvas.getContext('2d');  

    var socket = io.connect(); 
    var SC = new SoundCloud();

    var dancer = new Dancer();
    var kick = dancer.createKick({
        onKick:function(mag){
            setRandomBackground();
        }
    });
    kick.on();


    socket.on('connect', function(){
        SC.setSC('Miike Snow');

        //dancer.js methods
        dancer.load(audio);
        if(dancer.isLoaded){
            dancer.play();
        }
    });


/*
    socket.on('UserCount_toClient', function(data){
        console.log(data.count);
        document.getElementById('user-count').innerHTML = data.count;
    });

    */

    socket.on('Update_toClient', function(data){
        getGiphy(data.gif);
        SC.setSC(data.sc);

        dancer.audio.src = audio.src;
        dancer.source.src = audio.src;

        if(initialized == false){
            $('.menu-initial').toggle(function(){
                $('.menu-primary').toggle(function(){
                   initialized = true;
               });
            });
        }
    });


    function createSuggestionElement(suggestion, votes, event){
        var li = document.createElement('li');

        li.addEventListener("click", event);
        $(li).addClass('pure-menu-item');
        $(li).addClass('sc-suggestion');
        $(li).addClass('pure-menu-link');
        $(li).append('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ');
        $(li).append('<span class = "sc-suggestion-vote">' + votes + '</span');
        $(li).append('<span class = "sc-suggestion-content"> ' + suggestion + ' </span>');

        document.getElementById('sc-suggestion-list').appendChild(li);
    }




    socket.on('SC_Suggestion_toClient', function(suggestionsString){

        $('#sc-suggestion-list').empty();
        var suggestionsObj = $.parseJSON(suggestionsString); 
        var suggestions =  $.map(suggestionsObj, function(el) { return el; });

        for(var i = 0; i < suggestions.length; i++){
            createSuggestionElement(suggestions[i].name, suggestions[i].votes, sendSCSuggestion);
        }

        var li = document.createElement('li');

        li.addEventListener('keypress', function(e){
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13'){
                var s = document.getElementById('sc-suggestion-input').value;
                socket.emit('New_SC_Suggestion_toServer', { suggestion: s, votes: 1 } ); 
                return false;
            }
        }, false);

        $(li).addClass('pure-menu-item');
        $(li).addClass('menu-input-item');

        $(li).append('<input class="menu-input" id = "sc-suggestion-input" type="text" placeholder="suggest">');
        document.getElementById('sc-suggestion-list').appendChild(li);
        
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
            li.addEventListener("click", sendGiphySuggestion);

            $(li).addClass('pure-menu-item');
            $(li).addClass('gif-suggestion');
            $(li).addClass('pure-menu-link');


            
            $(li).append('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ');
            $(li).append('<span class = "gif-suggestion-vote">' + votes + '</span');
            $(li).append('<span class = "gif-suggestion-content"> ' + suggestion + ' </span>');

            document.getElementById('gif-suggestion-list').appendChild(li);
        }

        var li = document.createElement('li');


        li.addEventListener('keypress', function(e){
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13'){
                var s = document.getElementById('gif-suggestion-input').value;
                socket.emit('New_Giphy_Suggestion_toServer', { suggestion: s, votes: 1 } ); 
                return false;
            }
        }, false);

        $(li).addClass('pure-menu-item');

        $(li).append('<input class="menu-input" id = "gif-suggestion-input" type="text" placeholder="suggest">');
        document.getElementById('gif-suggestion-list').appendChild(li);
    }); 


    function sendGiphySuggestion(){
      console.log(this);
      
      var suggestion_votes = $(this).find('.gif-suggestion-vote').html();
      suggestion_votes = parseInt(suggestion_votes);

      var suggestion_name = $(this).find('.gif-suggestion-content').html();

      suggestion_name = suggestion_name.slice(1, -1);
      socket.emit('Giphy_Suggestion_toServer', { suggestion: suggestion_name, votes: suggestion_votes }); 
  }


  function sendSCSuggestion(){
    console.log(this);

    var suggestion_votes = $(this).find('.sc-suggestion-vote').html();
    suggestion_votes = parseInt(suggestion_votes);

    var suggestion_name = $(this).find('.sc-suggestion-content').text();

    suggestion_name = suggestion_name.slice(1, -1);

    socket.emit('SC_Suggestion_toServer', { suggestion: suggestion_name, votes: suggestion_votes } );
}



function getGiphy(gifTopic){

    gifTopic = gifTopic.split(' ').join('+');
    var url = GIPHY_API_URL_SEARCH + 'q=' + gifTopic + '&api_key=' + GIPHY_API_KEY;
    //set the menu label to current gif topic
    document.getElementById('gif-suggestion-current').innerHTML = gifTopic;
    //reset array of gifs
    gifs = [];
    //get the gifs from giphy based on the giftopic search
    $.getJSON(url, function( data ) {
        $.each( data.data, function( i , item ) {
            if(item.images.downsized.url){
                var url = item.images.downsized.url;
                var new_image = new Image();
                new_image.src = url;
                gifs.push(new_image);
            }
        });
    });

}


function setRandomBackground(){
    var randomIndex = Math.floor((Math.random() * gifs.length) + 1);
    console.log(randomIndex);
    $('body').css('background-image', 'url(' + gifs[randomIndex].src + ')');
}

}

window.onload = init;