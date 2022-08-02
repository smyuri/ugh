let dataServer;
let pubKey = "pub-c-6f13f86f-1373-45d0-8d30-ebbea8f73496";
let subKey = "sub-c-5c7c93ad-42b7-4af3-9cce-e78ea25ba5c2";
let secretKey = "sec-c-ZmZjMTE2NWEtNzE3OS00ZWUwLWFiOGMtN2NlNDlkZDRkYmIy";

let channelName = "history";
let imgOne;
let you;

//input variables for the form to PubNub
var sendText;
var sendButton;

let history;

function preload() { 
imgOne= loadImage("IMG_2606.PNG");
//imgOne.style.left= "200px";
  // logic to create a random UUID
    you = random(0,1000000); 
    console.log(you);
    you = int(you);
    console.log(you);
    you = you.toString();
  
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    dataServer = new PubNub({
      subscribeKey: subKey,
      publishKey: pubKey,
      uuid: you,
      secretKey: secretKey,
      heartbeatInterval: 0,
    });

     // listen for messages coming through the subcription feed on this specific channel. 

    dataServer.subscribe({ channels: [channelName] });
    dataServer.addListener({ message: readIncoming });
   
  
    textAlign(CENTER);
  
    //create the text fields for the message to be sent
    sendText = createInput();
    sendText.position((windowWidth/2) - 100, windowHeight *0.75);
  
    sendButton = createButton("SEND");
    sendButton.position(sendText.x + sendText.width, windowHeight * 0.75);
    sendButton.mousePressed(sendTheMessage);

    fetchMessages();

}
  
function draw() {
// background(0);
image(imgOne, -windowWidth/3 , , imgOne.width/4, imgOne.height/4)

}


function fetchMessages() {
console.log("fetching");

  dataServer.fetchMessages(
    {
        channels: [channelName],
        end: '15343325004275466',
        count: 100
    },
    (status, response) => {
    // console.log(response.channels.history);
      drawMessages(response.channels.history);
    }
  );
   
}

function drawMessages(messageHistory) {

  console.log("in draw messages");

  console.log(messageHistory);
  background(0);
  textSize(50);
  noStroke();
  fill(255,255,255);
  for (let i = 0; i < messageHistory.length; i++) {
    
      console.log(messageHistory[i]);
      //textY= 75 * (i+1) + 500;
      text(messageHistory[i].message.messageText, windowWidth/2, 75 * (i+1) + 500);
      //if textY > 800 {

      //}
  }

}
  // PubNub logic below
function sendTheMessage() {
  // Send Data to the server to draw it in all other canvases
  dataServer.publish({
    channel: channelName,
    message: {
      messageText: sendText.value()
    },
  });

  sendText.value("");

}

function readIncoming(inMessage) {
  console.log(inMessage);
  fetchMessages();

}
