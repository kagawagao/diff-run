import diffRun from '../src'

describe('test', () => {
  it('should not throw error', async () => {
    const fn = jest.fn()
    try {
      await diffRun()
    } catch (error) {
      fn()
    }
    expect(fn).not.toBeCalled()
  })
})
