import chalk from 'chalk'

const warningMessage = chalk.hex('#FFA500')
const successMessage = chalk.green

export const successLog = (message) => console.log(successMessage(message))

export const warningLog = (message) => console.log(warningMessage(message))

export const imageCompressionLog = (filePath, sizeBeforeCompress, sizeAfterCompress) => {
    if (sizeBeforeCompress > sizeAfterCompress) {
        successLog(`${filePath}: ${sizeBeforeCompress} -> ${sizeAfterCompress}`)
        return
    }

    warningLog(`${filePath}: ${sizeBeforeCompress} -> ${sizeAfterCompress}`)
    warningLog('File size has become larger after compression. Try to reduce quality.')
}
