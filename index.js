var find = require('array-find')
var semver = require('semver')

module.exports = function dedupe (tree) {
  // Identify duplicate packages.
  var duplicates = []
  tree.forEach(function (dependency) {
    var name = dependency.name
    if (duplicates.indexOf(name) === -1) {
      var haveDuplicates = tree.some(function (other) {
        return other !== dependency && other.name === name
      })
      if (haveDuplicates) {
        duplicates.push(name)
      }
    }
  })

  duplicates.forEach(function (name) {
    var versions = []
    var links = []
    var ranges = []
    tree.forEach(function (dependency) {
      if (dependency.name === name && dependency.version) {
        versions.push(dependency.version)
      } else {
        var link = find(dependency.links, function (link) {
          return link.name === name && link.version
        })
        if (link) {
          links.push(link)
        }
      }
    })
    ranges = links.map(function (link) {
      return link.range
    })
    versions.sort(semver.rcompare)
    console.log(versions)
    console.log(links)
    console.log(ranges)
  })
  console.log(duplicates)
}
