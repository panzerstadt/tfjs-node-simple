var firebase = require("firebase/storage");
var firebase = require("firebase/app");
var execSync = require("child_process").execSync;
const videoIntelligence = require("@google-cloud/video-intelligence");
const https = require("https");
const fs = require("fs");

// 下記には Firebase のプロジェクトのトップページにある
// ウェブアプリに Firebase を追加をクリックすると表示される内容を入力
var config = {
  apiKey: "AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",
  authDomain: "operation-verde-ricecam.firebaseapp.com",
  databaseURL: "https://operation-verde-ricecam.firebaseio.com",
  projectId: "operation-verde-ricecam",
  storageBucket: "operation-verde-ricecam.appspot.com",
  messagingSenderId: "231640672051"
};

firebase.initializeApp(config);

//firebase の変更監視
const storage = firebase.storage();
const storageRef = storage.ref();
const videoRef = storageRef.child("videos/2019-04-21T17:43:42:518.mp4");

const SERVICE_ACCOUNT2 =
  "/Users/liqun_tang/Documents/_KEYS/GCLOUD/operation-verde-3f8883e93e35.json";
const SERVICE_ACCOUNT =
  "/Users/liqun_tang/Documents/_KEYS/GCLOUD/operation-verde-ricecam-27638101921d.json";

const run = async () => {
  // Imports the Google Cloud Video Intelligence library
  const videoIntelligence = require("@google-cloud/video-intelligence");

  // Creates a client
  const client = new videoIntelligence.VideoIntelligenceServiceClient({
    keyFilename: SERVICE_ACCOUNT
  });

  input_vid =
    "gs://operation-verde-ricecam.appspot.com/videos/2019-04-24T01:34:19:962.mp4";

  console.log(
    "Waiting for operation to complete... (this may take a few minutes)"
  );

  // Construct request
  const api_request = {
    inputUri: input_vid,
    features: ["LABEL_DETECTION"]
  };

  // Execute request
  const [operation] = await client.annotateVideo(api_request);

  const [operationResult] = await operation.promise();

  // Gets annotations for video
  const annotations = operationResult.annotationResults[0];

  // Gets labels for video from its annotations
  const labels = annotations.segmentLabelAnnotations;

  console.log("--------------------------");
  console.log("predictions: ");
  labels.forEach(label => {
    console.log(`Label ${label.entity.description} occurs at:`);
    label.segments.forEach(segment => {
      segment = segment.segment;
      if (segment.startTimeOffset.seconds === undefined) {
        segment.startTimeOffset.seconds = 0;
      }
      if (segment.startTimeOffset.nanos === undefined) {
        segment.startTimeOffset.nanos = 0;
      }
      if (segment.endTimeOffset.seconds === undefined) {
        segment.endTimeOffset.seconds = 0;
      }
      if (segment.endTimeOffset.nanos === undefined) {
        segment.endTimeOffset.nanos = 0;
      }
      console.log(
        `\tStart: ${segment.startTimeOffset.seconds}` +
          `.${(segment.startTimeOffset.nanos / 1e6).toFixed(0)}s`
      );
      console.log(
        `\tEnd: ${segment.endTimeOffset.seconds}.` +
          `${(segment.endTimeOffset.nanos / 1e6).toFixed(0)}s`
      );
    });
  });
  console.log("--------------------------");
};

run();
