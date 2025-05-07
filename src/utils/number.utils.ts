/** 스냅 효과를 주기 위해 사용 */
export const toStepped = (value = 0, step = 1) => {
  value = Math.max(value, 0);
  value /= step;
  value = Math.round(value);
  value *= step;
  value = Math.round(value); // 안해도 되지만 부동소수점 오차 보간을 위해 한번더 반올림함
  return value;
};

/** 특정 자릿수로 반올림 */
export const toRounded = (value = 0, level = 0) => {
  level = 10 ** level;
  value /= level;
  value = Math.round(value);
  value *= level;
  return value;
};

export const minmax = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
