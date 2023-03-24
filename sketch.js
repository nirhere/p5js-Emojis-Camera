//Base on
//Ambigious results on pose estimation with ml5js #340
//https://github.com/ml5js/ml5-library/issues/340
//Random EmojiCode Generator Tutorial
//https://thekevinscott.com/emojis-in-javascript/
//Face Tracking with ps.j5 (Too much info for me at current stage)
//https://github.com/stc/face-tracking-p5js
//Face Following Reference
//https://editor.p5js.org/facons/sketches/dNNc5LB8
//Binary Search Tree Models
//https://www.geeksforgeeks.org/a-program-to-check-if-a-binary-tree-is-bst-or-not/


let video;
let poseNet;
let poses = [];
let emojiCode;

//Loading Webcam Capture
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();

  textAlign(CENTER, CENTER);
  emojiCode = floor(random(128512, 128542));
}

function modelReady() {
  // select('#status').html('Model Loaded');
}

function draw() {
  push();
  translate(width, 0);
  stroke(40,40,(frameCount % 128) + 60);
  scale(-1, 1)
 image(video, 0, 0, width, height);
  drawLine();
  drawEmoji2();
  pop();
}

function drawLine() {
  let prevPoint = {x: 0, y: 0};
  
  
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    let dist = calcDistance(pose);
    textSize(dist * .2);
    pose.keypoints.forEach((p) => {
      line(p.position.x, p.position.y, prevPoint.x, prevPoint.y);
      prevPoint = p.position;
    }
  );
  }
      line(width, height, prevPoint.x, prevPoint.y);  
}

function drawEmoji2() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    let dist = calcDistance(pose);
    textSize(dist * .2);
    pose.keypoints.forEach((p) => {
      circle(p.position.x, p.position.y, 10);
      emojiCode = floor(random(128522, 128572));
      let emojiFace = String.fromCodePoint(emojiCode);
       
      text(emojiFace, p.position.x, p.position.y);

    });
    // console.log(pose);
  }
}

function drawEmoji() {
  if (frameCount % 75 == 0) {
    emojiCode = floor(random(128522, 128572));
  }

  let emojiFace = String.fromCodePoint(emojiCode);

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    let nosePoint = pose.keypoints[0];
    let leftEarPoint = pose.keypoints[3];
    let rightEarPoint = pose.keypoints[4];

    let noseX, noseY, leftX, leftY, rightX, rightY;

    if (nosePoint.score > 0.1) {
      noseX = nosePoint.position.x;
      noseY = nosePoint.position.y;
    }

    if (leftEarPoint.score > 0.25) {
      leftX = leftEarPoint.position.x;
      leftY = leftEarPoint.position.y;
    }

    if (rightEarPoint.score > 0.25) {
      rightX = rightEarPoint.position.x;
      rightY = rightEarPoint.position.y;
    }

    if (
      rightX != null 
      &&
      rightY != null 
      &&
      leftX != null 
      &&
      leftY != null 
      &&
      noseX != null 
      &&
      noseY != null
    ) {
      let dis = dist(rightX, rightY, leftX, leftY);
      textSize(dis * 1.5);
      text(emojiFace, noseX, noseY);
    }
  }
}

function calcDistance (positions) {
    let nosePoint = positions.keypoints[0];
    let leftEarPoint = positions.keypoints[3];
    let rightEarPoint = positions.keypoints[4];

    let noseX, noseY, leftX, leftY, rightX, rightY;

    if (nosePoint.score > 0.1) {
      noseX = nosePoint.position.x;
      noseY = nosePoint.position.y;
    }

    if (leftEarPoint.score > 0.25) {
      leftX = leftEarPoint.position.x;
      leftY = leftEarPoint.position.y;
    }

    if (rightEarPoint.score > 0.25) {
      rightX = rightEarPoint.position.x;
      rightY = rightEarPoint.position.y;
    }

    if (
      rightX != null 
      &&
      rightY != null 
      &&
      leftX != null 
      &&
      leftY != null 
      &&
      noseX != null 
      &&
      noseY != null
    ) {

      return dist(rightX, rightY, leftX, leftY);
    }
}