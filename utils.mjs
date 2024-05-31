import {access, readFile, writeFile} from 'fs/promises'
import {constants} from 'fs'
import {InvalidArgumentError} from 'commander/esm.mjs'

const parseIntOption = (value) => {
    const parsedValue = parseInt(value, 10)

    if (isNaN(parsedValue)) {
        throw new InvalidArgumentError('Not a number.')
    }

    return parsedValue
}

export const parseQualityOption = (value) => {
    const quality = parseIntOption(value)

    if (quality < 1 || quality > 100) {
        throw new InvalidArgumentError('Quality should be in range 1 to 100.')
    }

    return quality
}

export const readOrCreateFile = async (filePath, initialContent) => {
    try {
        await access(filePath, constants.F_OK)
        return readFile(filePath, 'utf-8')
    } catch {
        await writeFile(filePath, initialContent, 'utf-8')
        return initialContent
    }
}
