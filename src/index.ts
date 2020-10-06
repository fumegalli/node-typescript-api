import { SetupServer } from './server';
import config from 'config';
import logger from './utils/logger';

enum ExitStatus {
  FAILURE = 1,
  SUCCESS = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );

  // throw to uncaughtException handler
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exiting due to an uncaught exception ${error}`);
  process.exit(ExitStatus.FAILURE);
});

function handleExitSignal(
  exitSignal: NodeJS.Signals,
  server: SetupServer
): void {
  process.on(exitSignal, async () => {
    try {
      await server.close();

      logger.info('App exited successfully');
      process.exit(ExitStatus.SUCCESS);
    } catch (err) {
      logger.error(`App exited with error: ${err}`);
      process.exit(ExitStatus.FAILURE);
    }
  });
}

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));

    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGQUIT', 'SIGTERM'];
    exitSignals.forEach((signal) => handleExitSignal(signal, server));
  } catch (err) {
    logger.error(`App exited with error: ${err}`);
    process.exit(ExitStatus.FAILURE);
  }
})();
