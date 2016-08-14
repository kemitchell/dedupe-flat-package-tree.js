var dedupe = require('./')
var sort = require('sort-flat-package-tree')
var tape = require('tape')

tape('first', function (test) {
  // x@1.0.0 -> z@1.0.0 (exact) = z@1.0.0
  // y@1.0.0 -> z@^1.0.0 = z@1.0.1
  var tree = [
    {
      name: 'x',
      version: '1.0.0',
      range: '^1.0.0',
      links: [{name: 'z', range: '1.0.0', version: '1.0.0'}]
    },
    {
      name: 'y',
      version: '1.0.0',
      range: '^1.0.0',
      links: [{name: 'z', range: '^1.0.0', version: '1.0.1'}]
    },
    {name: 'z', version: '1.0.0', links: []},
    {name: 'z', version: '1.0.1', links: []}
  ]
  dedupe(tree)
  sort(tree)
  // x@1.0.0 -> z@1.0.0 (exact) = z@1.0.0
  // y@1.0.0 -> z@^1.0.0 = z@1.0.0 (deduped)
  test.deepEqual(
    tree,
    [
      {
        name: 'x',
        version: '1.0.0',
        range: '^1.0.0',
        links: [{name: 'z', range: '1.0.0', version: '1.0.0'}]
      },
      {
        name: 'y',
        version: '1.0.0',
        range: '^1.0.0',
        links: [{name: 'z', range: '^1.0.0', version: '1.0.0'}]
      },
      {name: 'z', version: '1.0.0', links: []}
    ],
    'backs down to z@1.0.0'
  )
  test.end()
})
