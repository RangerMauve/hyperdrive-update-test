const hyperdrive = require('hyperdrive')
const RAM = require('random-access-memory')

const writer = hyperdrive(RAM)

const WRITE_DELAY = 1000

writer.ready(() => {
  const reader = hyperdrive(RAM, writer.key)

  function write () {
    writer.writeFile('/example.txt', `${new Date()}: Hello World!`, () => console.log('wrote'))
  }

  reader.on('update', () => console.log('update'))
  writer.once('peer-open', () => setInterval(write, WRITE_DELAY))

  reader.ready(() => {
    reader.watch('/', () => console.log('Watch change'))

    const stream1 = writer.replicate(true, { live: true })
    const stream2 = reader.replicate(false, { live: true })

    stream1.pipe(stream2).pipe(stream1)
  })
})
