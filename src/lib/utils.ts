interface ICustomError {
  message: string;
  name: string;
  code: number;
}

export class CustomError extends Error {
  public code: number;

  constructor({ message, name, code }: ICustomError) {
    super(message);
    this.name = name;
    this.code = code;

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  public static create(message: string, name: string, code: number): CustomError {
    return new CustomError({ message, name, code });
  }
}
