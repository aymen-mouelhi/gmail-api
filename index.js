var request = require('request');

var Gmail = function(key) {
    if (!key) {
        throw new Error('Access key required');
    }
    this.key = key
}

// Messages Management

Gmail.prototype.getMessage = function(messageId, callback){
	// Retrun content, sender, subject, recieved on, id, snippet, attachments
};


Gmail.prototype.getMessageAttachements = function(messageId, callback){
	// Retrun content, sender, subject, recieved on, id, snippet, attachments
};

Gmail.prototype.getMessages = function(limit, fields, callback){

};

Gmail.prototype.getThreads = function(id, callback){

};

Gmail.prototype.send = function(payload, callback){

};

// Draft Management

Gmail.prototype.createDraft = function(payload, callback){

};

// Labels Management


// Users Management

// Private handlers
Gmail.prototype._createEmail = function(payload, callback){
	
};