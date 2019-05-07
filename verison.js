

const version = {
  items: {
    Unknown: 0,
    Base: 1  // 基础版本
  }
}

version.current = version.items.Base

version.isOlder = function(ver) {
  return !ver || ((+ver) < version.current)
}

version.name = function(ver) {
  let n = +ver
  for(let [k,v] of version.items) {
    if (v === n) {
      return k
    }
  }
  return 'Unknown'
}

export default version
