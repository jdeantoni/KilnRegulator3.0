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
    define(['ApiClient', 'model/Program'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Program'));
  } else {
    // Browser globals (root is window)
    if (!root.KilnRegulator) {
      root.KilnRegulator = {};
    }
    root.KilnRegulator.ProgramsApi = factory(root.KilnRegulator.ApiClient, root.KilnRegulator.Program);
  }
}(this, function(ApiClient, Program) {
  'use strict';

  /**
   * Programs service.
   * @module api/ProgramsApi
   * @version 0.1.0
   */

  /**
   * Constructs a new ProgramsApi. 
   * @alias module:api/ProgramsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the addProgram operation.
     * @callback module:api/ProgramsApi~addProgramCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * add new program
     * @param {module:model/Program} body 
     * @param {module:api/ProgramsApi~addProgramCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.addProgram = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling addProgram");
      }


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
      var returnType = null;

      return this.apiClient.callApi(
        '/programs', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteProgram operation.
     * @callback module:api/ProgramsApi~deleteProgramCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * delete program, ie. archive old program if referenced or delete it
     * @param {String} uuid 
     * @param {module:api/ProgramsApi~deleteProgramCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteProgram = function(uuid, callback) {
      var postBody = null;

      // verify the required parameter 'uuid' is set
      if (uuid === undefined || uuid === null) {
        throw new Error("Missing the required parameter 'uuid' when calling deleteProgram");
      }


      var pathParams = {
        'uuid': uuid
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
      var returnType = null;

      return this.apiClient.callApi(
        '/programs/{uuid}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the editProgram operation.
     * @callback module:api/ProgramsApi~editProgramCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * edit program, ie. archive old program if referenced or delete it, and add new program
     * @param {String} uuid 
     * @param {module:model/Program} body 
     * @param {module:api/ProgramsApi~editProgramCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.editProgram = function(uuid, body, callback) {
      var postBody = body;

      // verify the required parameter 'uuid' is set
      if (uuid === undefined || uuid === null) {
        throw new Error("Missing the required parameter 'uuid' when calling editProgram");
      }

      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling editProgram");
      }


      var pathParams = {
        'uuid': uuid
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
      var returnType = null;

      return this.apiClient.callApi(
        '/programs/{uuid}', 'PUT',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getProgram operation.
     * @callback module:api/ProgramsApi~getProgramCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Program} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get one program
     * @param {String} uuid 
     * @param {module:api/ProgramsApi~getProgramCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Program}
     */
    this.getProgram = function(uuid, callback) {
      var postBody = null;

      // verify the required parameter 'uuid' is set
      if (uuid === undefined || uuid === null) {
        throw new Error("Missing the required parameter 'uuid' when calling getProgram");
      }


      var pathParams = {
        'uuid': uuid
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
      var returnType = Program;

      return this.apiClient.callApi(
        '/programs/{uuid}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPrograms operation.
     * @callback module:api/ProgramsApi~getProgramsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Program>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all programs
     * @param {module:api/ProgramsApi~getProgramsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Program>}
     */
    this.getPrograms = function(callback) {
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
      var returnType = [Program];

      return this.apiClient.callApi(
        '/programs', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
