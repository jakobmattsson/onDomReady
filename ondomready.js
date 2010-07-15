/*
  onDomReady, Copyright © 2010 Jakob Mattsson

  This is a small implementation of an onDomReady-function, for situations when frameworks are no-no.
  It's loosely based on jQuery's implementation of $.ready, Copyright (c) 2010 John Resig, http://jquery.com/
*/

(function() {
  var isReady = false;
  var isBound = false;
  var readyList = [];

  var whenReady = function() {
    if (isReady) {
      return;
    }
    
    // Make sure body exists, at least, in case IE gets a little overzealous.
    // This is taked directly from jQuery's implementation.
    if (!document.body) {
      return setTimeout(whenReady, 13);
    }
    
    isReady = true;
    
    for (var i=0; i<readyList.length; i++) {
      readyList[i]();
    }
  };

  var bindReady = function() {
    if (isBound) {
      return;
    }
    isBound = true;
    
    // Catch cases where onDomReady is called after the browser event has already occurred.
    if (document.readyState === "complete") {
      return whenReady();
    }

    // Mozilla, Opera and webkit nightlies currently support this event
    if (document.addEventListener) {
      var DOMContentLoaded = function() {
        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
        whenReady();
      };
      
      document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
      window.addEventListener("load", whenReady, false); // fallback
      
      // If IE event model is used
    } else if (document.attachEvent) {
      
      var onreadystatechange = function() {
        if (document.readyState === "complete") {
          document.detachEvent("onreadystatechange", onreadystatechange);
          whenReady();
        }
      };
      
      document.attachEvent("onreadystatechange", onreadystatechange);
      window.attachEvent("onload", whenReady); // fallback

      // If IE and not a frame, continually check to see if the document is ready
      var toplevel = false;

      try {
        toplevel = window.frameElement == null;
      } catch(e) {}

      // The DOM ready check for Internet Explorer
      if (document.documentElement.doScroll && toplevel) {
        var doScrollCheck = function() {
          if (isReady) {
            return;
          }

          try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
          } catch(e) {
            setTimeout(doScrollCheck, 1);
            return;
          }

          // and execute any waiting functions
          whenReady();
        }  
        doScrollCheck();
      }
    } 
  };

  window.onDomReady = function(callback) {
    bindReady();
    readyList.push(callback);
  }
})();
