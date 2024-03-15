/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editSocOverviewSankey200Ctrl', editSocOverviewSankey200Ctrl);

  editSocOverviewSankey200Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'appModulesService', 'Entity', 'modelMetadatasService', 'widgetUtilityService', '$timeout'];

  function editSocOverviewSankey200Ctrl($scope, $uibModalInstance, config, appModulesService, Entity, modelMetadatasService, widgetUtilityService, $timeout) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;
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
    else if ($scope.config.layers.length >= 3) {
      $scope.maxlayers = true;
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
      });
      if ($scope.config.resource) {
        $scope.fetchAttributes();
      }
      loadJSONModule();
    }

    //to load json obect modules
    function loadJSONModule() {
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

    // fetch attributes when there is change in module selection
    function changeAttribute() {
      $scope.config.layers = [];
      insertLayerObect();
      fetchAttributes();
    }

    //insert empty layer object
    function insertLayerObect(){
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

    //fetch module related attributes
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
          insertLayerObect();
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

    //change in target node selection
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

    //to check the subtarget type
    function addSubTargetType(_index) {
      let subType = _.filter($scope.params['targetNodesSubFields_' + _index], function (field) {
        return field.name === $scope.config.layers[_index].targetNodeSubField
      })
      $scope.config.layers[_index]['targetNodeSubType'] = subType[0]['type'];
    }

    function addLayer() {
      if ($scope.config.layers.length < 3) {
        insertLayerObect();
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

    //provide i18n support
    function _handleTranslations() {
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);

      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
            HEADER_ADD_CHART: widgetUtilityService.translate('checkTranslation.HEADER_ADD_CHART'),
            HEADER_EDIT_CHART: widgetUtilityService.translate('checkTranslation.HEADER_EDIT_CHART'),
            LABEL_TITLE: widgetUtilityService.translate('checkTranslation.LABEL_TITLE'),
            LABEL_DATASOURCE: widgetUtilityService.translate('checkTranslation.LABEL_DATASOURCE'),
            LABEL_RECORD_CONTAINING_JSON_DATA: widgetUtilityService.translate('checkTranslation.LABEL_RECORD_CONTAINING_JSON_DATA'),
            LABEL_JSON_DATA_SOURCE_MODULES: widgetUtilityService.translate('checkTranslation.LABEL_JSON_DATA_SOURCE_MODULES'),
            LABEL_SELECT_AN_OPTION: widgetUtilityService.translate('checkTranslation.LABEL_SELECT_AN_OPTION'),
            LABEL_GET_LIVE_DATA: widgetUtilityService.translate('checkTranslation.LABEL_GET_LIVE_DATA'),
            LABEL_SELECT_FIELD: widgetUtilityService.translate('checkTranslation.LABEL_SELECT_FIELD'),
            LABEL_FILTER_RECORD: widgetUtilityService.translate('checkTranslation.LABEL_FILTER_RECORD'),
            LABEL_SELECT_A_MODULE: widgetUtilityService.translate('checkTranslation.LABEL_SELECT_A_MODULE'),
            LABEL_FILTER_CRITERIA: widgetUtilityService.translate('checkTranslation.LABEL_FILTER_CRITERIA'),
            LABEL_LABELTEXT: widgetUtilityService.translate('checkTranslation.LABEL_LABELTEXT'),
            LABEL_SOURCE_NODES: widgetUtilityService.translate('checkTranslation.LABEL_SOURCE_NODES'),
            LABEL_SELECT_SOURCE_NODES: widgetUtilityService.translate('checkTranslation.LABEL_SELECT_SOURCE_NODES'),
            LABEL_TARGET_NODES: widgetUtilityService.translate('checkTranslation.LABEL_TARGET_NODES'),
            LABEL_SELECT_TARGET_NODES: widgetUtilityService.translate('checkTranslation.LABEL_SELECT_TARGET_NODES'),
            LABEL_TARGET_NODE_PICKLIST: widgetUtilityService.translate('checkTranslation.LABEL_TARGET_NODE_PICKLIST'),
            LABEL_SELECT_PICKLIST: widgetUtilityService.translate('checkTranslation.LABEL_SELECT_PICKLIST'),
            LABEL_RESOURCE: widgetUtilityService.translate('checkTranslation.LABEL_RESOURCE'),
            BUTTON_ADD_LAYER: widgetUtilityService.translate('checkTranslation.BUTTON_ADD_LAYER'),
            BUTTON_SAVE: widgetUtilityService.translate('checkTranslation.BUTTON_SAVE'),
            BUTTON_CLOSE: widgetUtilityService.translate('checkTranslation.BUTTON_CLOSE'),
            TEXT_IS_NOT_TRACKABLE: widgetUtilityService.translate('checkTranslation.TEXT_IS_NOT_TRACKABLE'),
            TOOLTIP_DATASOURCE:  widgetUtilityService.translate('checkTranslation.TOOLTIP_DATASOURCE'),
            TOOLTIP_JSONDATA: widgetUtilityService.translate('checkTranslation.TOOLTIP_JSONDATA'),
            TOOLTIP_LIVEDATA: widgetUtilityService.translate('checkTranslation.TOOLTIP_LIVEDATA'),
            TOOLTIP_JSON_SELECT_MODULE: widgetUtilityService.translate('checkTranslation.TOOLTIP_JSON_SELECT_MODULE'),
            TOOLTIP_JSON_TYPE_DATA: widgetUtilityService.translate('checkTranslation.TOOLTIP_JSON_TYPE_DATA'),
            TOOLTIP_JSON_RECORD_FIELD: widgetUtilityService.translate('checkTranslation.TOOLTIP_JSON_RECORD_FIELD')
          };
          $scope.header = $scope.config.title ? $scope.viewWidgetVars.HEADER_EDIT_CHART : $scope.viewWidgetVars.HEADER_ADD_CHART;
        });
      }
      else {
        $timeout(function () {
          cancel();
        }, 100)
      }
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      if (!$scope.editSankeyWidgetForm.$valid) {
        $scope.editSankeyWidgetForm.$setTouched();
        $scope.editSankeyWidgetForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }

    function init() {
      _handleTranslations();
      loadModules();
    }

    init();
  }
})();

