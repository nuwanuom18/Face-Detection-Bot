let predictedThirtyAges = [];

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // model for face detect
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // model for detecting differnet parts of face
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // model for detecting where the face is
  faceapi.nets.faceExpressionNet.loadFromUri('/models'), // model for detect expressions
  faceapi.nets.ageGenderNet.loadFromUri('/models') // model for detect expressions
])

//const btn1 = document.createElement('BUTTON')
//btn1.innerText = 'Hello'

var ispressed1 = false;

var ispressed2 = false;


var ispressed3 = false;


var ispressed4 = false;


//div.appendChild(btn1)


if (navigator.getUserMedia) {
   navigator.getUserMedia({  video: { } },
      function(stream) {
         var video = document.getElementById('video');
         video.srcObject = stream;
         video.onloadedmetadata = function(e) {


            var ele = document.getElementById('overlayv')
         var canvas = document.getElementById('canvas')
           canvas = faceapi.createCanvasFromMedia(video) // to add things to the webcam video
           
           document.body.append(canvas)
           //ele.appendChild(canvas);


           const displaySize = { width: video.width, height:video.height}
           faceapi.matchDimensions(canvas , displaySize)// match canvas to display size
           setInterval( async () =>{
             const detections = await faceapi.detectAllFaces(video,
               new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
               .withFaceExpressions().withAgeAndGender()
               //console.log(detections)
               const resizedDetections = faceapi.resizeResults(detections, displaySize);
               canvas.getContext('2d').clearRect(0, 0, canvas.width , canvas.height) // to clear previous rect
               

               
               var btn1 = document.getElementById('btn1')
               btn1.addEventListener('click' , ()=> {
                  if(ispressed1){
                     ispressed1 = false;
                     btn1.innerText = "Draw face Detections"
                  }else{
                     ispressed1 = true;
                     btn1.innerText = "Clear face Detections"
                  }
               })

               var btn2 = document.getElementById('btn2')
               btn2.addEventListener('click' , ()=> {
                  if(ispressed2){
                     ispressed2 = false;
                     btn2.innerText = "Draw Face Landmarks"
                  }else{
                     ispressed2 = true;
                     btn2.innerText = "Clear Face Landmarks"
                  }
               })

               var btn3 = document.getElementById('btn3')
               btn3.addEventListener('click' , ()=> {
                  if(ispressed3){
                     ispressed3 = false;
                     btn3.innerText = "Draw Expressions"
                  }else{
                     ispressed3 = true;
                     btn3.innerText = "Clear Expressions"
                  }
               })

               var btn4 = document.getElementById('btn4')
               btn4.addEventListener('click' , ()=> {
                  if(ispressed4){
                     ispressed4 = false;
                     btn4.innerText = "Draw Age"
                  }else{
                     ispressed4 = true;
                     btn4.innerText = "Clear Age"
                  }
               })

               if(ispressed1){
                  faceapi.draw.drawDetections(canvas , resizedDetections) // to drow the canvas and resize
               }
               
               if(ispressed2){
                  faceapi.draw.drawFaceLandmarks( canvas , resizedDetections)
               }

               if(ispressed3){
                  faceapi.draw.drawFaceExpressions(canvas , resizedDetections)
               }
               
               // now add age to the canvas
               console.log(typeof resizedDetections[0]);
               if (typeof resizedDetections[0] != 'undefined'){
                  age = resizedDetections[0].age;
                  
               const age_mean = Math.round(mean_of_ages(age));
               const bottomRight= {
                  x: resizedDetections[0].detection.box.bottomRight.x -50,
                  y: resizedDetections[0].detection.box.bottomRight.y
   
               }
               
               if(ispressed4){
                  new faceapi.draw.DrawTextField(
                     [`${age_mean} years`],
                     bottomRight
                  ).draw(canvas)
                  }
               }

               
               
            }, 100 // acync function
         
           ) // can use multiple times
         };
      },
      function(err) {
         //console.log("The following error occurred: " + err.name);
      }
   );
} else {
   //console.log("getUserMedia not supported");
}

function mean_of_ages(age){
   predictedThirtyAges = [age].concat(predictedThirtyAges).slice(0 ,30)
   const mean = 
   predictedThirtyAges.reduce((total , a) => total+a)/ predictedThirtyAges.length;
   return mean;
}

// add these functions to animate buttons

var animateButton = function(e) {

   e.preventDefault;
   //reset animation
   e.target.classList.remove('animate');
   
   e.target.classList.add('animate');
   setTimeout(function(){
     e.target.classList.remove('animate');
   },700);
 };
 
 var bubblyButtons = document.getElementsByClassName("bubbly-button");
 
 for (var i = 0; i < bubblyButtons.length; i++) {
   bubblyButtons[i].addEventListener('click', animateButton, false);
 }

 // styles for h1

