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
    define(['ApiClient', 'model/Sample'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Sample'));
  } else {
    // Browser globals (root is window)
    if (!root.KilnRegulator) {
      root.KilnRegulator = {};
    }
    root.KilnRegulator.Debug = factory(root.KilnRegulator.ApiClient, root.KilnRegulator.Sample);
  }
}(this, function(ApiClient, Sample) {
  'use strict';




  /**
   * The Debug model module.
   * @module model/Debug
   * @version 0.1.0
   */

  /**
   * Constructs a new <code>Debug</code>.
   * @alias module:model/Debug
   * @class
   */
  var exports = function() {
    var _this = this;





  };

  /**
   * Constructs a <code>Debug</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Debug} obj Optional instance to populate.
   * @return {module:model/Debug} The populated <code>Debug</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('state')) {
        obj['state'] = ApiClient.convertToType(data['state'], 'String');
      }
      if (data.hasOwnProperty('elementState')) {
        obj['elementState'] = ApiClient.convertToType(data['elementState'], 'String');
      }
      if (data.hasOwnProperty('sample')) {
        obj['sample'] = Sample.constructFromObject(data['sample']);
      }
      if (data.hasOwnProperty('segment')) {
        obj['segment'] = ApiClient.convertToType(data['segment'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/Debug.StateEnum} state
   */
  exports.prototype['state'] = undefined;
  /**
   * @member {module:model/Debug.ElementStateEnum} elementState
   */
  exports.prototype['elementState'] = undefined;
  /**
   * @member {module:model/Sample} sample
   */
  exports.prototype['sample'] = undefined;
  /**
   * @member {Number} segment
   */
  exports.prototype['segment'] = undefined;


  /**
   * Allowed values for the <code>state</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StateEnum = {
    /**
     * value: "ready"
     * @const
     */
    "ready": "ready",
    /**
     * value: "running"
     * @const
     */
    "running": "running",
    /**
     * value: "stopped"
     * @const
     */
    "stopped": "stopped",
    /**
     * value: "error"
     * @const
     */
    "error": "error",
    /**
     * value: "delayed"
     * @const
     */
    "delayed": "delayed"  };

  /**
   * Allowed values for the <code>elementState</code> property.
   * @enum {String}
   * @readonly
   */
  exports.ElementStateEnum = {
    /**
     * value: "heating"
     * @const
     */
    "heating": "heating",
    /**
     * value: "stale"
     * @const
     */
    "stale": "stale",
    /**
     * value: "cooling"
     * @const
     */
    "cooling": "cooling"  };


  return exports;
}));


