/* Copyright start
  MIT License
  Copyright (c) 2023 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('socOverviewSankey100Ctrl', socOverviewSankey100Ctrl);

  socOverviewSankey100Ctrl.$inject = ['$scope', 'config', '$http', '$q', 'Query', 'API', '_', 'currentDateMinusService'];

  function socOverviewSankey100Ctrl($scope, config, $http, $q, Query, API, _, currentDateMinusService) {

    $scope.config = config;
    var sankey;
    var chartData = {};
    var nodes = [];
    var links = [];
    var nodeColorMap = {};
    $scope.duration = 7;	// Default duration
    $scope.config.buttons = [{
      id: 'btn-7d',
      text: 'Last 7 Days',
      onClick: function () {
        refreshSankey(7, 'btn-7d');
      },
      active: true,
      type: 'submit'
    }, {
      id: 'btn-1d',
      text: 'Last 1 Day',
      onClick: function () {
        refreshSankey(1, 'btn-1d');
      },
      active: false,
      type: 'submit'
    }, {
      id: 'btn-1h',
      text: 'Last 1 Hour',
      onClick: function () {
        refreshSankey(0.0417, 'btn-1h');
      },
      active: false,
      type: 'submit'
    }];

    function cleanChartData() {
      nodes = [];
      links = [];
      chartData = {};
      nodeColorMap = {};
    }

    function getFilters() {
      let frontFilter = {};
      frontFilter.logic = 'AND';
      frontFilter.filters = [{
        field: 'createDate',
        operator: 'gte',
        value: currentDateMinusService($scope.duration),
        type: 'datetime'
      }];

      let dataFilters = $scope.config.filters ? angular.copy($scope.config.filters) : {};
      if (dataFilters.filters) {
        dataFilters.filters.push(frontFilter);
      } else {
        dataFilters = frontFilter;
      }

      return dataFilters;
    }

    // Refresh Sankey Chart
    function refreshSankey(duration) {
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
      fetchData();
    }

    // Load External JS Files
    function loadJs(jsPath) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = jsPath;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    function fetchData() {
      getResourceAggregate().then(function (result) {
        if (result && result['hydra:member'] && result['hydra:member'].length > 0) {
          let idIndex = 1;
          let nodesMap = {};
          // Form JSON Data
          const sourceNodes = _.filter(_.map(result['hydra:member'], item => item.source), (item, index, arr) => item !== null && arr.indexOf(item) == index);
          const resourceNodes = _.filter(_.map(result['hydra:member'], item => item.target), (item, index, arr) => item !== null && arr.indexOf(item) == index);
          const relationNodes = _.filter(_.map(result['hydra:member'], item => item.relation), (item, index, arr) => item !== null && arr.indexOf(item) == index);
          sourceNodes.forEach(node => {
            nodesMap['s_' + node] = idIndex;
            nodes.push({
              "name": node,
              "id": idIndex++
            });
          });
          resourceNodes.forEach(node => {
            nodesMap['t_' + node] = idIndex;
            nodes.push({
              "name": node,
              "id": idIndex++
            });
          });
          relationNodes.forEach(node => {
            nodesMap['r_' + node] = idIndex;
            nodes.push({
              "name": node,
              "id": idIndex++
            });
          });

          // Color Mapping
          result['hydra:member'].forEach(item => {
            if (item.targetColor) {
              nodeColorMap[item.target] = item.targetColor;
            }
            if (item.relationColor) {
              nodeColorMap[item.relation] = item.relationColor;
            }
          });
          nodes.forEach(node => {
            if (nodeColorMap[node.name]) {
              node.color = nodeColorMap[node.name];
            }
          });

          // Append input JSON data for Source/External Json nodes
          // ToDo: Add API call to fetch JSON data in global variable, if API fail, then accept data from JSON field
          let sourceData = $scope.config.sourceJson;
          if (sourceData.nodes && sourceData.nodes.length > 0) {
            sourceData.nodes.forEach(node => {
              nodesMap['o_' + node.name] = idIndex;
              let nodeData = {
                "name": node.name,
                "id": idIndex++
              };
              if (node.color) {
                nodeColorMap[node.name] = node.color;
                nodeData.color = node.color;
              }
              nodes.push(nodeData);
            });
          }
          
          // Formation of link data
          idIndex = 1;
          // Link data for Source/External Json nodes
          if (sourceData.links && sourceData.links.length > 0) {
            sourceData.links.forEach(link => {
              let id = idIndex;
              if (link.source && link.target && nodesMap['s_' + link.target]) {
                let linkData = {
                  "source": nodesMap['o_' + link.source],
                  "target": nodesMap['s_' + link.target],
                  "value": link.total,
                  "id": id
                };
                // Will not have any color for source, so below part is not required, color will be picked from scale
                /* if (nodeColorMap[link.target]) {
                  linkData.color = nodeColorMap[link.target];
                }*/
                links.push(linkData);
                idIndex++;
              }
            });
          }

          // Append link data for API response
          result['hydra:member'].forEach(link => {
            let id = idIndex;
            if (link.source && link.target) {
              let linkIndex = _.findIndex(links, (obj => obj.source === nodesMap['s_' + link.source] && obj.target === nodesMap['t_' + link.target]));
              if (linkIndex !== -1) {
                links[linkIndex].value = links[linkIndex].value + link.total;
              } else {
                let linkData = {
                  "source": nodesMap['s_' + link.source],
                  "target": nodesMap['t_' + link.target],
                  "value": link.total,
                  "id": id
                };
                if (nodeColorMap[link.target]) {
                  linkData.color = nodeColorMap[link.target];
                }
                links.push(linkData);
              }
            }
            if (link.target && link.relation) {
              let linkData = {
                "source": nodesMap['t_' + link.target],
                "target": nodesMap['r_' + link.relation],
                "value": link.total,
                "id": id
              };
              if (nodeColorMap[link.target]) {
                linkData.color = nodeColorMap[link.relation];
              }
              links.push(linkData);
            }
            idIndex++;
          });
          
          chartData.nodes = nodes;
          chartData.links = links;

          renderSankeyChart();
        }
      });
    }

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
          },
          {
            'operator': 'groupby',
            'alias': 'source',
            'field': $scope.config.sourceNodesField
          },
          {
            'operator': 'groupby',
            'alias': 'target',
            'field': $scope.config.targetNodesField + '.itemValue'
          },
          {
            'operator': 'groupby',
            'alias': 'relation',
            'field': $scope.config.relation + '.' + $scope.config.relationshipNodesField + '.itemValue'
          },
          {
            'operator': 'groupby',
            'alias': 'targetColor',
            'field': $scope.config.targetNodesField + '.color'
          },
          {
            'operator': 'groupby',
            'alias': 'relationColor',
            'field': $scope.config.relation + '.' + $scope.config.relationshipNodesField + '.color'
          }
        ],
        relationship: true,
        filters: [dataFilters]
      };
      var _queryObj = new Query(queryObject);
      $http.post(API.QUERY + $scope.config.resource, _queryObj.getQuery(true)).then(function (response) {
        defer.resolve(response.data);
      }, function (error) {
        defer.reject(error);
      });

      return defer.promise;
    }

    function renderSankeyChart() {
      const width = angular.element(document.querySelector('#sankeyChart-' + $scope.config.wid))[0].clientWidth;
      const height = width > 1000 ? 800 : 600;
      const isExternalJsonData = $scope.config.sourceJson.nodes && $scope.config.sourceJson.links && $scope.config.sourceJson.nodes.length > 0 && $scope.config.sourceJson.links.length > 0;
      const linkColumnWidth = isExternalJsonData ? 48 : 36; // 12 * no of node columns
      const noOfLinksColumn = isExternalJsonData ? 3 : 2;
      const rectWidth = ((width - 150) - linkColumnWidth) / noOfLinksColumn;
      const gradientLeft = $rootScope.theme.id === 'light' ? '#ffffff' : 'grey';
      const gradientRight = $rootScope.theme.id === 'light' ? '#bbbbbb' : 'black'; // #bbbbbb
      const backgroundStroke = $rootScope.theme.id === 'light' ? '#bbbbbb' : '#808080';
      const backgroundTitle = $rootScope.theme.id === 'light' ? '#000000' : 'grey';
      const textColor = $rootScope.theme.id === 'light' ? '#000000' : '#ffffff';
      let backgroundRect = [];
      if (isExternalJsonData) {
        backgroundRect = [{
          'name': 'SOURCE',
          'xPoint': 1,
          'index': 0,
          'width': 150
        },
        {
          'name': 'EVENTS',
          'xPoint': 162,
          'index': 1,
          'width': rectWidth
        },
        {
          'name': $scope.config.resource.toUpperCase(),
          'index': 2,
          'width': rectWidth
        },
        {
          'name': $scope.config.relation.toUpperCase(),
          'index': 3,
          'width': rectWidth
        }
        ];
      } else {
        backgroundRect = [{
          'name': 'EVENTS',
          'xPoint': 1,
          'index': 0,
          'width': 150
        },
        {
          'name': $scope.config.resource.toUpperCase(),
          'xPoint': 162,
          'index': 1,
          'width': rectWidth
        },
        {
          'name': $scope.config.relation.toUpperCase(),
          'index': 2,
          'width': rectWidth
        }
        ];
      }

      // const rectWidth = ((width - 150) - (12 * backgroundRect.length)) / (backgroundRect.length - 1);
      sankey = d3.sankey()
        // .nodeSort((a, b) => a.id - b.id)
        .nodeId(d => d.id)
        .linkSort(null)
        .nodeWidth(12)
        .nodePadding(10)
        .extent([[150, 70], [width, height - 20]]);

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
        .attr("x", d => d.x0 - 15) // d.x0 - 6)// 
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

    function _init() {
      loadJs('https://cdnjs.cloudflare.com/ajax/libs/d3-sankey/0.12.3/d3-sankey.min.js');
      fetchData();
    }

    _init();
  }
})();
