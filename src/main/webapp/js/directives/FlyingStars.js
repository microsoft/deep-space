/**
 * ------------------------------------------ START OF LICENSE -----------------------------------------
 *
 * Deep-Space
 *
 * Copyright (c) Microsoft Corporation
 *
 * All rights reserved.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the ""Software""), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ----------------------------------------------- END OF LICENSE ------------------------------------------
 */
fsDirectives.directive('flyingStars', function($window) {
  'use strict';

  return {
    restrict: 'EAC',
    replace: true,
    scope: {
      speed: '=',
      stars: '=',
      images: '='
    },
    template: '<div>' +
                '<div class="fsCanvasContainer"> <canvas id="flyingStarsCanvas"> </canvas> </div>' +
                '<div class="fssliderContainer" id="speedSliderContainer"> <span>Zooming Speed: </span> <span id="speedText" ng-bind="speed"></span> <div class="fsslider" id="speedSlider"/> </div>' +
                // Uncomment the following line to add a slider for number of stars
                // '<div class="fssliderContainer" id="starsSliderContainer"> <span>Number of Stars:</span> <span id="starsText" ng-bind="stars"></span> <div class="fsslider" id="starsSlider"/> </div>' +
              '</div>',
    link: function (scope, element, attribute) {

      /* Flying objects */
      var Star = function() {
        //make initial star spread across the entire screen
        this.position = initialPosition(random(edgeDistance));
        this.brightness = random(100);

        this.reset = function() {
          this.position = initialPosition(random(100));
        }

        this.updatePosition = function () {
          this.position.distance *= distanceScaling;
        }

        this.isInBoundary = function(x, y) {
          // x and y are negative to give some room to fall off the screen completely
          return x >= -200 && x <= canvas.width && y >= -200 && y <= canvas.height;
        }

        this.getX = function()  {
          return this.position.distance * Math.cos(this.position.thetaX) + origin.x;
        }

        this.getY = function()  {
          return this.position.distance * Math.cos(this.position.thetaY) + origin.y;
        }

        this.calculatePositionAndSize = function(ctx, callback) {
          var x = this.getX();
          var y = this.getY();

          if (this.isInBoundary(x, y)) {
            var distanceScaleFactor = this.position.distance/edgeDistance;
            var size = Math.min(6 * distanceScaleFactor, maxStarSize);

            callback.call(this, x, y, size);
          } else {
            this.reset();
          }
        }

        this.drawOnCanvas = function(ctx) {
          this.calculatePositionAndSize(ctx, function(x, y, size) {
            ctx.fillStyle = getGrayShade(Math.floor(255 * size) + 100 + this.brightness);
            ctx.fillRect(x, y, size, size);
          });
        }
      }

      var FlyingImage = function() {
        Star.apply(this);

        this.reset = function() {
          // switch to next image
          var nextImage = scope.images[fsImgIdx % scope.images.length];
          fsImgIdx += 1;
          this.image = new Image();
          this.image.src = nextImage.src;
          this.imageRatio = nextImage.width / nextImage.height;
          this.position = initialPosition(50);
          this.imgScale = 50;
        }

        this.drawOnCanvas = function(ctx) {
          this.calculatePositionAndSize(ctx, function(x, y, size) {
            ctx.drawImage(this.image, x, y, size * this.imgScale * this.imageRatio,  size * this.imgScale);
          });
        }

        this.reset();
      }

      /* sliders for speed and number of stars */
      var updateSpeed = function() {
        scope.speed = $("#speedSlider").slider("value");
        $("#speedText").text(scope.speed);
        if (intervalId !== -1) {
          clearInterval(intervalId);
          updateTick(scope.speed);
        }
      }

      var updateStars = function() {
        scope.stars = $("#starsSlider").slider("value");
        $("#starsText").text(scope.stars);
        if (scope.stars < stars.length) {
          stars = stars.slice(0, scope.stars);
        } else {
          while(stars.length < scope.stars) {
            stars.push(new Star());
          }
        }
      }

      $("#speedSlider").slider({
         orientation: "horizontal",
         range: "min",
         max: 100, //max speed
         value: scope.speed,
         slide: updateSpeed,
         change: updateSpeed
      });

      $("#starsSlider").slider({
         orientation: "horizontal",
         range: "min",
         max: 500, //max num of stars
         value: scope.stars,
         slide: updateStars,
         change: updateStars
      });

      function random(max) {
          return Math.floor(Math.random() * max) + 1;
      }

      function getGrayShade(c) {
        return "rgb("+c+","+c+","+c+")";
      }

      function initialPosition(distace) {
        return {
          thetaX: random(180) * Math.PI / 180,
          thetaY: random(180) * Math.PI / 180,
          distance: distace
        }
      }

      function initStars() {
        stars = [];

        for(var i = 0; i < scope.stars; ++i) {
          stars.push(new Star());
        }
      }

      function initImages() {
        images = [];

        if (scope.images && scope.images.length > 0) {
          images.push(new FlyingImage());
        }
      }

      function init() {
        initStars();
        initImages();
      }

      function updatePositions() {
        //black background, redraw all objects every tick
        ctx.fillStyle = getGrayShade(0);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // update object's position on canvas
        $.each(stars.concat(images), function(i, flyObject){
          flyObject.updatePosition();
          flyObject.drawOnCanvas(ctx);
        });
      }

      function updateTick(speed) {
         var interval = 100 - speed;
          if (interval === 100) {
            clearInterval(intervalId);
          } else {
            intervalId = setInterval(updatePositions, interval);
          }
      }

      function updateCanvasSize(canvas) {
          var parentDiv = canvas.parentElement;
          //fill parent
          canvas.height = parentDiv.clientHeight;
          canvas.width = parentDiv.clientWidth;
        
          origin = {
            x: canvas.width / 2,
            y: canvas.height / 2
          };

          edgeDistance = Math.sqrt(Math.pow(origin.x, 2) + Math.pow(origin.y, 2));
      }

      function draw() {
        if (intervalId !== -1) {
          clearInterval(intervalId);
        }

        if (canvas && canvas.getContext) {
          ctx = canvas.getContext("2d");
          init();
          updateTick(scope.speed);
        }
      }

      scope.$watch('images', function(oldVal, newVal) {
        initImages();
      }, true);


      /* setup coordinates */
      var canvas = $('#flyingStarsCanvas')[0];

      var win = angular.element($window);
      win.bind('resize', function() {
          updateCanvasSize(canvas);
      });

      var origin, edgeDistance;

      var distanceScaling = 1.03;
      var maxStarSize = 4;

      var ctx;
      var stars, images;
      var intervalId = -1;
      var fsImgIdx = 0;

      updateCanvasSize(canvas);
      draw();
    }
  };
});
