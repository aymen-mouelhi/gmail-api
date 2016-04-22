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
    // Retrun content, from, subject, recieved on, id, snippet, attachments
    if (messageId) {
        gmail.users.messages.get({
            auth: auth,
            userId: 'me',
            id: messageId
        }, function(error, message) {
            if (error) {
                callback(error);
            } else {
                // Get message
                _formatMessage(message, callback);
            }
        });
    } else {
        callback('Message Id cannot be empty');
    }
};


Gmail.prototype.getMessageAttachements = function(messageId, callback) {
    // Retrun content, from, subject, recieved on, id, snippet, attachments
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


/**
 * Create an Email Object as Gmail wants it to be
 * @param  {[type]}   payload  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Gmail.prototype.createEmail = function(payload, callback) {
    var email_lines = [];
    email_lines.push("From: \"" + payload.from.name + "\" <" + payload.from.email + ">");
    email_lines.push("To: " + payload.to.email);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push("Subject: " + payload.subject);
    email_lines.push("");
    email_lines.push(payload.content);

    var email = email_lines.join("\r\n").trim();

    var base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    return base64EncodedEmail;
};


Gmail.prototype._formatMessage = function(message, callback) {
    
    var from;
    var subject;
    var date;
    var content;
    var to;
    var delivered_to;

    // Get Headers
    var headers = message.payload.headers;

    // Check message headers
    for (var j in headers) {
        if (headers[j].name.indexOf('to') > -1) {
            from = headers[j].value;
        } else if (headers[j].name.indexOf('Subject') > -1) {
            subject = headers[j].value;
        } else if (headers[j].name.indexOf('Date') > -1) {
            date = headers[j].value;
        } else if (headers[j].name === 'To' > -1) {
            to = headers[j].value;
        } else if (headers[j].name.indexOf('Delivered-To') > -1) {
            delivered_to = headers[j].value;
        }

        subject = subject || message.snippet;
    }


    var parts = message.payload.parts;

    if (!parts) {
        parts = headers.parts;
    }

    // Store snippet in content until we find better content
    content = message.snippet;

    // Check payloead parts
    if (message.payload.parts) {
        content = message.payload.parts[0].body.data;
        if (content) {
            content = new Buffer(content, 'base64').toString('utf8');
        }
    }

    // Check payload.data
    if (content === message.snippet) {
        if (message.payload.body) {
            content = message.payload.body.data;
            content = new Buffer(content, 'base64').toString('utf8');
        }
    }

    if (content == '') {
        content = message.snippet;
    }

    // Get from address
    from = from.substr(from.indexOf('<'), from.indexOf('>')).replace('<', '').replace('>', '');

    // Get Reciever
    to = to.substr(to.indexOf('<'), to.indexOf('>')).replace('<', '').replace('>', '');

    if (!to) {
        to = delivered_to;
    }

    // Todo: Get Attachements
    // Todo: Add name information in To / From
    var msg = {
        from: {
            name: ''
            email: from
        },
        to: {
            name: ''
            email: to
        },
        subject: subject,
        content: content,
        date: date
        snippet: message.snippet,
        attachements: []
    }

    callback(null, msg);
}
