// Messages are fixed strings: nothing from an upstream body or model output
// is ever attached, so an error can be logged or rethrown without leaking it.
export class UpstreamError extends Error {
  constructor() {
    super('upstream request failed');
    this.name = 'UpstreamError';
  }
}

export class InvalidLlmOutput extends Error {
  constructor() {
    super('model output failed validation');
    this.name = 'InvalidLlmOutput';
  }
}
