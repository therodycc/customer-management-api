/**
 * Interfaz que representa el cuerpo de una solicitud HTTP.
 *
 * @remarks
 * Esta interfaz define un objeto que puede contener cualquier propiedad con claves de tipo string y valores de cualquier tipo.
 * Es utilizado para representar el cuerpo (payload) de una solicitud HTTP realizada con Axios u otro cliente HTTP.
 *
 * @public
 */
export interface IRequestBody {
  /**
   * Propiedades del cuerpo de la solicitud identificadas por su clave (key).
   * Puede contener cualquier propiedad con claves de tipo string y valores de cualquier tipo.
   */
  [key: string]: any;
}
