import { AxiosRequestConfig } from 'axios';
import { IRequestBody } from './request-body.interface';

/**
 * Representa los parámetros para realizar una solicitud HTTP.
 *
 * @remarks
 * Este tipo define las opciones necesarias para realizar una solicitud HTTP utilizando Axios.
 *
 * @public
 */

export interface IRequestParams {
  /**
   * El método HTTP para la solicitud.
   * @defaultValue 'GET'
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';

  /**
   * La acción que se debe realizar en la solicitud.
   */
  action: string;

  /**
   * El cuerpo de la solicitud, si corresponde.
   */
  body?: IRequestBody;

  /**
   * La URL a la que se enviará la solicitud.
   */
  url?: string;

  /**
   * Opciones de configuración para la solicitud Axios.
   */
  config: AxiosRequestConfig;
}
