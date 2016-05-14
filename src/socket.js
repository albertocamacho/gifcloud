var io; //our socket.io server (passed in from the app)
var users = {};

var SC_Suggestions = [''];
var Giphy_Suggestions = [''];


function suggestion(votes, name){
    this.votes = votes;
    this.name = name;
}


var configureSockets = function(socketio) {
	io = socketio; 

    testSuggestion = new suggestion(0, 'test');

    Giphy_Suggestions.push(testSuggestion);
	
    //on new socket connections
    //new socket connection is passed in
    io.sockets.on('connection', function(socket) { 

        socket.join('livefeed');

        socket.emit('Giphy_Suggestion_toClient', JSON.stringify(Giphy_Suggestions));

        socket.on('SC_Suggestion_toServer', function(data){

          // SC_Suggestions.push(suggestion);

         //  socket.emit('SC_Suggestion_toClient', JSON.stringify(SC_Suggestions));
        });

        socket.on('Giphy_Suggestion_toServer', function(data){
           var votes = data.votes;
           var name = data.suggestion;
           
           console.log(votes);
          // var suggestion = new suggestion(data.votes, data.suggestion);
           //Giphy_Suggestions.push(suggestion);

          //socket.emit('Giphy_Suggestion_toClient', JSON.stringify(Giphy_Suggestions));
        });
   

        /*

        //join them all into the same socket room
        //at least for the purpose of this demo
        
        //when we receive a stream message (presumably from the person streaming only)
        //we didn't add any logic in, we are just assuming stream messages only come from the streamer
        //This will cause weird behavior if multiple try to stream
        socket.on('stream', function(buffer) {
            //broadcast the video frame to everyone else (except the streamer) 
            socket.broadcast.to('livefeed').emit("stream", buffer);
        });
        
        */

        //when the client disconnects from the server
        socket.on('disconnect', function(data){
            //remove them from the 'livefeed' room
            socket.leave('livefeed'); 
        });

    });
};

//export our public function
module.exports.configureSockets = configureSockets;