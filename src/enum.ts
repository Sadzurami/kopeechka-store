export enum StatusCodes {
  ok = 'OK',
  error = 'ERROR'
}

export enum ErrorCodes {
  BAD_TOKEN = 'The client key is not valid.',
  BAD_SITE = 'The "website" argument is not correct.',
  BAD_DOMAIN = 'The "domains" argument is not correct.',
  BAD_BALANCE = 'There are not enough funds to perform the operation.',
  OUT_OF_STOCK = 'The requested domain is out of stock.',
  SYSTEM_ERROR = 'Unknown, server error. Contact support.',
  TIME_LIMIT_EXCEED = 'Address ordering limit per second has been reached.',
  NO_ACTIVATION = 'The server could not find the task.',
  ACTIVATION_CANCELED = 'The task was canceled.',
  WAIT_LINK = 'Message not received.',
  'bad request' = 'An incorrect request was sent.'
}
