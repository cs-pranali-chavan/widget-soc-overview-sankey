/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editSocOverviewSankey200Ctrl', editSocOverviewSankey200Ctrl);

  editSocOverviewSankey200Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'appModulesService', 'Entity', 'modelMetadatasService'];

  function editSocOverviewSankey200Ctrl($scope, $uibModalInstance, config, appModulesService, Entity, modelMetadatasService) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;
    $scope.header = $scope.config.title ? 'Edit SOC Overview Sankey Chart' : 'Add SOC Overview Sankey Chart';
    $scope.params = {};
    $scope.jsonObjModuleList = [];
    $scope.loadAttributesForCustomModule = loadAttributesForCustomModule;
    $scope.onChangeModuleType = onChangeModuleType;
    $scope.fetchAttributes = fetchAttributes;
    $scope.changeAttribute = changeAttribute;
    $scope.config.moduleType = $scope.config.moduleType ? $scope.config.moduleType : 'Across Modules';
    $scope.addLayer = addLayer;
    $scope.removeLayer = removeLayer;
    $scope.checkTargetType = checkTargetType;
    $scope.onChangeTarget = onChangeTarget;
    $scope.addSubTargetType = addSubTargetType;
    $scope.config.entityTrackable = true;
    $scope.config.layers = $scope.config.layers || [];
    if ($scope.config.layers.length === 0) {
      $scope.config.layers.push({
        label: "",
        resource: "",
        sourceNodesField: "",
        targetNodeField: "",
        targetNodeSubField: "",
        targetNodeType: "",
        targetNodeSubType: ""
      });
    }

    if ($scope.config.customModule) {
      $scope.loadAttributesForCustomModule();
    }

    function loadAttributesForCustomModule() {
      $scope.fields = [];
      $scope.fieldsArray = [];
      $scope.objectFields = [];
      var entity = new Entity($scope.config.customModule);
      entity.loadFields().then(function () {
        for (var key in entity.fields) {
          //filtering out JSON fields 
          if (entity.fields[key].type === "object") {
            $scope.objectFields.push(entity.fields[key]);
          }
        }
        $scope.fields = entity.getFormFields();
        angular.extend($scope.fields, entity.getRelationshipFields());
        $scope.fieldsArray = entity.getFormFieldsArray();
      });
    }

    $scope.$watch('config.customModule', function (oldValue, newValue) {
      if ($scope.config.customModule && oldValue !== newValue) {
        if ($scope.config.query && $scope.config.query.filters) {
          delete $scope.config.query.filters;
        }
        delete $scope.config.customModuleField;
        $scope.loadAttributesForCustomModule();
      }
    });

    function onChangeModuleType() {
      changeAttribute();
      delete $scope.config.query;
      delete $scope.config.customModuleField;
      delete $scope.config.customModule;
    }

    function loadModules() {
      appModulesService.load(true).then(function (modules) {
        $scope.modules = modules;
        $scope.fetchAttributes();
      });
      initializeSingleModule();
    }

    //to load json obect modules
    function initializeSingleModule() {
      appModulesService.load(true).then(function (modules) {
        $scope.modules = modules;

        //Create a list of modules with atleast one JSON field
        modules.forEach((module) => {
          var moduleMetaData = modelMetadatasService.getMetadataByModuleType(module.type);
          for (let fieldIndex = 0; fieldIndex < moduleMetaData.attributes.length; fieldIndex++) {
            //Check If JSON field is present in the module
            if (moduleMetaData.attributes[fieldIndex].type === "object") {
              $scope.jsonObjModuleList.push(module);
              break;
            }
          }
        })
      });
    }


    function changeAttribute() {
      $scope.config.layers = [];
      $scope.config.layers.push({
        label: "",
        resource: "",
        sourceNodesField: "",
        targetNodeField: "",
        targetNodeSubField: "",
        targetNodeType: "",
        targetNodeSubType: ""
      });
      fetchAttributes();
    }


    function fetchAttributes() {
      var entity = new Entity($scope.config.resource);
      entity.loadFields().then(function () {
        $scope.config.entityTrackable = entity.trackable;
        $scope.params.formFields = entity.getFormFields();
        $scope.params.relationshipFieldsArray = entity.getRelationshipFieldsArray();
        $scope.params.sourceNodeFields = _.filter($scope.params['formFields'], function (field) {
          return field.type === 'text';
        });
        $scope.params.targetNodeFields = angular.extend($scope.params.formFields, $scope.params.relationshipFieldsArray);
        $scope.params.targetNodeFields = _.sortBy($scope.params.targetNodeFields, 'name');

        if ($scope.config.layers.length === 0) {
          $scope.config.layers.push({
            label: "",
            resource: "",
            sourceNodesField: "",
            targetNodeField: "",
            targetNodeSubField: ""
          });
        }
        else {
          $scope.config.layers.forEach(function (element, index) {
            if (element.targetNodeField) {
              checkTargetType(index);
            }
          });
        }
      });
    }

    function onChangeTarget(_index) {
      $scope.params['targetNodesSubFields_' + _index] = [];
      $scope.config.layers[_index]['targetNodeSubField'] = '';
      checkTargetType(_index);
    }

    //Check if target is picklist or manyToMany
    function checkTargetType(_index) {
      let isPicklist = _.filter($scope.params.targetNodeFields, function (field) {
        return field.name === $scope.config.layers[_index].targetNodeField
      });
      if (isPicklist.length > 0 && isPicklist[0]['type'] === 'manyToMany') {
        var targetEntity = new Entity($scope.config.layers[_index].targetNodeField);
        targetEntity.loadFields().then(function () {
          $scope.params.targetFormField = targetEntity.getFormFieldsArray();
          $scope.params['targetNodesSubFields_' + _index] = _.filter($scope.params.targetFormField, function (field) {
            return field.type === 'picklist';
          });
          $scope.params['targetNodesSubFields_' + _index] = _.sortBy($scope.params['targetNodesSubFields_' + _index], 'name');
        });
      }
      $scope.config.layers[_index]['targetNodeType'] = isPicklist[0]['type'];
    }

    function addSubTargetType(_index) {
      let subType = _.filter($scope.params['targetNodesSubFields_' + _index], function (field) {
        return field.name === $scope.config.layers[_index].targetNodeSubField
      })
      $scope.config.layers[_index]['targetNodeSubType'] = subType[0]['type'];
    }

    function addLayer() {
      if ($scope.config.layers.length < 3) {
        $scope.config.layers.push({
          label: "",
          resource: "",
          sourceNodesField: "",
          targetNodeField: "",
          targetNodeSubField: "",
          targetNodeType: "",
          targetNodeSubType: ""
        });
      }
      else {
        $scope.maxlayers = true;
      }
    }

    function removeLayer(index) {
      $scope.maxlayers = false;
      if (index !== 0) {
        $scope.config.layers.splice(index, 1);
      }
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      $uibModalInstance.close($scope.config);
    }

    loadModules();
  }
})();
