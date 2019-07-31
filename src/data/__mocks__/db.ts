export const deleteMock = jest.fn()
export const docMock = jest.fn()

export const db = {
  batch: () => ({
    delete: deleteMock,
  }),
  collection: () => ({
    doc: docMock,
  }),
}
