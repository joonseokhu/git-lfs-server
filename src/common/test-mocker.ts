import { InjectionToken } from '@nestjs/common';
import { ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

export const autoMocker = (token: InjectionToken | undefined) => {
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(token);
    if (!mockMetadata) return null;
    const Mock = moduleMocker.generateFromMetadata<any>(mockMetadata);
    return new Mock();
  }
};
