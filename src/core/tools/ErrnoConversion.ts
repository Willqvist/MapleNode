export interface ErrnoConversion {
  error(code: any): string;
}

class ConverterImp implements ErrnoConversion {
  private data: { [key: string]: string };

  constructor(data) {
    this.data = data;
  }

  error(code: any): string {
    if (!this.data[`${code}`]) {
      return this.data['default'];
    }
    return this.data[`${code}`];
  }
}

/**
 * transforms item conversions to ErrnoConversion interface.
 * transforms item conversions to ErrnoConversion interface.
 * @param data the data to transform.
 */
function transform(data: { [key: string]: string }): ErrnoConversion {
  return new ConverterImp(data);
}

/**
 * COnversions for server module
 */
export const ServerListenError = transform({
  EADDRINUSE: 'Port already in use!',
  default: null,
});

/**
 Conversions for MysqlDatabase
 */

export const MysqlListenError = transform({
  '1045': 'Access denied. Correct password or user?',
  '-3001': 'Invalid MySQL host',
  '1049': 'Unknown database',
});
