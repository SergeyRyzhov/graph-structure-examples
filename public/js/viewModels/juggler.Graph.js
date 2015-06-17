///Model for graph visualization via vis.js

(function (app, $) {
  ko.components.register('juggler-graph', {
    viewModel: function (params) {
      params = params || {
        nodes: [1, 2, 3, 4, 5],
        edges: [
          [1, 2],
          [3, 4],
          [5, 2],
          [3, 5],
          [1, 4],
          [1, 3],
          [2, 3],
          [1, 5]
        ]
      };

      var nodes = params.nodes,
        edges = params.edges,
        orgraph = params.orgraph,
        labels = params.labels,
        colors = params.colors;

      this.nodes = ko.observable(nodes);
      this.edges = ko.observable(edges);
      this.orgraph = ko.observable(orgraph);
      this.labels = ko.observable(labels);
      this.colors = ko.observable(colors);
      this.network = ko.observable();
    },
    template: {
      fromUrl: 'graph.html',
      maxCacheAge: 60000
    }
  });


  function graphBinding(element, valueAccessor, allBindings, viewModel,
    bindingContext) {

    var params = ko.utils.unwrapObservable(valueAccessor());

    function nodesToObjects(nodes, labels, colors) {
      var colorsRaw = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
        'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
        'silver', 'teal', 'white', 'yellow'];

      nodes = ko.utils.unwrapObservable(nodes);
      return _.map(nodes, function (node) {

        var nodeObj = {
          id: node,
          font: '18px verdana blue'
        };

        nodeObj.label = labels && labels[node] ? (node + '(' + labels[node] + ')') : node;
        var color;
        colors && colors[node] && (color = Math.floor((colors[node] / colors.length) * 255));
        colors && colors[node] && (nodeObj.color = 'rgba(' + color + ',' + color + ',' + 0 + ', 0.7)');
        return nodeObj;
      });
    }

    function edgesToObjects(edges, orgraph) {
      edges = ko.utils.unwrapObservable(edges);
      return _.map(edges, function (edge) {
        var edgeObj = {
          from: edge[0],
          to: edge[1]
        };

        if (orgraph) {
          edgeObj.arrows = 'to';
        }

        return edgeObj;
      });
    }

    var data = {};
    data = {
      nodes: nodesToObjects(params.nodes, ko.utils.unwrapObservable(params.labels), ko.utils.unwrapObservable(params.colors)),
      edges: edgesToObjects(params.edges, params.orgraph)
    };

    var options = {
      width: element.clientWidth + 'px',
      height: element.clientHeight + 'px',
      // manipulation: true,
      // interaction: {
      //   keyboard: true
      // }
    };

    if (params.network()) {
      params.network().destroy();
    }

    params.network(new vis.Network(element, data, options));
  }

  ko.bindingHandlers.graph = {
    // init: graphBinding,
    update: graphBinding
  };

})(window.juggler = window.juggler || {}, jQuery);
