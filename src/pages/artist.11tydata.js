module.exports = {
    eleventyComputed: {
        title: data => data.artist.title + ' - ' + data.artist.date
    }
}