//VERSION 1.2
//Update to new sentence display semantics -- leave words in sentence on line as displayed
//Update to use SocketIO
//Update to use sqlite3 database transactions
//statics

var taskName = "spr_frank" //this variable is used to set the task name that will be sent allong with the data set object to the local storage in the browser

var trainSents = [{"sent":"Space, space, space, press space to read the words.", "question":"", "answer":""}, {"sent":"Ok, we are about to begin the task.","question":"Are you ready?", "answer":"y"}]

var sents = []; //array of sentence strings to be used in a given phase
var sent = 0 //the index of the current sentence in sents
var words =[] //array of word strings from the current sentence
var word = [] //the string of the current word on display
var position = 0 //the index of the word in the words array
var xpos; //holds x position value for current text shape
var ypos; //holds y position value for current text shape
var text; //hold the text shape object (CreateJS)
var mode = "r"; //holds flag for various modes, 'q' for question, 'r' for reading. These modes are used to determine how various key presses are handled.
var train = 2; //flage to handle various stages of the training phase. 1 is to flag for populating sents with trainSents, 2 flags ready state of the trianing, and 0 flags the completion

var fontInfo = "15px Times" //specify font info for all text shapes (CreateJS)

var startTime; //holds the initial time after a word is displayed
var readTime; //holds the time when space was pushed, i.e. the end of reading time
var RT; //the reaction time, i.e. the difference of startTime and readTime
var dataSet = []; //holds the data objects for each data point
var answer; //the correct answer to the question to be asked, if question was given
var corr; //a flag for the veracity of the users respons to the question, 1 is for correct and 0 is for incorrect
var resp; //the response pushed by the user to answer the question

var short_sents = []

var par_tab = 20
var par_begin = 30
var par_top = 30
var par_newline = 30
var canvas_end

//logic EXTENSIONS

//this implements the Fisher-Yates shuffle algoritm

function randomize(array){
    var i = array.length, j, temp;
    while ( --i ){
        j = Math.floor( Math.random() * (i - 1) );
        temp = array[i]
        array[i] = array[j]
        array[j] = temp;
    }
}

//Array.prototype.randomize = function(){
//    var i = this.length, j, temp;
//    while ( --i ){
//        j = Math.floor( Math.random() * (i - 1) );
//        temp = this[i];
//        this[i] = this[j];
//        this[j] = temp;
//    }
//}

//this function returns a timestamp using the more accurate performance.now method, name is short for get milliseconds
function getMS() {
    time = performance.now() //new Date().getTime()
    return time
}

//logic

document.addEventListener("keydown", handle_key) //add listener for key events, here keydown, and then register a function to execute on each keydown, here handle_key

//the following function handles key presses based on the keyCode of the pressed key, and also if we are in the answering question mode 'q' or in the self paced reading mode 'r'
//the data set variables are also set here, i.e. each key press trigers a response point to which RTs and other variables can be calculated
function handle_key(e){
    if(mode == "r"){
        if(e.keyCode == 32){
            readTime = getMS();
            RT = readTime - startTime;
            dataSet.push({"train":train, "sent_num":sent+1, "word_num":position+1, "word": word, "RT": RT, "sentence":sents[sent].sent, 'corr':corr});
            nextWord();
        }
    }


    if(mode == "q"){
        if(e.keyCode == 89){
            readTime = getMS();
            RT = readTime - startTime;
            resp = "y";
            evalQuestion()
            dataSet.push({"train":train, "sent_num":sent+1, "word_num":"q", "word":"NA", "RT": RT, "sentence":sents[sent].question, 'corr':corr})
            sent += 1;
            position = 0;
            stage.removeChild(text)
            mode = "r";
            handleSent();
        }

        if(e.keyCode == 78){
            readTime = getMS();
            RT = readTime - startTime;
            resp = "n";
            evalQuestion();
            dataSet.push({"train":train, "sent_num":sent+1, "word_num":"q", "word":"NA", "RT": RT, "sentence":sents[sent].question, 'corr':corr})
            sent += 1;
            position = 0;
            stage.removeChild(text);
            mode = "r";
            handleSent();
        }
    }
}

//this function grabs the canvas and is executed on pageload from the index.html file
function init(){
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    ypos = par_top;
    canvas_end = canvas.width
    preload();
}

//this function uses CreateJS module PreloadJS to handle file loading
function preload(){
    var manifest = [
    {src: "assets/text.txt", id: "txt"},
    ];

    q = new createjs.LoadQueue(true);
    q.on("complete", loadComplete);
    q.loadManifest(manifest);
}

//function to be executed on the completion of all items to be preloaded
function loadComplete(){
  var raw_text = q.getResult("txt")
  raw_text = raw_text.split("\n")
  var i = 0
  while (i < raw_text.length - 1) {
    short_sents.push( {"sent":raw_text[i], "question":"", "answer":""} )
    i += 1
  }  
    handleSent();
}

//this functions processes each new sentence in the sents array. It handles the training vs non training flags, and also checks for end of task events. If a normal task sentence, it resets various data variables, clears the screen, and parses the sentence into words for the subsequent nextWord events.
function handleSent(){
    if ( train != 0) {
      stage.removeAllChildren()
    }
    mode = 'f'
    stage.update()
    if(train==2) {sents = trainSents; train = 1; handleSent()}
    else if (sent == sents.length && train == 1) {train=0; genSents();}
    else if (sent == sents.length && train == 0) {postData();}
    else{
    words = sents[sent].sent.split(" ");
    answer = sents[sent].answer;
    word = words[position];
    corr = 2;
    xpos = par_begin + par_tab;
    ypos += par_newline
    if (ypos + 30 > canvas.height) {
      stage.removeAllChildren()
      ypos = par_top
    }

    text = new createjs.Text(word, fontInfo);
    text.x = xpos;
    text.y = ypos;
    stage.addChild(text);
    stage.update();
    startTime = getMS();

    mode = 'r'
    } 
}

//this function processes each word to be displayed after the first in the sentece
function nextWord(){
    //stage.removeChild(text);

    position +=1;

    if (position == words.length) {
        if (sents[sent].question != ""){
            handleQuestion();
        }

        else {
            sent += 1;
            position = 0;
            handleSent();
        }
    }

    else {
      
    xpos += Math.floor(text.getBounds().width) + 5;
    console.log(xpos)
    word = words[position];

    text = new createjs.Text(word, fontInfo);
    
    if ( (xpos + Math.floor(text.getBounds().width)+ 20 ) > canvas_end) {
      xpos = par_begin
      ypos += par_newline
      text.x = xpos
      text.y = ypos
    }
    
    else {
      text.x = xpos;
      text.y = ypos;
    }
    
    if ( (text.y + 20) > canvas.height) {
      stage.removeAllChildren()
      text.y = par_top
    }
    
    stage.addChild(text);
    stage.update();
    startTime = getMS()
    }
}

//if a question if present, this function handles mode flagging to block spacebar responses and displays the question and prepares answer variables
function handleQuestion(){
    stage.removeAllChildren()
    mode = "q"
    words = sents[sent].question
    text = new createjs.Text(words+"\n\n\ny or n", fontInfo);

    xpos = 350;
    text.x = xpos;
    text.y = ypos;

    stage.addChild(text);
    stage.update();
    startTime = getMS()
}

//function to process the question response as correct or not
function evalQuestion(){
    if(answer == resp){
        corr = 1;
    }

    else {
        corr = 0;
    }
}

//function to populate sents array with items from the sents.json file in the assets folder
function genSents(){
    sents = short_sents;
    sent = 0;
    handleSent();
}

// this function will hand the processing of the dataSet array upon completion of the task, in this case posting it to local storage in window.localStorage.NTUdataLEAP for furher processing
function postData(){
    stage.removeAllChildren()
    stage.update();
    finalData = {subject_id: localStorage.LEAP_subject_id, data: dataSet}
    socket.emit('writeSPRShortData', finalData, function(responded){
      console.log("Data Saved");
    })
    stage.removeChild(text);
    text = new createjs.Text("Thank you for your time, this reading task is complete. Please return to the task selection screen to finish any remaining tasks.",fontInfo)
    text.x = 10
    text.y = ypos
    stage.addChild(text);
    stage.update();
}
