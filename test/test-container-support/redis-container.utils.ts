import { RedisStore, redisStore } from 'cache-manager-redis-store';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

export class RedisContainer {
  private container: StartedTestContainer;
  private store: RedisStore;

  async start(): Promise<RedisStore> {
    this.container = await new GenericContainer('redis')
      .withExposedPorts(6379)
      .start();

    this.store = await redisStore({
      socket: {
        host: this.container.getHost(),
        port: this.container.getMappedPort(6379),
      },
    });
    return this.store;
  }

  async stop(): Promise<void> {
    if (this.store) {
      await this.store.getClient().quit();
    }
    if (this.container) {
      await this.container.stop();
    }
  }
}
