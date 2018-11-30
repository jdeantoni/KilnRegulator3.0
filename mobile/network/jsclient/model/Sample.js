/**
 * KilnRegulator
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.KilnRegulator) {
      root.KilnRegulator = {};
    }
    root.KilnRegulator.Sample = factory(root.KilnRegulator.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Sample model module.
   * @module model/Sample
   * @version 0.1.0
   */

  /**
   * Constructs a new <code>Sample</code>.
   * @alias module:model/Sample
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>Sample</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Sample} obj Optional instance to populate.
   * @return {module:model/Sample} The populated <code>Sample</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('timestamp')) {
        obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'Number');
      }
      if (data.hasOwnProperty('temperature')) {
        obj['temperature'] = ApiClient.convertToType(data['temperature'], 'Number');
      }
    }
    return obj;
  }

  /**
   * timestamp relative to startDate
   * @member {Number} timestamp
   */
  exports.prototype['timestamp'] = undefined;
  /**
   * @member {Number} temperature
   */
  exports.prototype['temperature'] = undefined;



  return exports;
}));

