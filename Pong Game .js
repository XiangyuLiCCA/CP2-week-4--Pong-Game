let video;
let poseNet;
let poses = [];

var x, y;
var vx, vy;
var leftPaddle;
var rightPaddle;
var c;
var d;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  x = width / 2;
  y = height / 2;
  vx = 3;
  vy = 1.2;
  c = 10;
  d = 10;
  leftPaddle = height / 2;
  rightPaddle = height / 2;

  rectMode(CENTER);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  // drawSkeleton();

  textSize(16);
  textAlign(CENTER);
  text('Plear A', 50, 30);
  text(c, 50, 45);
  text('Plear B', width - 50, 30);
  text(d, width - 50, 45);

  fill(255)
  rect(20, leftPaddle, 10, 50);
  rect(width - 20, rightPaddle, 10, 50);

  ellipse(x, y, 20);

  x = x + vx;
  y = y + vy;
  if (mouseIsPressed) {
    vx = 3;
    vy = 1.2;
  }

  if (y < 10) {
    vy = -vy;
  }
  if (y > height - 10) {
    vy = -vy;
  }
  if (x < 35) {
    if (y < leftPaddle + 25 && y > leftPaddle - 25) {
      vx = -vx;
    } else {
      c = c - 1;
      x = width - width / 3;
      vx = 0;
      vy = 0;
    }
  }
  if (x > width - 35) {
    if (y < rightPaddle + 25 && y > rightPaddle - 25) {
      vx = -vx;
    } else {
      d = d - 1;
      x = width / 3;
      vx = 0;
      vy = 0;
    }
  }




  //Paddle concel
  for (var i = 0; i < poses.length; i++) {
    if (poses.length < 1) {
      leftPaddle = poses[0].pose.nose.y = rightPaddle;
    }

    if (poses.length >= 2) {
      if (poses[0].pose.nose.x < poses[1].pose.nose.x) {
        leftPaddle = poses[0].pose.nose.y;
        rightPaddle = poses[1].pose.nose.y;
      } else if (poses[0].pose.nose.x > poses[1].pose.nose.x) {
        leftPaddle = poses[1].pose.nose.y;
        rightPaddle = poses[0].pose.nose.y;
      }

    }


  }
  if (c < 0) {
    fill(255);
    rect(width / 2, height / 2, width, height);
    textSize(60);
    textAlign(CENTER);
    text('Game Over', CENTER , CENTER);
  }

}
