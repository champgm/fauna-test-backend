import { Customer } from '../Customer';

export interface CustomerQueryResult {
  data: {
    ref: {
      '@ref': {
        id: string,
        collection: {
          '@ref': {
            id: string,
            collection: {
              '@ref': {
                id: string,
              },
            },
          },
        },
      },
    },
    ts: number,
    data: Customer,
  }[];
}
