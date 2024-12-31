import { migrate } from '../../src/migrations';
import { Printer } from '../../src/printer';
import { exampleTest } from '../helpers';

// @ref https://github.com/swagger-api/swagger-petstore/tree/v31?tab=readme-ov-file

it('pet-store2.0', () => {
  exampleTest('2.0', 'pet-store', (document) => {
    const printer = new Printer(migrate(document));
    return printer.print();
  });
});

it('pet-store3.0', () => {
  exampleTest('3.0', 'pet-store', (document) => {
    const printer = new Printer(migrate(document));
    return printer.print();
  });
});

it('pet-store3.1', () => {
  exampleTest('3.1', 'pet-store', (document) => {
    const printer = new Printer(migrate(document));
    return printer.print();
  });
});
