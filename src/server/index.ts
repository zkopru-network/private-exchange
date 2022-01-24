import express from 'express'
import { createConnection } from 'typeorm'
import { Advertisement } from './entity/Advertisement'
import { PeerInfo } from './entity/Peer'

const PORT = 8008

createConnection().then((connection) => {
  const app = express()
  const advertisementRepository = connection.getRepository(Advertisement)
  const peerInfoRepository = connection.getRepository(PeerInfo)

  app.use(express.json())
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    next()
  })

  app.get('/advertisements', async (req, res) => {
    const advertisements = await advertisementRepository.find()
    res.json(advertisements)
  })

  app.get('/advertisement/:id', async (req, res) => {
    const advertisement = await advertisementRepository.findOne(req.params.id)
    res.json(advertisement)
  })

  app.post('/advertisement', async (req, res) => {
    try {
      const advertisement = advertisementRepository.create(req.body)
      const result = await advertisementRepository.save(advertisement)
      res.status(201)
      res.send(result)
    } catch (e) {
      res.status(422)
    } finally {
      res.end()
    }
  })

  app.get('/peerInfo/:id', async (req, res) => {
    const peer = await peerInfoRepository.findOne(req.params.id)
    res.json(peer)
  })

  app.post('/peerInfo', async (req, res) => {
    try {
      const peer = peerInfoRepository.create(req.body)
      const result = await peerInfoRepository.save(peer)
      res.status(201)
      res.send(result)
    } catch (e) {
      console.log(e)
      res.status(422)
    } finally {
      res.end()
    }
  })

  app.listen(PORT, () => {
    console.log(`Start listening at PORT ${PORT}`)
  })
})
