var io; //our socket.io server (passed in from the app)
var users = [];

var SC_Suggestions = [];
var Giphy_Suggestions = [];



setInterval(function(){
  //findTopSuggestions();
}, 5000);   



function suggestion(votes, name){
  this.votes = votes;
  this.name = name;
}

function findSuggestion(){
  return suggestion.name === 'test';
}


function findTopSuggestions(){
  var topGif = Giphy_Suggestions[0];
  var topSC = SC_Suggestions[0];

  for(var i = 1; i < SC_Suggestions.length; i++){
      if(SC_Suggestions[i].votes > topSC.votes){
        topSC = SC_Suggestions[i];
      }
  }

  for(var i = 1; i < Giphy_Suggestions.length; i++){
      if(Giphy_Suggestions[i].votes > topGif.votes){
        topGif = Giphy_Suggestions[i];
      }
  }

  console.log('top gif: ' + topGif.name + ' top sc: ' + topSC.name);
}

var configureSockets = function(socketio) {
	io = socketio; 


  testSuggestion = new suggestion(5, 'Robots');
  testSuggestionTwo = new suggestion(7, 'Cats');

  testSuggestionThree = new suggestion(3,'Janet Jackson');
  testSuggestionFour = new suggestion(9, 'Fallout Boy')

  Giphy_Suggestions.push(testSuggestion);
  Giphy_Suggestions.push(testSuggestionTwo);

  SC_Suggestions.push(testSuggestionThree);
  SC_Suggestions.push(testSuggestionFour);



  io.sockets.on('connection', function(socket) { 

    users[socket.name] = socket.name;

    socket.join('livefeed');

    socket.emit('UserCount_toClient', { count: users.length });
    socket.emit('Giphy_Suggestion_toClient', JSON.stringify(Giphy_Suggestions));
    socket.emit('SC_Suggestion_toClient', JSON.stringify(SC_Suggestions));

    socket.on('SC_Suggestion_toServer', function(data){
      for(var i = 0; i < SC_Suggestions.length; i++){
        if(SC_Suggestions[i].name == data.suggestion){
          SC_Suggestions[i].votes++;
          break;
        }
      }

      socket.emit('SC_Suggestion_toClient', JSON.stringify(SC_Suggestions));
    });

    socket.on('Giphy_Suggestion_toServer', function(data){
      
      console.log(data);
      for(var i = 0; i < Giphy_Suggestions.length; i++){
        if(Giphy_Suggestions[i].name == data.suggestion){
          console.log(Giphy_Suggestions[i]);
          Giphy_Suggestions[i].votes++;
          break;
        }
      }
      
      socket.emit('Giphy_Suggestion_toClient', JSON.stringify(Giphy_Suggestions));
    });

    socket.on('disconnect', function(data){
      socket.leave('livefeed'); 
      delete users[socket.name];
    });

  });
};

//export our public function
module.exports.configureSockets = configureSockets;