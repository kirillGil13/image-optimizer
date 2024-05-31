import {dirname} from 'path'
import {fileURLToPath} from 'url'

export const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png']

export const DEFAULT_FORMATS = ['png']

export const DEFAULT_QUALITY = 95

export const __dirname = dirname(fileURLToPath(import.meta.url))
