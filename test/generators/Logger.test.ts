import { Logger } from '../../src/generator/Logger';

it('logger', async () => {
  const logger = new Logger();

  logger.pipeConfigError(new Error('test error'));

  logger.pipeStartEvent({
    count: 99,
  });

  logger.pipeProcessEvent({
    index: 5,
    count: 99,
    module: 'test',
    stage: 'generated',
    file: '/a/b/c/d/e/f',
    options: {
      cwd: '/a/b/c',
      dest: '',
      document: {
        info: {
          title: 'test',
          version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {},
      },
    },
  });

  logger.pipeEndEvent({
    count: 99,
  });

  logger.pipeErrorEvent(new Error('test error'), {
    count: 99,
  });

  expect(logger).toBeInstanceOf(Logger);
});
