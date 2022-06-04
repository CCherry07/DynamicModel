export type handleFinishFormType = <D, O extends Record<string, any>>(
  values: D,
  options?: O,
) => D & O;
