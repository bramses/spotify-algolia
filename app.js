const express = require('express')
const pug = require('pug')
const path = require('path')
const dotenv = require('dotenv')
const SpotifyNode = require('spotify-web-api-node')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helpers = require('./helpers')

dotenv.config()

const spotifyApi = new SpotifyNode({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
})

const app = express()

app
    .use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())

app.get('/get-token', async (req, res) => {
    try {
        const data = await spotifyApi.clientCredentialsGrant()
        const access_token = data.body['access_token']
        const expires_in = data.body['expires_in']

        spotifyApi.setAccessToken(access_token)

        res.status(200).json({
            access_token: access_token,
            expires_in: expires_in
        })
    } catch (error) {
        console.error(error)
    }
})

app.get('/display-artist/:artist', async (req, res) => {
    if (spotifyApi.getAccessToken() === undefined) {
         res.status(500).send('Please log in')
    } else {
        const data = await spotifyApi.searchArtists(req.params.artist)
        const artists = helpers.cleanArtistData(data)
        const compiledArtistHTML = pug.compileFile(path.join(__dirname, 'public', 'artist.pug'))

        res.status(200).send(compiledArtistHTML({
            artists: artists
        }))
    }
})

console.log('Listening on 8888');
app.listen(8888);