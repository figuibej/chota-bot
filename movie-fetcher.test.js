const fetch = require('node-fetch');
const { getTitle } = require('./movie-fetcher');

// Mocking the fetch function
jest.mock('node-fetch');
fetch.mockResolvedValue({
  json: jest.fn().mockResolvedValue({
    results: [
      { title: 'Movie 1' },
      { title: 'Movie 2' },
      { title: 'Movie 3' },
    ],
  }),
});

describe('getTitle', () => {
  it('should return a modified title with Chota', async () => {
    const successMock = jest.fn();
    const errorMock = jest.fn();

    await getTitle(errorMock, successMock);

    expect(successMock).toHaveBeenCalledWith(expect.stringContaining('Chota'));
  });

  it('should retry fetching if the title contains invalid words', async () => {
    const successMock = jest.fn();
    const errorMock = jest.fn();

    // Mocking the random function to always return 0
    jest.spyOn(Math, 'random').mockReturnValue(0);

    await getTitle(errorMock, successMock);

    expect(fetch).toHaveBeenCalledTimes(2); // First call and retry
  });

  it('should handle errors', async () => {
    const successMock = jest.fn();
    const errorMock = jest.fn();

    // Mocking the fetch function to throw an error
    fetch.mockRejectedValue(new Error('Network error'));

    await getTitle(errorMock, successMock);

    expect(errorMock).toHaveBeenCalledWith(expect.any(Error));
  });
});