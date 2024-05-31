import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminWebp from 'imagemin-webp'
import {globby} from 'globby'
import {dirname} from 'path'
import {stat} from 'fs/promises'
import imghash from 'imghash'
import {cache} from './cache.mjs'
import {imageCompressionLog} from './log.mjs'

const compress = (srcFile, outDir, quality) =>
    imagemin([srcFile], {
        plugins: [
            imageminPngquant({
                quality: [quality / 100, quality / 100],
            }),
            imageminMozjpeg({
                quality,
                progressive: false,
            }),
        ],
        destination: outDir,
    })

const toWebp = (srcFile, outDir, quality) =>
    imagemin([srcFile], {
        plugins: [
            imageminWebp({quality}),
        ],
        destination: outDir,
    })

const resolveImagesPaths = (dirPath, formats) => {
    return globby(dirPath, {
        expandDirectories: {
            extensions: formats,
        },
    })
}

const isImageAlreadyOptimized = async (imagePath) => {
    const imageHash = await imghash.hash(imagePath, 16)
    return cache.has(imageHash)
}

const removeImageFromCache = async (imagePath) => {
    const imageHash = await imghash.hash(imagePath, 16)
    return cache.del(imageHash)
}

const processImage = async (imagePath, quality, convertToWebp, rewriteCache) => {
    if (rewriteCache) {
        await removeImageFromCache(imagePath)
    } else if (await isImageAlreadyOptimized(imagePath)) {
        return false
    }

    const dir = dirname(imagePath)
    const statsBeforeCompress = await stat(imagePath)

    if (convertToWebp) {
        await toWebp(imagePath, dir, quality)
    }
    await compress(imagePath, dir, quality)

    const statsAfterCompress = await stat(imagePath)
    imageCompressionLog(imagePath, statsBeforeCompress.size, statsAfterCompress.size)

    const imageHash = await imghash.hash(imagePath, 16)
    cache.set(imageHash)

    return true
}

export const processImages = async (dirPath, params = {}) => {
    const {formats, webp, quality, rewriteCache} = params

    const imagesPaths = await resolveImagesPaths(dirPath, formats)
    if (!imagesPaths.length) {
        console.log('Images not found.')
        return
    }

    await cache.init()
    const processPromises = imagesPaths.map((imagePath) => processImage(imagePath, quality, webp, rewriteCache))

    const someImageWasOptimize = (await Promise.all(processPromises)).some(Boolean)
    if (!someImageWasOptimize) {
        console.log('All images already optimized.')
        return
    }

    await cache.rewrite()
    console.log('Compress complete!')
}
