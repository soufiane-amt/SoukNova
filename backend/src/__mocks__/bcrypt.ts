export const hash = jest.fn((data) => Promise.resolve(data));
export const compare = jest.fn((data, encrypted) => Promise.resolve(data === encrypted));