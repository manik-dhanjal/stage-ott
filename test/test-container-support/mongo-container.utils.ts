import { GenericContainer, StartedTestContainer } from 'testcontainers';

export class MongoContainer {
  private container: StartedTestContainer;

  async start(): Promise<string> {
    this.container = await new GenericContainer('mongo')
      .withExposedPorts(27017)
      .start();

    const mongoUri = `mongodb://${this.container.getHost()}:${this.container.getMappedPort(27017)}`;
    return mongoUri;
  }

  async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop();
    }
  }
}
