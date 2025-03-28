import nextID from "makeup-next-id";
import * as RovingTabindex from "makeup-roving-tabindex";
import * as ScrollKeyPreventer from "makeup-prevent-scroll-keys";
function linkTabToPanel(widgetID, el, i) {
  el.setAttribute("id", `${widgetID}-tab-${i}`);
  el.setAttribute("aria-controls", `${widgetID}-panel-${i}`);
}
function linkPanelToTab(widgetID, el, i) {
  el.setAttribute("id", `${widgetID}-panel-${i}`);
  el.setAttribute("aria-labelledby", `${widgetID}-tab-${i}`);
}
function disableLink(el) {
  el.setAttribute("role", "presentation");
  el.removeAttribute("href");
}
function dispatchEvent(el, fromIndex, toIndex) {
  el.dispatchEvent(
    new CustomEvent("makeup-tabs-change", {
      detail: {
        fromIndex,
        toIndex
      }
    })
  );
}
function onRovingTabindexChange(e) {
  this.tabs[e.detail.fromIndex].setAttribute("aria-selected", "false");
  this.panels[e.detail.fromIndex].hidden = true;
  this.tabs[e.detail.toIndex].setAttribute("aria-selected", "true");
  this.panels[e.detail.toIndex].hidden = false;
  dispatchEvent(this._el, e.detail.fromIndex, e.detail.toIndex);
}
function onTabListKeyDown(e) {
  if (e.keyCode === 13 || e.keyCode === 32) {
    const fromIndex = this.index;
    const toIndex = [...this.tabs].indexOf(e.target);
    if (fromIndex !== toIndex) {
      this.tabs[fromIndex].setAttribute("aria-selected", "false");
      this.panels[fromIndex].hidden = true;
      this.tabs[toIndex].setAttribute("aria-selected", "true");
      this.panels[toIndex].hidden = false;
      dispatchEvent(this._el, fromIndex, toIndex);
    }
  }
}
function onTabListClick(e) {
  const tabEl = e.target.closest("[role=tab]");
  if (tabEl) {
    const fromIndex = this.index;
    const toIndex = [...this.tabs].indexOf(tabEl);
    if (fromIndex !== toIndex) {
      this.tabs[fromIndex].setAttribute("aria-selected", "false");
      this.panels[fromIndex].hidden = true;
      tabEl.setAttribute("aria-selected", "true");
      this.panels[toIndex].hidden = false;
      dispatchEvent(this._el, fromIndex, toIndex);
    }
  }
}
const defaultOptions = {
  autoSelect: true,
  initialIndex: 0
};
class index_default {
  constructor(widgetEl, selectedOptions) {
    this._options = Object.assign({}, defaultOptions, selectedOptions);
    this._onRovingTabindexChangeListener = onRovingTabindexChange.bind(this);
    this._onTabListKeyDownListener = onTabListKeyDown.bind(this);
    this._onTabListClickListener = onTabListClick.bind(this);
    this._el = widgetEl;
    const tabList = this._el.querySelector(".tabs__items");
    const tabs = this._el.querySelectorAll(".tabs__item");
    const panels = this._el.querySelectorAll(".tabs__panel");
    const links = tabList.querySelectorAll("a");
    this.tabList = tabList;
    this.tabs = tabs;
    this.panels = panels;
    let initialIndex = this._options.initialIndex;
    if (initialIndex < 0 || initialIndex >= tabs.length) {
      initialIndex = 0;
    }
    nextID(widgetEl, "tabs");
    tabList.setAttribute("role", "tablist");
    tabs.forEach((el) => el.setAttribute("role", "tab"));
    panels.forEach((el) => el.setAttribute("role", "tabpanel"));
    tabs[initialIndex].setAttribute("aria-selected", "true");
    [...tabs].filter((el, i) => i !== initialIndex).forEach((el) => el.setAttribute("aria-selected", "false"));
    [...panels].filter((el, i) => i !== initialIndex).forEach((el) => el.hidden = true);
    tabs.forEach((el, i) => linkTabToPanel(this._el.id, el, i));
    panels.forEach((el, i) => linkPanelToTab(this._el.id, el, i));
    links.forEach((el) => disableLink(el));
    this._rovingTabindex = RovingTabindex.createLinear(this._el, "[role=tab]", { wrap: true });
    this.wake();
    ScrollKeyPreventer.add(tabList);
    this._el.classList.add("tabs--js");
  }
  get index() {
    return [...this.tabs].findIndex(function(el) {
      return el.getAttribute("aria-selected") === "true";
    });
  }
  sleep() {
    this._el.removeEventListener("rovingTabindexChange", this._onRovingTabindexChangeListener);
    this.tabList.removeEventListener("keydown", this._onTabListKeyDownListener);
    this.tabList.removeEventListener("click", this._onTabListClickListener);
  }
  wake() {
    if (this._destroyed !== true) {
      if (this._options.autoSelect === true) {
        this._el.addEventListener("rovingTabindexChange", this._onRovingTabindexChangeListener);
      } else {
        this.tabList.addEventListener("keydown", this._onTabListKeyDownListener);
        this.tabList.addEventListener("click", this._onTabListClickListener);
      }
    }
  }
  destroy() {
    this._destroyed = true;
    this.sleep();
    this._onRovingTabindexChangeListener = null;
    this._onTabListKeyDownListener = null;
    this._onTabListClickListener = null;
  }
}
export {
  index_default as default
};
