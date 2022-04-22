/**
 * @class Query
 * @description An AEQ query
 *
 */

export class Query {
  /**
   * @method name
   *
   * @description Name of Query
   *
   * @returns "name"
   *
   */
  name(){}

  /**
   * @method type
   *
   * @description select, update, or construct
   *
   * @returns ["mime type of query","mime type of result"]
   *
   */
  type(){}

  /**
   * @method parameters
   *
   * @description List of parameters that can be bound
   *
   * @param {required} [true|false] - Only return required parameters , default false

   * @returns "[Array of {Parameters}]"
   *
   */
  parameters(required){}

   /**
   * @method bind
   *
   * @description Li
   *
   * @param {bind} [[parmeter,value],[]] Array of tuples binding parameter and values

   * @returns "Bound Query"
   * @err - Throws an error if all required parameters are not bound, or parameters are bound to wring type.
   *
   */
  bind(){}

  }
