import React, {useEffect, useRef} from 'react';
//import logo from './logo.svg';
import './App.css';

// Importing the tensorflow.js library
import * as tf from "@tensorflow/tfjs"

// Import the libraries. copied from github
// 근데 이 코드 긁어오기만 하면 error발생. https://google.github.io/mediapipe/getting_started/javascript 에서 npm install @mediapipe/face_mesh 해줘야함
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/face_mesh';

//얼굴 윤곽 마스크 씌우기
import { drawMesh } from "./utilities";

//얼굴 이미지 가져오기
import image from './images/image.jpg';



function App() {
  const canvasRef = useRef(null);
  //const [faceData, setFaceData] = useState([]);

  //  Load posenet
  const runFacemesh = async () => {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: 'tfjs',
      refineLandmarks: true,
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'
    };
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    detect(detector);
  };

  const detect = async (detector) => {
    // Get Image Properties
    const HTMLImageElement = document.getElementById("face");
    const input_tensor = tf.browser.fromPixels(HTMLImageElement);
      //console.log('input_tensor' + input_tensor); //문제없음
    const ImageElementWidth = HTMLImageElement.width;
    const ImageElementHeight = HTMLImageElement.height;

    // Set canvas width -> 이거 필수인가?
    console.log("This picture's width is "+HTMLImageElement.width+", and height is "+HTMLImageElement.height);
    console.log(HTMLImageElement);
    canvasRef.current.width = ImageElementWidth;
    canvasRef.current.height = ImageElementHeight;
      //console.log("canvasRef is " + canvasRef.current);
    
    const estimationConfig = {flipHorizontal: false};
    const facedata = await detector.estimateFaces(input_tensor, estimationConfig);
      //console.log(facedata[0].keypoints);

    // Get canvas context
    const ctx = canvasRef.current.getContext("2d");
      //console.log('ctx' + ctx); //문제없음
    requestAnimationFrame(()=>{drawMesh(facedata[0].keypoints, ctx)}); //facedata나 ctx에서 들어가야할 데이터가 없어서 오류가 나는건데...
  };
  
  useEffect(()=>{runFacemesh()});

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img 
          id='face' 
          src={image} 
          crossOrigin='anonymous' 
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            maxWidth: 640,
            maxHeight: 480
          }}
          />
          <canvas
          ref={canvasRef}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            maxWidth: 640,
            maxHeight: 480
          }}
        />
        </div>
      </header>
    </div>
  );
}

export default App;