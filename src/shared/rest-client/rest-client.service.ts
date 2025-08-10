import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { ConfigService } from 'src/config/config.service';
import { catchError, lastValueFrom } from 'rxjs';
import { IRequestParams } from './IRequestParams';
import { MESSAGE } from '../global/message';

@Injectable()
export class RestClientService {
  private readonly logger = new Logger(RestClientService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Envía una solicitud HTTP utilizando Axios y devuelve la respuesta en el formato especificado.
   *
   * @typeparam TModel - Tipo de dato que representa el modelo de la respuesta esperada.
   *
   * @param {IRequestParams}[req] - Objeto que contiene los parámetros de la solicitud (método, acción, cuerpo, URL, configuración, etc.).
   * @returns Una promesa que se resuelve con el modelo de la respuesta esperada.
   * @throws {HttpException} Si ocurre un error durante la solicitud HTTP.
   */
  async sendRequest<TModel>(req: IRequestParams): Promise<TModel> {
    const requestUrl = req.url
      ? `${req.url}/${req.action}`
      : `${this.configService.get('HTTP_DEFAULT_URL_REQUEST')}/${req.action}`;
    const { data } = await lastValueFrom(
      this.httpService
        .request<TModel>({
          method: req.method,
          url: requestUrl,
          data: req.body,
          ...req.config,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);

            if (error.response?.status === 401) {
              throw new HttpException(
                {
                  message: MESSAGE.AUTH.INVALID_CREDENTIALS,
                  cause: error.cause?.message ?? error?.message,
                },
                error.response?.status,
              );
            }

            throw new HttpException(
              {
                message: error.cause?.message ?? error?.message,
                cause: error.cause?.message ?? error?.message,
              },
              error.response?.status ?? 503,
            );
          }),
        ),
    );
    return data;
  }
}
