$(document).ready(function() {

  module("Backbone.Controller");

  var Controller = Backbone.Controller.extend({

    routes: {
      "search/:query":              "search",
      "search/:query/p:page":       "search",
      "splat/*args/end":            "splat",
      "*first/complex-:part/*rest": "complex",
      ":entity?*args":              "query",
      "*anything":                  "anything"
    },

    initialize : function(options) {
      this.testing = options.testing;
    },

    search : function(query, page) {
      this.query = query;
      this.page = page;
    },

    splat : function(args) {
      this.args = args;
    },

    complex : function(first, part, rest) {
      this.first = first;
      this.part = part;
      this.rest = rest;
    },

    query : function(entity, args) {
      this.entity    = entity;
      this.queryArgs = args;
    },

    anything : function(whatever) {
      this.anything = whatever;
    }

  });

  var controller = new Controller({testing: 101});

  Backbone.history.interval = 9;
  Backbone.history.start();

  test("Controller: initialize", function() {
    equals(controller.testing, 101);
  });

  asyncTest("Controller: routes (simple)", 2, function() {
    window.location.hash = 'search/news';
    setTimeout(function() {
      equals(controller.query, 'news');
      equals(controller.page, undefined);
      start();
    }, 10);
  });

  asyncTest("Controller: routes (two part)", 2, function() {
    window.location.hash = 'search/nyc/p10';
    setTimeout(function() {
      equals(controller.query, 'nyc');
      equals(controller.page, '10');
      start();
    }, 10);
  });

  asyncTest("Controller: routes (splats)", function() {
    window.location.hash = 'splat/long-list/of/splatted_99args/end';
    setTimeout(function() {
      equals(controller.args, 'long-list/of/splatted_99args');
      start();
    }, 10);
  });

  asyncTest("Controller: routes (complex)", 3, function() {
    window.location.hash = 'one/two/three/complex-part/four/five/six/seven';
    setTimeout(function() {
      equals(controller.first, 'one/two/three');
      equals(controller.part, 'part');
      equals(controller.rest, 'four/five/six/seven');
      start();
    }, 10);
  });

  asyncTest("Controller: routes (query)", 2, function() {
    window.location.hash = 'mandel?a=b&c=d';
    setTimeout(function() {
      equals(controller.entity, 'mandel');
      equals(controller.queryArgs, 'a=b&c=d');
      start();
    }, 10);
  });

  asyncTest("Controller: routes (anything)", 1, function() {
    window.location.hash = 'doesnt-match-a-route';
    setTimeout(function() {
      equals(controller.anything, 'doesnt-match-a-route');
      start();
      window.location.hash = '';
    }, 10);
  });

  asyncTest("Controller: routes (hashbang)", 2, function() {
    window.location.hash = '!search/news';
    setTimeout(function() {
      equals(controller.query, 'news');
      equals(controller.page, undefined);
      start();
    }, 10);
  });

});
