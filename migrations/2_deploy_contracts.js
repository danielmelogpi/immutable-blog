const ImmutableBlog = artifacts.require("ImmutableBlog");

module.exports = (deployer) => {
  deployer.deploy(ImmutableBlog);
}
