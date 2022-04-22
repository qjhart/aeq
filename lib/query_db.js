/**
 * @class QueryDB
 * @description An AEQ database of standard queries
 *
 */

export class QueryDB {
  /**
   * @method new
   *
   * @description Create a new QueryDB

   * @param {src} - Source of query DB (I'm thinking a TTL file eg.)
   *
   * @returns {Object}
   *
   */
  new(){}

  /**
   * @method list
   *
   * @description List the Avaiable Queries
   *
   * @param {subject } - person | grant | work | etc
   * @param {type} - select | construct | update | delete

   * @returns [Array of {Query}]
   *
   */
  list(){}

  /**
   * @method query
   *
   * @description Search for queries.  IDK if this should be a
   *
   * @returns "[Array of {Parameters}]"
   *
   */
  query(required){}

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
