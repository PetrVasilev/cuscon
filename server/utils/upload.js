const fs = require('fs')
const randomstring = require('randomstring')

const uploadsDir = `${__dirname}/../../uploads`

const storeUpload = async ({ stream, filename }) => {
    const randomName = await randomstring.generate({
        length: 6,
        charset: 'alphabetic'
    })
    const extension = filename.split('.').pop()
    const fileName = `${randomName}.${extension}`
    const path = `${uploadsDir}/${fileName}`

    return new Promise((resolve, reject) =>
        stream
            .pipe(fs.createWriteStream(path))
            .on('finish', () => resolve(fileName))
            .on('error', reject)
    )
}

const deleteFile = (fileName) => {
    const _path = `${uploadsDir}/${fileName}`
    fs.unlink(_path, () => {})
}

const processUpload = async (upload) => {
    try {
        const { createReadStream, filename } = await upload
        const stream = createReadStream()
        return await storeUpload({ stream, filename })
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    processUpload,
    deleteFile
}
