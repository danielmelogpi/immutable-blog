const ImmutableBlog = artifacts.require('./ImmutableBlog.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('ImmutableBlog', ([deployer, author, tipper]) => {
  let ImmutableBlog

  before(async () => {
    ImmutableBlog = await ImmutableBlog.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await ImmutableBlog.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await ImmutableBlog.name()
      assert.equal(name, 'ImmutableBlog')
    })
  })

})