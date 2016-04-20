var request = require('request');

var Gmail = function(key) {
    if (!key) {
        throw new Error('Access key required');
    }
    this.key = key
}

Gmail.prototype.getMessage =function(id, callback){
	// Retrun content, sender, recieved on, id, snippet, attachments
};

Gmail.prototype.getMessages =function(limit, fields, callback){

};

Gmail.prototype.getThreads =function(id, callback){

};