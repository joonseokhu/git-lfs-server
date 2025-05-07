/**
 * 입력받은 시간만큼 기다린 후 완료되는 프로미스를 리턴한다.
 *
 * @example
 * ```javascript
 *   await wait(5000);
 * ```
 */
export const wait = (time = 0): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

/**
 * 대상 배열에 대해 비동기 순차적인 map을 한다.
 * @param items - 대상배열
 * @param fn - 각 항목을 대상으로 실행할 비동기함수
 * @returns 각 항목에 대한 `fn` 의 리턴결과들로 이루어진 배열
 */
export const mapAsync = async <T, U>(
  items: T[] = [],
  fn: (item: T, index: number) => Promise<U>,
) => {
  const ret: U[] = [];
  return items.reduce(async (pacc, item, i) => {
    return pacc.then(async (acc) => {
      const result = await fn(item, i);
      return acc.concat(result);
    });
  }, Promise.resolve(ret));
};
