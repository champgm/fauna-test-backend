export interface OrderQueryResult {
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
    data: {
      customer: {
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
      line:      {
        product: {
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
        quantity: number,
        price: number,
      }[],
      status: string,
      creationDate: {
        '@ts': string,
      },
      shipAddress: {
        street: string,
        city: string,
        state: string,
        zipCode: string,
      },
      creditCard: {
        network: string,
        number: string,
      },
    },
  }[];
}
