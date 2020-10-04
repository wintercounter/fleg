/**
 * @jest-environment jsdom
 */

import { Fleg } from './'

const setLocation = url => {
    // @ts-ignore
    delete window.location
    // @ts-ignore
    window.location = new URL(url)
}

describe('Fleg', () => {
    beforeEach(() => {
        // List all flags used in the test so reset will remove all cookies
        new Fleg({
            enableFoo: 1
        }).reset()
        setLocation('https://testdomain.com/')
    })

    it('should initialize without initial flags', () => {
        const fleg = new Fleg()
        expect(fleg.size).toBe(0)
    })

    it('should initialize with initial flags', () => {
        const fleg = new Fleg({
            enableFoo: 1
        })
        expect(fleg.size).toBe(1)
        expect(fleg.enableFoo).toBe(1)
    })

    it('should initialize with cookie override', () => {
        // Set cookie
        new Fleg().set('enableFoo', 2, true)

        const fleg = new Fleg({
            enableFoo: 1
        })
        expect(fleg.size).toBe(1)
        expect(fleg.enableFoo).toBe(2)
    })

    it('should initialize with query-string override', () => {
        setLocation('https://testdomain.com/home?foo&enableFoo=3')

        const fleg = new Fleg({
            enableFoo: 1
        })
        expect(fleg.size).toBe(1)
        expect(fleg.enableFoo).toBe(3)
    })

    it('should initialize with query-string override converting true and false', () => {
        setLocation('https://testdomain.com/home?foo&enableFoo=true&enableBar=false')

        const fleg = new Fleg({
            enableFoo: 'foo',
            enableBar: 'bar'
        })
        expect(fleg.size).toBe(2)
        expect(fleg.enableFoo).toBe(true)
        expect(fleg.enableBar).toBe(false)
    })
})
