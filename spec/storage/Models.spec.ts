import 'jest';

import { Order, Line } from '../../src/storage/Order';
import { Warehouse } from '../../src/storage/Warehouse';
import { Address } from '../../src/storage/Address';
import { Product } from '../../src/storage/Product';
import { CreditCard } from '../../src/storage/CreditCard';
import { Customer } from '../../src/storage/Customer';

describe('Models', () => {
  it('should be linted/checked by typescript', async () => {
    const address: Address = {
      street: 'street',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
    };
    const warehouse: Warehouse = {
      address,
      name: 'name',
    };
    const product: Product = {
      name: 'name',
      description: 'description',
      price: 10,
      quantity: 10,
      warehouse: [warehouse],
      backorderLimit: 10,
      backordered: true,
    };
    const line: Line = {
      product,
      quantity: 10,
      price: 10,
    };
    const creditCard: CreditCard = {
      network: 'network',
      number: 'number',
    };
    const customer: Customer = {
      firstName: 'firstName',
      lastName: 'lastName',
      address,
      telephone: 'telephone',
      creditCard,
    };
    const order: Order = {
      customer,
      line: [line],
      status: 'status',
      creationDate: 'creationDate',
      shipAddress: address,
      creditCard,
    };
  });
});
