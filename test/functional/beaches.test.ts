describe('Beaches functional tests', () => {
  describe('When creating a beach', () => {
    it('should create a beach successfully', async () => {
      const newBeach = {
        lat: -30,
        lng: 154,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });
  });
});
