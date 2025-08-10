/**
 * Mail Center configuration
 */
interface IMailConfig {
  /**
   * Mail Center app key
   */
  appKey: string;
  /**
   * Mail Center secret key
   */
  secretKey: string;
}

/**
 * Body of the mail to be sent
 */
interface IMailBody {
  /**
   * Recipients of the mail
   */
  to: string | string[];
  /**
   * Recipients to be copied
   */
  cc?: string | string[];
  /**
   * Recipients to be copied hidden
   */
  cco?: string | string[];
  /**
   * Subject of the mail
   */
  subject: string;
  /**
   * Email template name from Mail Center (must be created previously)
   */
  templateName: string;
  /**
   * Variables to be replaced in the template
   */
  variables: object;
}

/**
 * Response from successful mail sending from Mail Center
 */
interface IMailResponse {
  /**
   * Mail Center application id (Service Manager)
   */
  applicationId: number;
  /**
   * Mail Center state id (Service Manager)
   */
  stateId: number;
  /**
   * Sender of the mail
   */
  from: string;
  /**
   * Recipients of the mail
   */
  to: string;
  /**
   * Recipients to be copied
   */
  cc?: string;
  /**
   * Recipients to be copied hidden
   */
  cco?: string;
  /**
   * Body of the mail (raw HTML)
   */
  body: string;
  /**
   * Subject of the mail
   */
  subject: string;
  /**
   * Attempts made to send the mail
   */
  attempts: number;
  /**
   * Date when the mail was sent
   */
  sendOn: Date;
  /**
   * Date when the mail was updated
   */
  updated_at: Date;
  /**
   * Date when the mail was created
   */
  created_at: Date;
  /**
   * Id of the mail
   */
  id: number;
}

export { IMailBody, IMailConfig, IMailResponse };
