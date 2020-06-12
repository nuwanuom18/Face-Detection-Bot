navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // model for face detect
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // model for detecting differnet parts of face
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // model for detecting where the face is
  faceapi.nets.faceExpressionNet.loadFromUri('/models') // model for detect expressions
])
if (navigator.getUserMedia) {
   navigator.getUserMedia({  video: { } },
      function(stream) {
         var video = document.querySelector('video');
         video.srcObject = stream;
         video.onloadedmetadata = function(e) {
           
           const canvas = faceapi.createCanvasFromMedia(video) // to add things to the webcam video
           document.body.append(canvas)
           const displaySize = { width: video.width, height:video.height}
           faceapi.matchDimensions(canvas , displaySize)// match canvas to display size
           setInterval( async () =>{
             const detections = await faceapi.detectAllFaces(video,
               new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
               .withFaceExpressions()
               console.log(detections)
               const resizedDetections = faceapi.resizeResults(detections, displaySize)
               canvas.getContext('2d').clearRect(0, 0, canvas.width , canvas.height) // to clear previous rect
               faceapi.draw.drawDetections(canvas , resizedDetections) // to drow the canvas and resize
               faceapi.draw.drawFaceLandmarks( canvas , resizedDetections)
               faceapi.draw.drawFaceExpressions(canvas , resizedDetections)
               
            }, 100 // acync function
         
           ) // can use multiple times
         };
      },
      function(err) {
         console.log("The following error occurred: " + err.name);
      }
   );
} else {
   console.log("getUserMedia not supported");
}