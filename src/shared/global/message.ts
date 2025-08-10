const LANGUAGE = 'ES';
export const MESSAGE = {
  ES: {
    AUTH: {
      INVALID_TOKEN: 'Token no válido',
      USER_INACTIVE: 'Usuario inactivo, hable con un administrador',
      THIS_ID_HAS_ALREADY_BEEN_REGISTERED: 'Esta cédula ya ha sido registrada',
      INVALID_IDENTITY: 'Cédula inválida',
      SESSION_CLOSED: 'Sesión cerrada con éxito',
      EMAIL_CORRECTLY:
        'Si el correo electrónico fue escrito correctamente, revise su correo.',
      INVALID_CREDENTIALS: 'Credenciales inválidas',
      PASSWORDS_NOT_MATCH: 'Las nuevas contraseñas no coinciden',
      THE_PASSWORD_WAS_CHANGED: 'La contraseña fue cambiada',
      EMAIL_SENT: 'El correo electrónico fue enviado con éxito',
      THE_EMAIL_WAS_ALREADY_VALID: 'El correo electrónico ya era válido.',
      THIS_EMAIL_ALREADY_EXITS: 'Este correo electrónico ya existe',
      THE_EMAIL_WAS_CHANGED_AND_EMAIL_WAS_SENT:
        'El correo electrónico fue cambiado y se envió un correo',
      THIS_CODE_IS_NO_VALID: 'Este código no es válido',
      THE_EMAIL_WAS_VALIDATED_CORRECTLY:
        'El correo electrónico fue validado correctamente',
      THE_EMAIL_MUST_BE_VALIDATED: 'El correo electrónico debe ser validado',
      DIFFERENT_PASSWORD_REQUIRED:
        'Debes agregar una contraseña diferente a la actual',
    },
    BASE: {
      SUCCESSFULLY_DELETED: 'Eliminado con éxito',
      UPDATED_CORRECTLY: 'Actualizado correctamente',
      CANT_CREATED_THE_RESOURCE: 'No se pudo crear el recurso',
      ERROR_FETCHING_ALL: 'Error al obtener todos',
      ERROR_FETCHING_ONE: 'Error al obtener uno',
      THE_RESOURCES_WERE_RETURNED_SUCCESSFULLY:
        'Los recursos fueron devueltos con éxito',
      UNAUTHORIZED_REQUEST: 'Solicitud no autorizada',
      RESOURCE_NOT_FOUND: 'Recurso no encontrado',
      THE_RESOURCE_WAS_RETURNED_SUCCESSFULLY:
        'El recurso fue devuelto con éxito',
      CREATED_SUCCESSFULLY: 'Creado con éxito',
      BAD_REQUEST: 'Solicitud incorrecta',
      THE_RESOURCE_WAS_UPDATED_SUCCESSFULLY:
        'El recurso fue actualizado con éxito',
      THE_RESOURCE_WAS_REMOVED_SUCCESSFULLY:
        'El recurso fue eliminado con éxito',
    },
    SEED: {
      DATABASE_ALREADY_HAS_DATA: 'La base de datos ya tiene datos',
      SEED_EXECUTED: 'Semilla ejecutada',
    },
  },

  EN: {
    REQUEST: {
      USER_REQUEST: 'The user has made the request',
      REQUEST_IN_PROGRESS:
        'The request cannot be created because a request is in progress',
      REQUEST_ALREADY_EXISTS: 'The request already exists',
    },
    AUTH: {
      INVALID_TOKEN: 'Token not valid',
      USER_INACTIVE: 'User is inactive, talk with an admin',
      THIS_ID_HAS_ALREADY_BEEN_REGISTERED:
        'This ID has already been registered',
      INVALID_IDENTITY: 'Invalid identity',
      SESSION_CLOSED: 'Session closed successfully',
      EMAIL_CORRECTLY: 'If the email was written correctly, check your email.',
      INVALID_CREDENTIALS: 'Invalid credentials',
      PASSWORDS_NOT_MATCH: `New passwords do not match`,
      THE_PASSWORD_WAS_CHANGED: 'The password was changed',
      EMAIL_SENT: 'The email was sent successfully',
      THE_EMAIL_WAS_ALREADY_VALID: `The email was already valid.`,
      THIS_EMAIL_ALREADY_EXITS: 'This email already exits',
      THE_EMAIL_WAS_CHANGED_AND_EMAIL_WAS_SENT:
        'The email was changed and email was sent',
      THIS_CODE_IS_NO_VALID: `This code is not valid`,
      THE_EMAIL_WAS_VALIDATED_CORRECTLY: 'The email was validated correctly',
      THE_EMAIL_MUST_BE_VALIDATED: 'The email must be validated',
      DIFFERENT_PASSWORD_REQUIRED:
        'You must add a different password from the current one',
    },
    BASE: {
      SUCCESSFULLY_DELETED: 'Successfully deleted',
      UPDATED_CORRECTLY: 'Updated Correctly',
      CANT_CREATED_THE_RESOURCE: `Can't create the resource`,
      ERROR_FETCHING_ALL: 'Error fetching all',
      ERROR_FETCHING_ONE: 'Error fetching one',
      THE_RESOURCES_WERE_RETURNED_SUCCESSFULLY:
        'The resources were returned successfully',
      UNAUTHORIZED_REQUEST: 'Unauthorized Request',
      RESOURCE_NOT_FOUND: 'Resource not found',
      THE_RESOURCE_WAS_RETURNED_SUCCESSFULLY:
        'The resource was returned successfully',
      CREATED_SUCCESSFULLY: 'Created Successfully',
      BAD_REQUEST: 'Bad Request',
      THE_RESOURCE_WAS_UPDATED_SUCCESSFULLY:
        'The resource was updated successfully',
      THE_RESOURCE_WAS_REMOVED_SUCCESSFULLY:
        'The resource was removed successfully',
    },
    SEED: {
      DATABASE_ALREADY_HAS_DATA: 'database already has data',
      SEED_EXECUTED: 'Seed executed',
    },
  },
}?.[LANGUAGE];
