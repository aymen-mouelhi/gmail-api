var request = require('request');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var gmail = google.gmail('v1');

var Gmail = function(auth, credentials) {
    if (!auth) {
        throw new Error('Authentication Object is required');
    }

    this.auth = auth;
}


// Messages Management
Gmail.prototype.getMessage = function(messageId, callback) {
    // Retrun content, sender, subject, recieved on, id, snippet, attachments
    if (messageId) {
        gmail.users.messages.get({
            auth: auth,
            userId: 'me',
            id: messageId
        }, function(error, message) {
            if (error) {
                callback(error);
            } else {
                _formatMessage(message, callback);
            }
        });
    } else {
    	callback('Message Id cannot be empty');
    }
};


Gmail.prototype.getMessageAttachements = function(messageId, callback) {
    // Retrun content, sender, subject, recieved on, id, snippet, attachments
};

Gmail.prototype.getMessages = function(limit, fields, callback) {

    var self = this;
    var messages = [];

    limit = limit || 100;

    // Get All messages
    gmail.users.messages.list({
        auth: auth,
        userId: 'me',
        q: 'is:unread',
        maxResults: limit
    }, function(error, messages) {
        if (error) {
            callback(error);
        } else {
            async.eachSeries(messages, function(message, next) {
                // Get Message
                self.getMessage(message.id, function(error, gmailMessage) {
                    if (error) {
                        next(error);
                    } else {
                        messages.push(gmailMessage);
                        next();
                    }
                });
            }, function(error) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, messages);
                }
            });
        }
    });
};

Gmail.prototype.getThreads = function(id, callback) {

};

Gmail.prototype.send = function(payload, callback) {

};

// Draft Management

Gmail.prototype.createDraft = function(payload, callback) {

};

// Labels Management


// Users Management

// Private handlers
Gmail.prototype._createEmail = function(payload, callback) {

};
