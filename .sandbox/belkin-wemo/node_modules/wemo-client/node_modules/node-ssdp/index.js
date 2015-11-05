var path = process.env.SSDP_COV ? './lib-cov/' : './lib/'

module.exports = {
  Server: require(path + 'server'),
  Client: require(path + 'client'),
  Base: require(path + 'index')
}
