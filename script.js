const video = document.getElementById('video') // video tag

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // model for face detect
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // model for detecting differnet parts of face
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // model for detecting where the face is
  faceapi.nets.faceExpressionNet.loadFromUri('/models') // model for detect expressions
]).then(startVideo)

// functiont to hook up webcam to video element
function startVideo() {
  navigator.getUserMedia(
    {video : {}},
    stream => video.srcObject = stream,
    err => console.error(err)
    
  )
}

video.addEventListener('play', () => {
  setInterval( async () =>{
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
      .withFaceExpressions()
      console.log(detections)
   }, 100 // acync function

  ) // can use multiple times

}
)// what to do when video starts playing