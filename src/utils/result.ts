// 내부 구현 클래스입니다. 외부로 노출되지 않습니다.
class Success<T, E extends Error> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is Success<T, E> {
    return true;
  }

  isErr(): this is Failure<T, E> {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  /**
   * Ok 상태의 값에 함수를 적용하여 새로운 Result를 반환합니다.
   * Err 상태는 그대로 유지됩니다.
   */
  map<TNext>(fn: (value: T) => TNext): Result<TNext, E> {
    return new Success(fn(this.value));
  }

  /**
   * Ok 상태의 값에 함수를 적용하여 새로운 Result를 반환합니다.
   * ROP(Railway Oriented Programming)의 파이프라인을 구성하는 핵심 메서드입니다.
   */
  bind<TNext, ENext extends Error>(
    fn: (value: T) => Result<TNext, ENext>
  ): Result<TNext, E | ENext> {
    return fn(this.value);
  }
}

class Failure<T, E extends Error> {
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isOk(): this is Success<T, E> {
    return false;
  }

  isErr(): this is Failure<T, E> {
    return true;
  }

  unwrap(): T {
    throw this.error;
  }

  /**
   * Err 상태이므로 아무것도 하지 않고 자신을 반환합니다.
   */
  map<TNext>(_fn: (value: T) => TNext): Result<TNext, E> {
    return this as unknown as Failure<TNext, E>;
  }

  /**
   * Err 상태이므로 아무것도 하지 않고 자신을 반환하여 파이프라인을 중단시킵니다.
   */
  bind<TNext, ENext extends Error>(
    _fn: (value: T) => Result<TNext, ENext>
  ): Result<TNext, E | ENext> {
    return this as unknown as Failure<TNext, E | ENext>;
  }
}

// 외부에 노출되는 Result 타입은 Success와 Failure의 유니온입니다.
export type Result<T, E extends Error> = Success<T, E> | Failure<T, E>;

// Success와 Failure 인스턴스를 생성하는 팩토리 함수입니다.
export const Ok = <T>(value: T): Result<T, never> => {
  return new Success(value);
};

export const Err = <E extends Error>(error: E): Result<never, E> => {
  return new Failure(error);
};
