module.exports = {
    eleventyComputed: {
        title: artist => artist.title + ' - ' + artist.date
    }
}