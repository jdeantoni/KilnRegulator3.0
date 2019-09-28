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
    define(['ApiClient', 'model/Segment'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Segment'));
  } else {
    // Browser globals (root is window)
    if (!root.KilnRegulator) {
      root.KilnRegulator = {};
    }
    root.KilnRegulator.Program = factory(root.KilnRegulator.ApiClient, root.KilnRegulator.Segment);
  }
}(this, function(ApiClient, Segment) {
  'use strict';




  /**
   * The Program model module.
   * @module model/Program
   * @version 0.1.0
   */

  /**
   * Constructs a new <code>Program</code>.
   * @alias module:model/Program
   * @class
   */
  var exports = function() {
    var _this = this;






  };

  /**
   * Constructs a <code>Program</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Program} obj Optional instance to populate.
   * @return {module:model/Program} The populated <code>Program</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('uuid')) {
        obj['uuid'] = ApiClient.convertToType(data['uuid'], 'String');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('lastModificationDate')) {
        obj['lastModificationDate'] = ApiClient.convertToType(data['lastModificationDate'], 'Date');
      }
      if (data.hasOwnProperty('segments')) {
        obj['segments'] = ApiClient.convertToType(data['segments'], [Segment]);
      }
      if (data.hasOwnProperty('segmentsEditableStates')) {
        obj['segmentsEditableStates'] = ApiClient.convertToType(data['segmentsEditableStates'], ['Boolean']);
      }
    }
    return obj;
  }

  /**
   * Program UUID used for this cooking
   * @member {String} uuid
   */
  exports.prototype['uuid'] = undefined;
  /**
   * Program name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Date and time when this program was last modified
   * @member {Date} lastModificationDate
   */
  exports.prototype['lastModificationDate'] = undefined;
  /**
   * @member {Array.<module:model/Segment>} segments
   */
  exports.prototype['segments'] = undefined;
  /**
   * @member {Array.<Boolean>} segmentsEditableStates
   */
  exports.prototype['segmentsEditableStates'] = undefined;



  return exports;
}));


