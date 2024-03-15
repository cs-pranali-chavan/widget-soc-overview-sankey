/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('socOverviewSankey200Ctrl', socOverviewSankey200Ctrl);

  socOverviewSankey200Ctrl.$inject = ['$scope', '$rootScope', 'config', '$http', '$q', 'Query', 'API', '_', 'currentDateMinusService', 'PagedCollection', 'widgetUtilityService'];

  function socOverviewSankey200Ctrl($scope, $rootScope, config, $http, $q, Query, API, _, currentDateMinusService, PagedCollection, widgetUtilityService) {

    var sankey;
    var chartData = {};
    var nodes = [];
    var links = [];
    var nodeColorMap = [];
    var noOfSeries = 0;
    var backgroundArea = [];
    var fileLoadDefer = $q.defer();
    $scope.config = config;
    $scope.moduleType = $scope.config.moduleType;
    $scope.processing = false;
    $scope.duration = 90;	// Default duration
    $scope.config.buttons = [{
      id: 'btn-6m',
      text: 'BUTTON_LAST_6_MONTHS',
      onClick: function () {
        refreshSankey(90, 'btn-6m');
      },
      active: true,
      type: 'submit'
    }, {
      id: 'btn-3m',
      text: 'BUTTON_LAST_3_MONTHS',
      onClick: function () {
        refreshSankey(60, 'btn-3m');
      },
      active: false,
      type: 'submit'
    }, {
      id: 'btn-30d',
      text: 'BUTTON_LAST_30_DAYS',
      onClick: function () {
        refreshSankey(30, 'btn-30d');
      },
      active: false,
      type: 'submit'
    }];

    function cleanChartData() {
      nodes = [];
      links = [];
      chartData = {};
      nodeColorMap = [];
    }

    function getFilters() {
      let frontFilter = {};
      frontFilter.logic = 'AND';
      if (config.entityTrackable) {
        frontFilter.filters = [{
          field: 'createDate',
          operator: 'gte',
          value: currentDateMinusService($scope.duration),
          type: 'datetime'
        }];
      }

      let dataFilters = $scope.config.filters ? angular.copy($scope.config.filters) : {};
      if (dataFilters.filters) {
        dataFilters.filters.push(frontFilter);
      } else {
        dataFilters = frontFilter;
      }

      return dataFilters;
    }

    // Refresh Sankey Chart
    function refreshSankey(duration, id) {
      $scope.duration = duration;
      // Handling button active property
      $scope.config.buttons.forEach(button => {
        if (button.id === id) {
          button.active = true;
        } else {
          button.active = false;
        }
      });
      cleanChartData();
      if ($scope.config.moduleType === 'Across Modules') {
        fetchData();
      }
      else {
        populateCustomData();
      }
    }

    // Load External JS Files
    function loadJs(jsPath) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = jsPath;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    //fetch live data
    function fetchData() {
      getResourceAggregate().then(function (result) {
        $scope.processing = false;
        if (result && result['hydra:member'] && result['hydra:member'].length > 0) {
          let dataToPlot = result['hydra:member'];
          createDataToPlot(dataToPlot);
        } else {
          renderNoRecordMessage('No records found !');
        }
      }, function (error) {
        $scope.processing = false;
        renderNoRecordMessage('No records found !');
      }).finally(function () {
        $scope.processing = false;
      });
    }

    //create nodes and links data required to plot on Sankey chart
    function createDataToPlot(dataToPlot) {
      let idIndex = 0;
      let nodesMap = [];
      let seriesArray = [];
      noOfSeries = $scope.config.layers.length + 1;
      let seriesNameArray = [];
      backgroundArea = [];
      var replacedArray = _.map(dataToPlot, function (obj) {
        return _.mapObject(obj, function (value, key) {
          return value === null ? "Unknown" : value;
        });
      });
      dataToPlot = replacedArray;
      // Form JSON Data
      for (var i = 0; i < noOfSeries; i++) {
        seriesNameArray.push(['series_' + i]);
        seriesArray.push(_.filter(_.map(dataToPlot, item => item['series_' + i]), (item, index, arr) => item !== null && arr.indexOf(item) == index));
      };
      seriesArray.forEach((element, s) => {
        if (element.length > 0) {
          if ($scope.config.moduleType === 'Across Modules' && $scope.config.layers[s]) {
            backgroundArea.push({ 'label': $scope.config.layers[s]['label'] });
          }
          else {
            if (s < (seriesArray.length - 1)) {
              backgroundArea.push({ 'label': seriesNameArray[s] });
            }
          }
          element.forEach((node, i) => {
            nodesMap.push({
              'name': node + '_' + s,
              'idIndex': idIndex
            });
            nodes.push({
              "name": node,
              "id": idIndex++
            });
          });
        }
      });
      dataToPlot.forEach((item, index) => {
        for (let c = 0; c < seriesNameArray.length; c++) {
          if (item[seriesNameArray[c] + '_color'] !== 'Unknown') {
            nodeColorMap[item[seriesNameArray[c]]] = item[seriesNameArray[c] + '_color'];
          }
          else {
            nodeColorMap[item[seriesNameArray[c]]] = getRandomColor();
          }
        }
      });
      nodes.forEach(node => {
        if (nodeColorMap[node.name]) {
          node.color = nodeColorMap[node.name];
        }
      });
      //fetchJSONData();
      // Append input JSON data for Source/External Json nodes
      // ToDo: Add API call to fetch JSON data in global variable, if API fail, then accept data from JSON field

      // create nodes and links data as per the dynamic series generated data
      dataToPlot.forEach((link, index) => {
        for (let c = 0; c < seriesNameArray.length; c++) {
          if (link[seriesNameArray[c]] && link[seriesNameArray[c + 1]]) {
            let linkData = {
              "source": _.filter(nodesMap, { 'name': link[seriesNameArray[c]] + '_' + c })[0]['idIndex'],
              "target": _.filter(nodesMap, { 'name': link[seriesNameArray[c + 1]] + '_' + (c + 1) })[0]['idIndex'],
              "value": link.total,
              "id": index
            };
            if (nodeColorMap[link[seriesNameArray[c]]]) {
              linkData.color = nodeColorMap[link[seriesNameArray[c + 1]]];
            }
            links.push(linkData);
          }
        }
      });

      if (nodes.length > 0 && links.length > 0) {
        chartData.nodes = nodes;
        chartData.links = links;
        renderSankeyChart();
      } else {
        renderNoRecordMessage('Nodes and Links not created by the given data')
      }

    }

    //to populate data for custom module
    function populateCustomData() {
      var filters = {
        query: $scope.config.query
      };
      var pagedTotalData = new PagedCollection($scope.config.customModule, null, null);
      pagedTotalData.loadByPost(filters).then(function () {
        if (pagedTotalData.fieldRows.length === 0) {

          return;
        }
        var data = pagedTotalData.fieldRows[0][$scope.config.customModuleField].value;
        if (!data) {
          data = {};
        } else {
          $scope.processing = false;
          chartData = data['data'];
          createDataToPlot(chartData);
        }
      })
    }

    //API payload
    function getResourceAggregate() {
      var defer = $q.defer();
      var dataFilters = getFilters();
      var queryObject = {
        sort: [{
          field: 'total',
          direction: 'DESC'
        }],
        aggregates: [
          {
            'operator': 'countdistinct',
            'field': '*',
            'alias': 'total'
          }
        ],
        relationship: true,
        filters: [dataFilters]
      };
      var elementIndex = 0;
      for (var i = 0; i < config.layers.length; i++) {
        let currentLayer = config.layers[i];
        //if - else to check if it is the 1st layer or not
        if (currentLayer['sourceNodesField'] !== '') {
          queryObject.aggregates.push({
            'operator': 'groupby',
            'alias': 'series_' + elementIndex,
            'field': currentLayer['sourceNodesField']
          });
          if (currentLayer['targetNodeSubField'] === '') {
            elementIndex++;
            pushTargetNodes(queryObject, elementIndex, currentLayer);
          } else {
            elementIndex++;
            pushTargetSubNodes(queryObject, elementIndex, currentLayer);
          }
        } else {
          //var prev = i-1;
          elementIndex++;
          if (currentLayer['targetNodeSubField'] === '') {
            pushTargetNodes(queryObject, elementIndex, currentLayer);
          } else {
            pushTargetSubNodes(queryObject, elementIndex, currentLayer);
          }
        }
      };

      var _queryObj = new Query(queryObject);
      $http.post(API.QUERY + $scope.config.resource, _queryObj.getQuery(true)).then(function (response) {
        defer.resolve(response.data);
      }, function (error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function pushTargetNodes(queryObject, elementIndex, currentLayer) {
      queryObject.aggregates.push({
        'operator': 'groupby',
        'alias': 'series_' + elementIndex,
        'field': currentLayer['targetNodeType'] === 'picklist' || currentLayer['targetNodeType'] === 'manyToMany' ? currentLayer['targetNodeField'] + '.itemValue' : currentLayer['targetNodeField']
      });
      if (currentLayer['targetNodeType'] === 'picklist' || currentLayer['targetNodeType'] === 'manyToMany') {
        queryObject.aggregates.push({
          'operator': 'groupby',
          'alias': 'series_' + elementIndex + '_color',
          'field': currentLayer['targetNodeField'] + '.color'
        });
      }

    }

    function pushTargetSubNodes(queryObject, elementIndex, currentLayer) {
      queryObject.aggregates.push({
        'operator': 'groupby',
        'alias': 'series_' + elementIndex,
        'field': currentLayer['targetNodeType'] === 'picklist' || currentLayer['targetNodeType'] === 'manyToMany' ? currentLayer['targetNodeField'] + '.' + currentLayer['targetNodeSubField'] + '.itemValue' : currentLayer['targetNodeSubField']
      });
      if (currentLayer['targetNodeType'] === 'picklist' || currentLayer['targetNodeType'] === 'manyToMany') {
        queryObject.aggregates.push({
          'operator': 'groupby',
          'alias': 'series_' + elementIndex + '_color',
          'field': currentLayer['targetNodeField'] + '.' + currentLayer['targetNodeSubField'] + '.color'
        });
      }
    }

    //render text if no data found or nodes and links are not formed by the fetched data
    function renderNoRecordMessage(textMessage) {
      const width = angular.element(document.querySelector('#sankeyChart-' + $scope.config.wid))[0].clientWidth;
      const height = 50;
      const backgroundColor = $rootScope.theme.id === 'light' ? '#f2f2f3' : $rootScope.theme.id === 'dark' ? '#1d1d1d' : '#212c3a';
      const textColor = $rootScope.theme.id === 'light' ? '#000000' : '#ffffff';
      const strokeColor = $rootScope.theme.id === 'light' ? '#e4e4e4' : '#000000';
      d3.select('#sankeyChart-' + $scope.config.wid).selectAll('svg').remove();

      const svg = d3.selectAll('#sankeyChart-' + $scope.config.wid)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Display message and return if no records found
      svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 4)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', strokeColor)
        .attr('fill', backgroundColor);

      svg.append('text')
        .text(textMessage)
        .attr('x', 20)
        .attr('y', 30)
        .attr('font-size', 16)
        .attr('text-anchor', 'start')
        .attr('text-height', 20)
        .attr('fill', textColor);
    }

    //draw Sankey using d3
    function renderSankeyChart() {
      const width = angular.element(document.querySelector('#sankeyChart-' + $scope.config.wid))[0].clientWidth;
      const height = width > 1000 ? 800 : 600;
      var xPoint = 50;
      const noOfLinksColumn = backgroundArea.length;
      const rectWidth = (width - (xPoint + (12 * noOfLinksColumn))) / noOfLinksColumn;
      const gradientLeft = $rootScope.theme.id === 'light' ? '#ffffff' : 'grey';
      const gradientRight = $rootScope.theme.id === 'light' ? '#bbbbbb' : 'black'; // #bbbbbb
      const backgroundStroke = $rootScope.theme.id === 'light' ? '#bbbbbb' : '#808080';
      const backgroundTitle = $rootScope.theme.id === 'light' ? '#000000' : 'grey';
      const textColor = $rootScope.theme.id === 'light' ? '#000000' : '#ffffff';
      let backgroundRect = [];

      //to draw rectangular background
      backgroundArea.forEach(function (element, index) {
        if (index > 0) {
          xPoint = xPoint + (rectWidth) + (12);
        }
        backgroundRect.push({
          'name': element.label,
          'xPoint': xPoint,
          'index': index,
          'width': rectWidth
        });
      });

      // const rectWidth = ((width - 150) - (12 * backgroundRect.length)) / (backgroundRect.length - 1);
      sankey = d3.sankey()
        .nodeSort((a, b) => a.id - b.id)
        .nodeId(d => d.id)
        .linkSort(null)
        .nodeAlign(d3.sankeyLeft) // Align node to the left, default is d3.sankeyJustify. Nodes without any outgoing links are moved as left as possible.
        .nodeWidth(12)
        .nodePadding(10)
        .extent([[38, 70], [width, height - 20]]);

      d3.select('#sankeyChart-' + $scope.config.wid).selectAll('svg').remove();
      const svg = d3.selectAll('#sankeyChart-' + $scope.config.wid)
        .append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height + 20])
        .on('mouseout', () => {
          d3.selectAll(`path`)
            .attr('stroke-opacity', 0.4); // 0.4
        });

      const { nodes, links } = sankey({
        nodes: chartData.nodes.map(d => Object.assign({}, d)),
        links: chartData.links.map(d => Object.assign({}, d))
      });

      // Gradient Color for fill
      var defs = svg.append('defs');

      var gradient = defs.append('linearGradient')
        .attr('id', 'svgGradient')
        .attr('x1', '0%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('class', 'start')
        .attr('offset', '0%')
        .attr('stop-color', gradientLeft)
        .attr('stop-opacity', 1);

      gradient.append('stop')
        .attr('class', 'end')
        .attr('offset', '100%')
        .attr('stop-color', gradientRight)
        .attr('stop-opacity', 1);

      // If color is not provided as a part of data, then scale will be used
      var colorScale = d3.scaleLinear()
        .domain([0, chartData.nodes.length])
        .range(['#00B9FA', '#F95002'])
        .interpolate(d3.interpolateHcl);

      // Rendering Background Rectangles with gradient
      const backRect = svg.append("g")
        .selectAll("rect")
        .data(backgroundRect)
        .enter();

      backRect.append("rect")
        .attr("x", d => d.xPoint ? d.xPoint : (150 + (d.index * 12) + ((d.index - 1) * rectWidth)))
        .attr("y", 0)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", d => d.width ? d.width : rectWidth)
        .attr("height", height)
        .attr("fill", "url(#svgGradient)")
        .attr("fill-opacity", 0.6)
        .attr('stroke', backgroundStroke)
        .append("title")
        .text(d => `${d.name}`);

      backRect.append('text')
        .attr("x", d => {
          if (d.xPoint) {
            return (d.xPoint + (d.width / 2));
          } else {
            return ((150 + (d.index * 12) + ((d.index - 1) * rectWidth)) + (rectWidth / 2));
          }
        })
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-variant", "all-small-caps")
        .attr("fill", backgroundTitle)
        .text(d => d.name);

      // Rendering Nodes
      svg.append("g")
        .selectAll("rect")
        .data(nodes)
        .enter().append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr('stroke', '#808080')
        .attr("fill", d => {
          if (d.color) {
            return d.color;
          } else {
            for (var i = 0; i < chartData.nodes.length; i++) {
              if (d.name === chartData.nodes[i].name) {
                return d3.rgb(colorScale(i));
              }
            }
          }
        })
        .on('mouseover', (d) => {
          d.sourceLinks.forEach(e => {
            d3.selectAll(`path.trajectory_${e.id}`)
              .attr('stroke-opacity', 0.8); // 0.8
          });

          d.targetLinks.forEach(e => {
            d3.selectAll(`path.trajectory_${e.id}`)
              .attr('stroke-opacity', 0.8); // 0.8
          });
        })
        .on('mouseout', d => {
          d.sourceLinks.forEach(e => {
            d3.selectAll(`path.trajectory_${e.id}`)
              .attr('stroke-opacity', 0.4); // 0.4
          })
        })
        .append("title")
        .text(d => `${d.name}: ${d.value}`);

      // Rendering Links
      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 1) // 0.8
        .selectAll("g")
        .data(links)
        .enter().append('g');

      link.append("path")
        .attr('class', d => `trajectory_${d.id}`)
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => d.color ? d.color : d3.schemeSet1[4])
        .attr('stroke-opacity', 0.2) // 0.2
        .attr("stroke-width", d => Math.max(1, d.width));

      link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

      // Node text and value rendering
      svg.append("g")
        .style("font", "11px sans-serif")
        .selectAll("text")
        .data(nodes)
        .enter().append('text')
        .attr("x", d => d.x0 - 2) // d.x0 - 6)// 
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("dy", "0.4em")
        .attr("text-anchor", "end")
        .attr("fill", textColor)
        .text(d => d.name)
        .append('tspan')
        .attr('dy', 12)
        .attr('x', d => d.x0 - 15)
        .attr("fill", textColor)
        .attr('font-size', '9px sans-serif')
        .text(d => d.value);
    }

    function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // Load External JS Files
    function loadJs(filePath) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = filePath;
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = function () {
        fileLoadDefer.resolve();
      }
      return fileLoadDefer.promise;
    }

    //to handle i18n 
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
          BUTTON_LAST_6_MONTHS: widgetUtilityService.translate('checkTranslation.BUTTON_LAST_6_MONTHS'),
          BUTTON_LAST_3_MONTHS: widgetUtilityService.translate('checkTranslation.BUTTON_LAST_3_MONTHS'),
          BUTTON_LAST_30_DAYS: widgetUtilityService.translate('checkTranslation.BUTTON_LAST_30_DAYS')
        };
      });
    }

    function _init() {
      $scope.processing = true;
      _handleTranslations();
      loadJs('https://cdnjs.cloudflare.com/ajax/libs/d3-sankey/0.12.3/d3-sankey.min.js').then(function () {
        if ($scope.config.moduleType === 'Across Modules') {
          refreshSankey(90, 'btn-6m');
        }
        else {
          cleanChartData();
          populateCustomData();
        }
      });
    }

    _init();
  }
})();
