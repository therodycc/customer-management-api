import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { DriverErrorI } from './exception.interface';

@Catch(QueryFailedError<DriverErrorI>)
export class PostgresExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError<DriverErrorI>, host: ArgumentsHost) {
    const logger = new Logger('PostgresError');

    logger.error(
      JSON.stringify(
        {
          message: exception.message,
          parameters: exception.parameters,
          table: exception?.driverError.table,
          detail: exception.driverError.detail,
        },
        null,
        2,
      ),
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = '';

    switch (exception?.driverError.code) {
      case '23505':
        status = HttpStatus.BAD_REQUEST;
        message =
          'Database Error: Duplicate key value violates unique constraint';
        break;

      case '22P02':
        status = HttpStatus.BAD_REQUEST;
        message = `Database Error: The parameter ${exception?.driverError?.file} has a value that is causing the error.`;
        break;

      default:
        message =
          'Database Error: An error occurred while executing the database query, please try again later, if the problem persists, contact the administrator.';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.message,
    });
  }
}
