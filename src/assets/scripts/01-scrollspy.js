/**
 * Copyright (c) 2017 SkyzohKey
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

var ScrollSpy = (function()
{
  var elements = {};

  function init()
  {
    if (document.addEventListener)
    {
      document.addEventListener("touchmove", handleScroll, false);
      document.addEventListener("scroll", handleScroll, false);
    }
    else if (window.attachEvent)
    {
      window.attachEvent("onscroll", handleScroll);
    }
  }

  function spyOn(domElement)
  {
    var element = {};
    element['domElement'] = domElement;
    element['isInViewPort'] = true;
    elements[domElement.id] = element;
  }

  function handleScroll()
  {
    var currentViewPosition = document.documentElement.scrollTop ?
      document.documentElement.scrollTop :
      document.body.scrollTop;

    for (var i in elements) {
      var element = elements[i];
      var elementPosition = getPositionOfElement(element.domElement);

      var usableViewPosition = currentViewPosition;
      if (element.isInViewPort == false)
      {
        usableViewPosition -= element.domElement.clientHeight;
      }

      if (usableViewPosition > elementPosition)
      {
        fireOutOfSightEvent(element.domElement);
        element.isInViewPort = false;
      }
      else if (element.isInViewPort == false)
      {
        fireBackInSightEvent(element.domElement);
        element.isInViewPort = true;
      }
    };
  }

  function fireOutOfSightEvent(domElement)
  {
    fireEvent('ScrollSpyOutOfSight', domElement);
  }

  function fireBackInSightEvent(domElement)
  {
    fireEvent('ScrollSpyBackInSight', domElement);
  }

  function fireEvent(eventName, domElement)
  {
      if (document.createEvent)
      {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        event.data = domElement;
        document.dispatchEvent(event);
      }
      else if (document.createEventObject)
      {
        var event = document.createEventObject();
        event.data = domElement;
        event.expando = eventName;
        document.fireEvent('onpropertychange', event);
      }
  }

  function getPositionOfElement(domElement)
  {
    var pos = 0;
    while (domElement != null)
    {
      pos += domElement.offsetTop;
      domElement = domElement.offsetParent;
    }
    return pos;
  }

  return {
    init: init,
    spyOn: spyOn
  };
});