const d = document
const w = window
const isNumber = /^\d+$/
const parseNumber = input => (isNumber.test(input) ? parseInt(input, 10) : input)
const parse = input => (input === 'false' ? false : input === 'true' ? true : parseNumber(input))
const isBrowser = typeof w !== undefined

const Cookies = {
    set(key, value) {
        if (!isBrowser) return
        const expires = `expires=${new Date(8640000000000000).toUTCString()}`
        d.cookie = `${key}=${value};${expires};path=/`
    },
    delete(key) {
        if (!isBrowser) return
        d.cookie = `${key}=;Max-Age=0;path=/`
    },
    getAll() {
        if (!isBrowser) return {}
        return d.cookie
            .split(';')
            .reduce((ac, cv) => Object.assign(ac, { [cv.split('=')[0].trim()]: parse(cv.split('=')[1]) }), {})
    }
}

const getCookieFlags = keys => {
    return Object.entries(Cookies.getAll()).filter(([k]) => keys.includes(k))
}
const getQueryFlags = keys =>
    [...new URLSearchParams(isBrowser ? w.location.search : undefined).entries()]
        .filter(([k]) => keys.includes(k))
        .map(entry => {
            entry[1] = parse(entry[1])
            return entry
        })

export type MapValue = string | number | boolean
export type FlegObject = { [k: string]: MapValue }
export type FlegArray = [string, MapValue][]

interface Any {
    [key: string]: any
}

let flags: Fleg

declare global {
    interface Window {
        __fleg: Fleg
    }

    namespace NodeJS {
        interface Global {
            __fleg: Fleg
        }
    }
}

export interface Fleg {
    set(key: string, value: MapValue): this
    set(key: string, value: MapValue, writeCookie: boolean): this
    set(key: FlegObject): this
    set(key: FlegArray): this
    reset(): void
    [key: string]: any
}

export class Fleg extends Map {
    #initialFlags

    constructor(initialFlags: FlegObject | FlegArray = {}) {
        super()
        flags = this
        this.#initialFlags = initialFlags

        const keys = Object.keys(initialFlags)
        this.set(initialFlags)
        this.set(getCookieFlags(keys))
        this.set(getQueryFlags(keys), undefined, true)

        if (isBrowser && w.location.search.includes('resetFleg')) {
            this.reset()
            alert('Feature cookies have been removed. Please reload the page without `enabledDisable` in the URL.')
        }
        if (isBrowser) {
            w.__fleg = this
        }
        if (typeof global !== undefined) {
            global.__fleg = this
        }
    }

    set(key, value?, writeCookie = false) {
        if (typeof key === 'object' && !Array.isArray(key)) {
            key = Object.entries(key)
        }
        if (Array.isArray(key)) {
            key.forEach((entry: [string, string]) => this.set(entry[0], entry[1], writeCookie))
        } else {
            super.set(key, parseNumber(value))
            Object.defineProperty(this, key, { get: () => this.get(key), configurable: true })
            writeCookie && Cookies.set(key, value)
        }
        return this
    }

    delete(key) {
        Cookies.delete(key)
        delete this[key]
        return super.delete(key)
    }

    reset() {
        Array.from(this.keys()).forEach(this.delete.bind(this))
        this.set(this.#initialFlags)
    }
}

// @ts-ignore
export default flags
