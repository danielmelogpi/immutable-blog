const ImmutableBlog = artifacts.require('./ImmutableBlog.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('ImmutableBlog', (accounts) => {
  let blog
  let firstAccount
  before(async () => {
    blog = await ImmutableBlog.deployed()
    firstAccount = accounts[0]
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await blog.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await blog.name()
      assert.equal(name, 'ImmutableBlog')
    })
  })

  describe('user profile operations', async () => {
    const myNickname = 'GoldenGorila'
    before(async () => {
      await blog.setMyNickname(myNickname)
    })
    it ('is able to set a nickname for the current user', async () => {
      const currentNickname = (await blog.authors(firstAccount)).nickname
      assert.equal(myNickname, currentNickname)
    })
    it ('is able to change a nickname for the current user', async () => {
      const newNickname = 'BlackManta'
      await blog.setMyNickname(newNickname)
      const currentNickname = (await blog.authors(firstAccount)).nickname
      assert.equal(newNickname, currentNickname)
    })
  })

})