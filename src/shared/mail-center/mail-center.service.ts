import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { RestClientService } from '../rest-client/rest-client.service';
import { IRequestParams } from '../rest-client/IRequestParams';
import { IMailBody, IMailConfig } from './mail-center.models';

@Injectable()
export class MailCenterService {
  private readonly logger: Logger;
  private baseRequest: IRequestParams;
  private mailConfig: IMailConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly restClient: RestClientService,
  ) {
    this.logger = new Logger(MailCenterService.name);
    this.baseRequest = {
      method: 'POST',
      action: this.configService.get('MAIL_CENTER_ACTION_URL'),
      url: this.configService.get('MAIL_CENTER_BASEURL'),
      config: {},
    };
    this.mailConfig = {
      appKey: this.configService.get('MAIL_CENTER_APP_KEY'),
      secretKey: this.configService.get('MAIL_CENTER_SECRET_KEY'),
    };
  }

  /**
   * Sends an email through the mail center.
   * The app and template must be configured in the mail center. To do this, please refer to the mail center: http://mailcenter.semarena.local/
   * @template T Type of the result object from the response of the mail center
   * @param {IMailBody} mailBody Body of the email to be sent
   * @returns {T} Result from the response of the mail center
   */
  async sendMail<T>(mailBody: IMailBody): Promise<T> {
    /**
     * The mail center expects the emails to be separated by semicolon, in case of multiple emails
     */
    const toString: string = Array.isArray(mailBody.to)
      ? mailBody.to.join(';')
      : mailBody.to;
    const ccString: string = Array.isArray(mailBody.cc)
      ? mailBody.cc.join(';')
      : mailBody.cc;
    const ccoString: string = Array.isArray(mailBody.cco)
      ? mailBody.cco.join(';')
      : mailBody.cco;

    const request: IRequestParams = {
      ...this.baseRequest,
      body: {
        ...this.mailConfig,
        ...mailBody,
        to: toString,
        cc: ccString ?? null,
        cco: ccoString ?? null,
        variables: mailBody.variables ?? {},
      },
    };
    return this.restClient.sendRequest<T>(request);
  }
}
