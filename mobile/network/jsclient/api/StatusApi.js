/**
 * KilnRegulator
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.0-SNAPSHOT
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Cooking', 'model/Status'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Cooking'), require('../model/Status'));
  } else {
    // Browser globals (root is window)
    if (!root.KilnRegulator) {
      root.KilnRegulator = {};
    }
    root.KilnRegulator.StatusApi = factory(root.KilnRegulator.ApiClient, root.KilnRegulator.Cooking, root.KilnRegulator.Status);
  }
}(this, function(ApiClient, Cooking, Status) {
  'use strict';

  /**
   * Status service.
   * @module api/StatusApi
   * @version 0.1.0
   */

  /**
   * Constructs a new StatusApi. 
   * @alias module:api/StatusApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the getCurrentCooking operation.
     * @callback module:api/StatusApi~getCurrentCookingCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Cooking} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get current cooking info from the beginning
     * @param {module:api/StatusApi~getCurrentCookingCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Cooking}
     */
    this.getCurrentCooking = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Cooking;

      return this.apiClient.callApi(
        '/status/cooking', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getStatus operation.
     * @callback module:api/StatusApi~getStatusCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Status} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get current status of oven
     * @param {module:api/StatusApi~getStatusCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Status}
     */
    this.getStatus = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Status;

      return this.apiClient.callApi(
        '/status', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
