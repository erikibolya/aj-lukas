"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var a, b;
a = void 0, b = function b() {
  "use strict";

  function s(t, e) {
    for (var n = 0; n < e.length; n++) {
      var s = e[n];
      s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s);
    }
  }

  function a(t) {
    return "string" == typeof t ? document.querySelector(t) : t();
  }

  function l(t) {
    return t.innerHTML = "";
  }

  function t(t, e) {
    e = e || {
      bubbles: !1,
      cancelable: !1,
      detail: void 0
    };
    var n = document.createEvent("CustomEvent");
    return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n;
  }

  var u = "data-result",
      n = "autoComplete_results_list",
      c = "autoComplete_result",
      e = "autoComplete_highlighted",
      i = a,
      r = function r(t) {
    var e = document.createElement(t.element);
    return e.setAttribute("id", n), t.container && t.container(e), t.destination.insertAdjacentElement(t.position, e), e;
  },
      h = function h(t) {
    return "<span class=".concat(e, ">").concat(t, "</span>");
  },
      o = function o(i, r, _o) {
    r.forEach(function (t, e) {
      var n = document.createElement(_o.element),
          s = r[e].value[t.key] || r[e].value;
      n.setAttribute(u, s), n.setAttribute("class", c), n.setAttribute("tabindex", "1"), _o.content ? _o.content(t, n) : n.innerHTML = t.match || t, i.appendChild(n);
    });
  },
      d = function d(t, n, s) {
    var i = a(t),
        r = n.firstChild;

    document.onkeydown = function (t) {
      var e = s.activeElement;

      switch (t.keyCode) {
        case 38:
          e !== r && e !== i ? e.previousSibling.focus() : e === r && i.focus();
          break;

        case 40:
          e === i && 0 < n.childNodes.length ? r.focus() : e !== n.lastChild && e.nextSibling.focus();
      }
    };
  },
      f = l,
      m = function m(n, s, i, r) {
    var o = s.querySelectorAll(".".concat(c));
    Object.keys(o).forEach(function (e) {
      ["mousedown", "keydown"].forEach(function (t) {
        o[e].addEventListener(t, function (e) {
          "mousedown" !== t && 13 !== e.keyCode && 39 !== e.keyCode || (i({
            event: e,
            query: _instanceof(a(n), HTMLInputElement) ? a(n).value : a(n).innerHTML,
            matches: r.matches,
            results: r.list.map(function (t) {
              return t.value;
            }),
            selection: r.list.find(function (t) {
              return (t.value[t.key] || t.value) === e.target.closest(".".concat(c)).getAttribute(u);
            })
          }), l(s));
        });
      });
    });
  };

  t.prototype = window.Event.prototype;
  var p = {
    CustomEventWrapper: "function" == typeof window.CustomEvent && window.CustomEvent || t,
    initElementClosestPolyfill: function initElementClosestPolyfill() {
      Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector), Element.prototype.closest || (Element.prototype.closest = function (t) {
        var e = this;

        do {
          if (e.matches(t)) return e;
          e = e.parentElement || e.parentNode;
        } while (null !== e && 1 === e.nodeType);

        return null;
      });
    }
  };
  return function () {
    function e(t) {
      !function (t, e) {
        if (!_instanceof(t, e)) throw new TypeError("Cannot call a class as a function");
      }(this, e), this.selector = t.selector || "#autoComplete", this.data = {
        src: function src() {
          return "function" == typeof t.data.src ? t.data.src() : t.data.src;
        },
        key: t.data.key,
        cache: void 0 === t.data.cache || t.data.cache
      }, this.query = t.query, this.trigger = {
        event: t.trigger && t.trigger.event ? t.trigger.event : ["input"],
        condition: !(!t.trigger || !t.trigger.condition) && t.trigger.condition
      }, this.searchEngine = "loose" === t.searchEngine ? "loose" : "function" == typeof t.searchEngine ? t.searchEngine : "strict", this.threshold = t.threshold || 0, this.debounce = t.debounce || 0, this.resultsList = {
        render: !(!t.resultsList || !t.resultsList.render) && t.resultsList.render,
        shadowRoot: t.resultsList && t.resultsList.shadowRoot ? t.resultsList.shadowRoot : document,
        view: t.resultsList && t.resultsList.render ? r({
          container: !(!t.resultsList || !t.resultsList.container) && t.resultsList.container,
          destination: t.resultsList && t.resultsList.destination ? t.resultsList.destination : i(this.selector),
          position: t.resultsList && t.resultsList.position ? t.resultsList.position : "afterend",
          element: t.resultsList && t.resultsList.element ? t.resultsList.element : "ul"
        }) : null,
        navigation: !(!t.resultsList || !t.resultsList.navigation) && t.resultsList.navigation
      }, this.sort = t.sort || !1, this.placeHolder = t.placeHolder, this.maxResults = t.maxResults || 5, this.resultItem = {
        content: !(!t.resultItem || !t.resultItem.content) && t.resultItem.content,
        element: t.resultItem && t.resultItem.element ? t.resultItem.element : "li"
      }, this.noResults = t.noResults, this.highlight = t.highlight || !1, this.onSelection = t.onSelection, this.init();
    }

    return function (t, e, n) {
      e && s(t.prototype, e), n && s(t, n);
    }(e, [{
      key: "search",
      value: function value(t, e) {
        var n = e.toLowerCase();

        if ("loose" === this.searchEngine) {
          t = t.replace(/ /g, "");

          for (var s = [], i = 0, r = 0; r < n.length; r++) {
            var o = e[r];
            i < t.length && n[r] === t[i] && (o = this.highlight ? h(o) : o, i++), s.push(o);
          }

          return i === t.length && s.join("");
        }

        if (n.includes(t)) return t = new RegExp("".concat(t), "i").exec(e), this.highlight ? e.replace(t, h(t)) : e;
      }
    }, {
      key: "listMatchedResults",
      value: function value(n, s) {
        var u = this;
        return new Promise(function (t) {
          var l = [];
          n.filter(function (s, i) {
            function t(t) {
              var e = t ? s[t] : s;

              if (e) {
                var n = "function" == typeof u.searchEngine ? u.searchEngine(u.queryValue, e) : u.search(u.queryValue, e);
                n && t ? l.push({
                  key: t,
                  index: i,
                  match: n,
                  value: s
                }) : n && !t && l.push({
                  index: i,
                  match: n,
                  value: s
                });
              }
            }

            if (u.data.key) {
              var e = !0,
                  n = !1,
                  r = void 0;

              try {
                for (var o, a = u.data.key[Symbol.iterator](); !(e = (o = a.next()).done); e = !0) {
                  t(o.value);
                }
              } catch (t) {
                n = !0, r = t;
              } finally {
                try {
                  e || null == a["return"] || a["return"]();
                } finally {
                  if (n) throw r;
                }
              }
            } else t();
          });
          var e = u.sort ? l.sort(u.sort).slice(0, u.maxResults) : l.slice(0, u.maxResults);
          return u.resultsList.render && (o(u.resultsList.view, e, u.resultItem), u.resultsList.navigation ? u.resultsList.navigation(s, u.resultsList.view, i(u.selector)) : d(u.selector, u.resultsList.view, u.resultsList.shadowRoot)), t({
            matches: l.length,
            list: e
          });
        });
      }
    }, {
      key: "ignite",
      value: function value() {
        var o = this,
            a = i(this.selector);
        this.placeHolder && a.setAttribute("placeholder", this.placeHolder);

        function n(e) {
          function n(t, e) {
            a.dispatchEvent(new p.CustomEventWrapper("autoComplete", {
              bubbles: !0,
              detail: {
                event: t,
                input: s,
                query: i,
                matches: e ? e.matches : null,
                results: e ? e.list : null
              },
              cancelable: !0
            }));
          }

          var s = _instanceof(a, HTMLInputElement) ? a.value.toLowerCase() : a.innerHTML.toLowerCase(),
              i = o.queryValue = o.query && o.query.manipulate ? o.query.manipulate(s) : s,
              t = o.resultsList.render,
              r = o.trigger.condition || i.length > o.threshold && i.replace(/ /g, "").length;

          if (t) {
            f(o.resultsList.view);
            r ? o.listMatchedResults(o.dataStream, e).then(function (t) {
              n(e, t), 0 === t.list.length && o.noResults && o.resultsList.render ? o.noResults() : o.onSelection && m(o.selector, o.resultsList.view, o.onSelection, t);
            }) : n(e);
          } else !t && r ? o.listMatchedResults(o.dataStream, e).then(function (t) {
            n(e, t);
          }) : n(e);
        }

        this.trigger.event.forEach(function (t) {
          a.addEventListener(t, function (n, s) {
            var i;
            return function () {
              var t = this,
                  e = arguments;
              clearTimeout(i), i = setTimeout(function () {
                return n.apply(t, e);
              }, s);
            };
          }(function (t) {
            return function (e) {
              o.data.cache ? n(e) : o.dataType ? o.dataStream.then(function (t) {
                o.dataStream = t, n(e);
              }) : (o.dataStream = o.dataStream, n(e));
            }(t);
          }, o.debounce));
        });
      }
    }, {
      key: "init",
      value: function value() {
        var e = this;
        this.dataStream = this.data.src(), this.dataType = _instanceof(this.dataStream, Promise), this.dataType ? this.dataStream.then(function (t) {
          e.dataStream = t, e.ignite();
        }) : (this.dataStream = this.dataStream, this.ignite()), p.initElementClosestPolyfill();
      }
    }]), e;
  }();
}, "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.autoComplete = b();