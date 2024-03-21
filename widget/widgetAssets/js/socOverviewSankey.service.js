/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
  'use strict';

  (function () {
      angular
          .module('cybersponse')
          .factory('socOverviewSankeyService', socOverviewSankeyService);
  
      socOverviewSankeyService.$inject = ['$q', '$http', 'currentDateMinusService', 'Query', 'API'];
  
      function socOverviewSankeyService($q, $http, currentDateMinusService, Query, API) {
          var service;
          var config;
  
          service = {
              getResourceAggregate: getResourceAggregate,
              loadJs: loadJs,
              getRandomDarkColor: getRandomDarkColor
          };
  
          // Load External JS Files
          function loadJs(filePath) {
              var fileLoadDefer = $q.defer();
              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = filePath;
              document.getElementsByTagName('head')[0].appendChild(script);
              script.onload = function () {
                  fileLoadDefer.resolve();
              }
              return fileLoadDefer.promise;
          }
  
          //API payload
          function getResourceAggregate(_config, _duration) {
              config = _config;
              var duration = _duration;
              var defer = $q.defer();
              var dataFilters = getFilters(duration);
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
              $http.post(API.QUERY + config.resource, _queryObj.getQuery(true)).then(function (response) {
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
  
  
          function getFilters(duration) {
              let frontFilter = {};
              frontFilter.logic = 'AND';
              if (config.entityTrackable) {
                  frontFilter.filters = [{
                      field: 'createDate',
                      operator: 'gte',
                      value: currentDateMinusService(duration),
                      type: 'datetime'
                  }];
              }
  
              let dataFilters = config.filters ? angular.copy(config.filters) : {};
              if (dataFilters.filters) {
                  dataFilters.filters.push(frontFilter);
              } else {
                  dataFilters = frontFilter;
              }
  
              return dataFilters;
          }
  
          function getRandomDarkColor() {
              var red = Math.floor(Math.random() * 256); // Random value for red channel (0-255)
              var green = Math.floor(Math.random() * 256); // Random value for green channel (0-255)
              var blue = Math.floor(Math.random() * 256); // Random value for blue channel (0-255)
  
              // Ensure at least one channel is bright enough (above 150)
              while (red < 150 && green < 150 && blue < 150) {
                  red = Math.floor(Math.random() * 256);
                  green = Math.floor(Math.random() * 256);
                  blue = Math.floor(Math.random() * 256);
              }
  
              return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
          }
  
          return service;
      }
  })();  