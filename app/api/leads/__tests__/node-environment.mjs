// Node test environment for route handlers (real Request/Response/fetch globals).
// jest.setup.js is shared with the jsdom tests and touches `window`, so expose a bare one.
import { TestEnvironment } from 'jest-environment-node';

export default class RouteHandlerEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.window = this.global;
  }
}
