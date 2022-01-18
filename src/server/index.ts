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

  app.get('/advertisements', async (req, res) => {
    const advertisements = await advertisementRepository.find()
    res.json(advertisements)
  })

  app.get('/advertisement/:id', async (req, res) => {
    const advertisement = await advertisementRepository.findOne(req.params.id)
    res.json(advertisement)
  })

  app.post('/advertisement', async (req, res) => {
    const advertisement = advertisementRepository.create(req.body)
    const result = await advertisementRepository.save(advertisement)
    return res.send(result)
  })

  app.get('/peerInfo/:id', async (req, res) => {
    const peer = await peerInfoRepository.findOne(req.params.id)
    res.json(peer)
  })

  app.post('/peerInfo', async (req, res) => {
    const peer = peerInfoRepository.create(req.body)
    const result = await peerInfoRepository.save(peer)
    return res.send(result)
  })

  app.listen(PORT, () => {
    console.log(`Start listening at PORT ${PORT}`)
  })
})
