const _ = require('lodash')


const cleanArtistData = ( data ) => {
    return _.map(data.body.artists.items, (artist) => {
        return {
            followers: artist.followers.total,
            aboutURL: artist.href,
            genres: artist.genres,
            id: artist.id,
            profileImage: artist.images[0],
            name: artist.name
        }
    }) 
}

module.exports = {
    cleanArtistData
}