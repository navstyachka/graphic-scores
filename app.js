var s,
  App;

(function() {
  var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

App = {
  settings: {
    $container: document.querySelector('.container'),
    $imageContainer: document.querySelector('.image'),
    $imageTag: document.querySelector('.image__tag'),
    $uploadButton: document.querySelector('[name="image"]'),
    $restartButton: document.querySelector('.restart'),
    $playButton: document.querySelector('.play-pause'),
    $reuploadButton: document.querySelector('.reupload'),
    $setTimeButton: document.querySelector('.time-popup__button'),
    $setTimeInput: document.querySelector('.time-popup__input'),
    $line: document.querySelector('.line'),
    introClass: 'state-intro',
    timingClass: 'state-timing',
    clearContainerClass: 'container',
    animatingClass: 'animating',
    time: null,
    timeLeft: null,
    status: 'paused', //'playing',
    interval: null,
    position: 0
  },

  init: function () {
    s = this.settings;
    var that = this;

    window.addEventListener('optimizedResize', function() {
      that.restartAnimation()
    });

    s.$uploadButton.addEventListener('change', function () {
      that.onUploadImage()
    })

    s.$setTimeButton.addEventListener('click', function () {
      that.onTimeEnter()
    })

    s.$playButton.addEventListener('click', function () {
      that.playPause()
    })

    s.$restartButton.addEventListener('click', function () {
      that.restartAnimation()
    })
  },

  onUploadImage: function () {
    this.ui.enterTimingState();
    s.$imageTag.src = window.URL.createObjectURL(s.$uploadButton.files[0]);
  },

  onTimeEnter: function () {
    this.ui.clearState();
    var time = parseInt(s.$setTimeInput.value);
    s.time = time;
    s.timeLeft = time;
    s.$imageContainer.setAttribute('class', 'image active');
  },

  playPause: function () {
    if (s.interval) clearInterval(s.interval)
    if (s.status === 'paused') {
      var pixelsPerSecond = window.innerWidth / s.time;

      s.status = 'playing';
      s.$playButton.innerHTML = 'Pause';
      s.$line.setAttribute('class', 'line ' + s.animatingClass);

      setTimeout(function() {
        s.interval = setInterval(function () {
          s.position = s.position + pixelsPerSecond;
          s.timeLeft = s.timeLeft - 1;
          s.$line.style.transform = 'translateX('+ s.position +'px)';
          if (s.timeLeft === 0) {
            clearInterval(s.interval)
          }
        }, 1000)
      }, 3000)

    } else if (s.status === 'playing') {
      s.status = 'paused';
      s.$playButton.innerHTML = 'Play';
    }
  },

  restartAnimation: function () {
    clearInterval(s.interval);
    s.interval = null;
    s.status = 'paused';
    s.$playButton.innerHTML = 'Play';
    s.timeLeft = s.time;
    s.position = 0;
    s.interval = null;
    s.$line.setAttribute('class', 'line');
    s.$line.style.transform = 'translateX(0)';

  },

  ui: {
    clearState: function () {
      s.$container.setAttribute('class', s.clearContainerClass);
    },

    enterTimingState: function () {
      var classes = s.clearContainerClass + ' ' + s.introClass + ' ' + s.timingClass;
      s.$container.setAttribute('class', classes);
    }
  }
};

App.init();
