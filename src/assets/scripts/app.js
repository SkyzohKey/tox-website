/**
 * Copyright (c) 2017 SkyzohKey
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

(function(window, document) {

  var App = (function() {
    this._scrollSpy = new ScrollSpy();
    this._scrollSpy.init();

    this.header          = document.querySelector('#site-header') || null;
    this.title           = document.querySelector('.page-title') || null;
    this.secondNav       = document.querySelector('nav.second-nav') || null;
    this.featureMessages = document.querySelector('#messages') || null;
    this.featureAudio    = document.querySelector('#audio-calls') || null;
    this.featureVideo    = document.querySelector('#video-calls') || null;
    this.featureFiles    = document.querySelector('#file-transfers') || null;

    this.secondNavLinks = document.querySelectorAll('#features-nav a') || null;
    this.linkMessages    = document.querySelector('#link-messages') || null;
    this.linkAudio       = document.querySelector('#link-audio-calls') || null;
    this.linkVideo       = document.querySelector('#link-video-calls') || null;
    this.linkFiles       = document.querySelector('#link-file-transfers') || null;
  });

  App.prototype.init = function() {
    console.log(this.header);
    console.log(this.secondNav);

    this.enableScrollSpy();
    this.addEvents();
  }

  App.prototype.enableScrollSpy = function() {
    if (this.secondNav == null && this.header != null) {
      this._scrollSpy.spyOn(this.header);
    }

    if (this.secondNav != null) {
      this._scrollSpy.spyOn(this.secondNav);
      this._scrollSpy.spyOn(this.featureMessages);
      this._scrollSpy.spyOn(this.featureAudio);
      this._scrollSpy.spyOn(this.featureVideo);
      this._scrollSpy.spyOn(this.featureFiles);
    }
  };

  App.prototype.addEvents = function() {
    /* Element is not visible anymore on the screen. */
    addEvent(document, 'ScrollSpyOutOfSight', function (e) {
      var scrollTop = document.documentElement.scrollTop ?
        document.documentElement.scrollTop :
        document.body.scrollTop;

      // Header.
      if (this.header != null && this.secondNav == null) {
        if (e.data.id == this.header.id &&
            this.header.classList.contains('fixed') == false &&
            scrollTop >= this.header.offsetHeight
        ) {
          this.header.classList.add('fixed');
          document.body.style.marginTop = this.header.offsetHeight + 'px'; // Perfect transition.
        }
      }

      if (this.secondNav != null) {
        if (e.data.id == this.secondNav.id &&
            this.secondNav.classList.contains('fixed') == false &&
            scrollTop >= this.secondNav.offsetHeight
        ) {
          this.secondNav.classList.add('fixed');
          this.header.classList.remove('fixed');
          document.body.style.marginTop = this.secondNav.offsetHeight + 'px'; // Perfect transition.
        }
      }
    }.bind(this));

    /* Element is visible again on the screen. */
    addEvent(document, 'ScrollSpyBackInSight', function (e) {
      var scrollTop = document.documentElement.scrollTop ?
        document.documentElement.scrollTop :
        document.body.scrollTop;

      // Header.
      if (this.header != null && this.secondNav == null) {
        if (e.data.id == this.header.id &&
            this.header.classList.contains('fixed') == true &&
            scrollTop <= this.header.offsetHeight
        ) {
          this.header.classList.remove('fixed');
          document.body.style.marginTop = '0';
        }
      }

      if (this.secondNav != null) {
        var floatOffset = this.secondNav.offsetHeight;
        if (e.data.id == this.secondNav.id &&
            this.secondNav.classList.contains('fixed') == true &&
            scrollTop <= floatOffset
        ) {
          this.secondNav.classList.remove('fixed');
          document.body.style.marginTop = '0';
          this.header.classList.remove('fixed');
        }
      }
    }.bind(this));

    if (this.secondNavLinks != null) {
      for (var i = 0, length = this.secondNavLinks.length; i < length; i++) {
        var el = this.secondNavLinks[i];
        var that = this;
        addEvent(el, 'click', function (e) {
          var href = this.href;
          var offset = that.secondNav.clientHeight;

          that.scrollToAnchor(href, offset);
        })
      }
    }
  };

  App.prototype.scrollToAnchor = function(href, offset) {
    if (href.indexOf('#') == 0) {
      var target = document.getElementById(href);
      if (history && "pushState" in history) {
        history.pushState({}, document.title, window.location.pathname + href);
        return false;
      }
    }
  }

  var tox = new App();
  tox.init();

})(window, document);