const typeChecker = value => Object.prototype.toString.call(value);
const SimpleEvent = (selector) => {
  let isDragging = false;
  let eventTargetCanvas = null;
  let clickCnt = 0;
  const event = {};
  const EVENTS_CALLBACK = {
    mouseDragStart(e) {
      if (event.dragStart) event.dragStart.forEach(fn => fn(eventTargetCanvas.getMousePosition(e)));
    },
    mouseDrag(e) {
      if (clickCnt === 1) {
        EVENTS_CALLBACK.mouseDragStart(e);
      }
      if (event.drag) {
        event.drag.forEach(fn => fn(eventTargetCanvas.getMousePosition(e)));
      }
      clickCnt += 1;
      isDragging = true;
    },
    mouseDragEnd(e) {
      if (event.dragEnd) event.dragEnd.forEach(fn => fn(eventTargetCanvas.getMousePosition(e)));
    },
    mouseClick(e) {
      if (event.click) {
        event.click.forEach(fn => fn(eventTargetCanvas.getMousePosition(e)));
      }
    },
    mouseDBClick(e) {
      if (event.dbclick) event.dbclick.forEach(fn => fn(eventTargetCanvas.getMousePosition(e)));
    },
    mouseRightClick(e) {
      if (event.rightClick) {
        event.rightClick.forEach(fn => fn(eventTargetCanvas.getMousePosition(e)));
      }
      clickCnt = 0;
    },
    mouseWheel(e) {
      if (event.wheel) event.wheel.forEach(fn => fn(e));
    },
    mouseDown(e) {
      e.preventDefault();

      clickCnt += 1;
      window.addEventListener('mousemove', EVENTS_CALLBACK.mouseDrag);
    },
  };

  function bindInitialEvevnt() {
    this.element.oncontextmenu = (e) => {
      if (event.rightClick && e.which === 3) {
        EVENTS_CALLBACK.mouseRightClick(e);
      }
      return false;
    };

    this.element.addEventListener('mousedown', EVENTS_CALLBACK.mouseDown);

    window.addEventListener('mouseup', (e) => {
      window.removeEventListener('mousemove', EVENTS_CALLBACK.mouseDrag);
    });

    this.element.addEventListener('mouseup', (e) => {
      e.preventDefault();
      window.removeEventListener('mousemove', EVENTS_CALLBACK.mouseDrag);

      if (isDragging) {
        EVENTS_CALLBACK.mouseDragEnd(e);
        window.removeEventListener('mousemove', EVENTS_CALLBACK.mouseDrag);

        isDragging = false;
      }

      setTimeout(() => {
        if (clickCnt === 1 && e.which !== 3) {
          EVENTS_CALLBACK.mouseClick(e);
        } else if (clickCnt === 2 && e.which !== 3) {
          EVENTS_CALLBACK.mouseDBClick(e);
        }
        clickCnt = 0;
      }, 100);
    });
    this.element.addEventListener('wheel', (e) => {
      setTimeout(() => {
        if (EVENTS_CALLBACK.mouseWheel) EVENTS_CALLBACK.mouseWheel(e);
      }, 1);
    });
  }

  function getCanvas() {
    const { element } = this;
    const target = element.getBoundingClientRect();
    const targetX = (target.left * (element.offsetWidth / target.width));
    const targetY = (target.top * (element.offsetHeight / target.height));

    return {
      getMousePosition(e) {
        const canvasX = e.pageX - targetX;
        const canvasY = e.pageY - targetY;

        Object.assign(e, {
          canvasX,
          canvasY,
        });

        return e;
      },
    };
  }

  class _SimpleEvent {
    constructor(target) {
      if (typeChecker(target) === '[object String]') {
        this.element = document.querySelector(target);
      } else {
        this.element = target;
      }
      bindInitialEvevnt.call(this);
      eventTargetCanvas = getCanvas.call(this);
    }

    on(type, ...callback) {
      Object.assign(event, {
        [type]: callback,
      });

      return this;
    }
  }

  const simpleEventInstance = new _SimpleEvent(selector);

  return simpleEventInstance;
};


const global = typeof window === 'undefined' ? self : window;

global.simpleEvent = SimpleEvent;
global.$$ = SimpleEvent;

export default SimpleEvent;
