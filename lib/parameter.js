/**
 * @class Parameter
 * @description An individual Sparql Parameter
 * @property {String} href - Pointer to the permalink
 * @property {String} cite - Specify the citation style
 *
 */

export class Parameter {


  /**
   * @method name
   *
   * @description Name of parameter (as appears in the query)
   *
   * @returns "name"
   *
   */
  name(){}

  /**
   * @method type
   *
   * @description Is this a literal (^^xmltype) or a URI?
   *
   * @returns "Node Literal^^type or URI"
   *
   */
  type(){}

  /**
   * @method default
   *
   * @description Does the parameter have a default
   *
   * @returns "Node Literal or URL or null"
   *
   */
  default(){}

  }
