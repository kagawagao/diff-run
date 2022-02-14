import diffRun from '../src'
import path from 'path'

describe('test', () => {
  it('should not throw error', async () => {
    const fn = jest.fn()
    try {
      await diffRun({
        path: path.resolve(__dirname, './fixtures/diffrun.config.js'),
        auto: true,
      })
    } catch (error) {
      fn()
    }
    expect(fn).not.toBeCalled()
  })
})
