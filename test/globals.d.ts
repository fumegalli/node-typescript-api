declare namespace NodeJS {
  interface Global {
    // Import inline to override global types.
    // https://stackoverflow.com/a/51114250
    testRequest: import('supertest').SuperTest<import('supertest').Test>
  }
}