export class Result {
  #isOk;
  #value;
  #error;

  constructor(isOk, value, error) {
    if (isOk && error) {
      throw new Error("Ok result cannot have an error.");
    }
    if (!isOk && value) {
      throw new Error("Err result cannot have a value.");
    }
    this.#isOk = isOk;
    this.#value = value;
    this.#error = error;
  }

  get isOk() {
    return this.#isOk;
  }

  get isErr() {
    return !this.#isOk;
  }

  get error() {
    return this.#error;
  }

  unwrap() {
    if (this.isOk) {
      return this.#value;
    }
    throw this.#error;
  }

  unwrapOr(defaultValue) {
    return this.isOk ? this.#value : defaultValue;
  }

  /**
   * 현재 Result가 Ok일 때만 다음 함수를 실행합니다.
   * @param {(value:any) => Result} fn
   * @returns {Result}
   */
  bind(fn) {
    return this.isOk ? fn(this.#value) : this;
  }
}

export const Ok = (value) => new Result(true, value, null);
export const Err = (error) => new Result(false, null, error);
