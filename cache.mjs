import {join} from 'path'
import {writeFile} from 'fs/promises'
import {readOrCreateFile} from './utils.mjs'
import {__dirname} from './constants.mjs'

const CACHE_PATH = join(__dirname, 'cache.json')

const createNotInitializedError = () => new Error('Cache not initialized.')

class Cache {
    constructor() {
        this._cache = {}
        this._initialize = false
    }

    async init() {
        const json = await readOrCreateFile(CACHE_PATH, JSON.stringify({}))
        this._cache = JSON.parse(json)

        this._initialize = true
    }

    get(key) {
        if (!this._initialize) {
            throw createNotInitializedError()
        }

        return this._cache[key]
    }

    set(key, value) {
        if (!this._initialize) {
            throw createNotInitializedError()
        }

        this._cache[key] = value ?? key
    }

    has(key) {
        if (!this._initialize) {
            throw createNotInitializedError()
        }

        return this._cache.hasOwnProperty(key)
    }

    del(key) {
        if (!this._initialize) {
            throw createNotInitializedError()
        }

        delete this._cache[key]
    }

    async rewrite() {
        return writeFile(CACHE_PATH, JSON.stringify(this._cache, null, 2), 'utf-8')
    }
}

export const cache = new Cache()
