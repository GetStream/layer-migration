var LayerAPI = require('layer-api');


var layer = new LayerAPI({
  token: '2vsm4yLCG24Y44IfSK6w8nBIxAgrVcU20zuPJ3fO8eXXv5Ub',
  appId: 'layer:///apps/staging/1dab157e-4d19-11e6-bb33-493b000000b4'
});

// Create a Conversation
layer.conversations.create({participants: ['abcd']}, function(err, res) {
  var cid = res.body.id;

  // Send a Message
  layer.messages.sendTextFromUser(cid, 'abcd', 'Hello, World!', function(err, res) {
    console.log(err || res.body);
  });
});
