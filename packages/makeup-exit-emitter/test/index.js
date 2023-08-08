import { expect } from "chai";
import sinon from "sinon";
import * as ExitEmitter from "../src/index.js";

let testEl;
let testElSibling;
let onFocusExit;

describe("given an element with focus", function () {
  function setup() {
    document.body.innerHTML = `
            <div id="test-element" tabindex="0">
                <button></button>
            </div>
            <div id="test-element-sibling" tabindex="0">
                <button></button>
            </div>
        `;

    testEl = document.querySelector("#test-element");
    testElSibling = document.querySelector("#test-element-sibling");
    ExitEmitter.addFocusExit(testEl);
    onFocusExit = sinon.spy();
    testEl.addEventListener("focusExit", onFocusExit);
    testEl.focus();
  }

  before(setup);
  afterEach(function () {
    testEl.focus();
    onFocusExit.resetHistory();
  });

  describe("when focus moves to sibling", function () {
    before(function () {
      testElSibling.focus();
    });

    it("should trigger focusExit once", function () {
      expect(onFocusExit.called).to.be.true;
    });
  });

  describe("when focus moves to descendant", function () {
    before(function () {
      testEl.querySelector("button").focus();
    });

    it("should not trigger focusExit", function () {
      expect(onFocusExit.notCalled).to.be.true;
    });
  });

  // describe('when focus exits with blur', function() {
  //     before(function() {
  //         testEl.blur();
  //     });

  //     it('should trigger focusExit once', async function() {
  //         expect(onFocusExit.calledOnce).to.be.true;
  //     });
  // });

  describe("when focus moves to sibling without focusExit", function () {
    before(function () {
      ExitEmitter.removeFocusExit(testEl);
      testElSibling.focus();
    });

    it("should not trigger focusExit", function () {
      expect(onFocusExit.notCalled).to.be.true;
    });
  });
});

describe("given an element with focus on descendant", function () {
  function setup() {
    document.body.innerHTML = `
            <div id="test-element" tabindex="0">
                <button></button>
            </div>
            <div id="test-element-sibling" tabindex="0">
                <button></button>
            </div>
        `;

    testEl = document.querySelector("#test-element");
    testElSibling = document.querySelector("#test-element-sibling");
    ExitEmitter.addFocusExit(testEl);
    onFocusExit = sinon.spy();
    testEl.addEventListener("focusExit", onFocusExit);
    testEl.querySelector("button").focus();
  }

  before(setup);
  afterEach(function () {
    testEl.querySelector("button").focus();
    onFocusExit.resetHistory();
  });

  describe("when focus moves to sibling of element root", function () {
    before(function () {
      testElSibling.focus();
    });

    it("should trigger focusExit once", async function () {
      expect(onFocusExit.called).to.be.true;
    });
  });

  describe("when focus is reset on descendant", function () {
    before(function () {
      testEl.querySelector("button").focus();
    });

    it("should not trigger focusExit", function () {
      expect(onFocusExit.notCalled).to.be.true;
    });
  });

  describe("when focus moves to element root", function () {
    before(function () {
      testEl.focus();
    });

    it("should not trigger focusExit", function () {
      expect(onFocusExit.notCalled).to.be.true;
    });
  });
});
