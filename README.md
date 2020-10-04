# Fleg (https://en.wiktionary.org/wiki/fleg)

🎌 A simple but powerful feature flag handling solution.

-   Control through Cookies.
-   Control through Query String.
-   Automatic value conversion.
-   Browser support.
-   NodeJS support.
-   0 dependency.
-   Less than 1Kb (min+gz).

## Installation

```bash
npm i fleg
```

## Usage

Fleg is meant to be initialized **ONLY ONCE**!

During bootstrap stage (at the very beginning) of your application, import Fleg and define your initial flags.

```js
import { Fleg } from 'fleg'

new Fleg({
    enableFoo: true,
    enableBar: false,
    stringFlag: 'string'
})
```

Further on at any other part of the application use the default import. It will be the Fleg instance you created previously.

```js
import fleg from 'fleg'

fleg.enableFoo // true
```

## API

Fleg is extending `Map` which means all Map APIs are available. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

```js
fleg.get('enableFoo')
fleg.set('enableFoo', false)
// ...
```

### `set(key: string|array|object, value: any, writeCookie?: boolean)`

Fleg overrides the default `set` method of `Map` to extend its functionality.

```js
// Passing true will write this flag to cookies
fleg.set('key', 'value', true)

// You may pass an "entries shaped" array
fleg.set([
    ['key', 'value'],
    ['foo', 'bar']
])

// Pass object
fleg.set({
    enableFoo: 1,
    enableBar: 2
})
```

### `delete(key: string)`

Delete a flag. It'll also remove associated cookies.

```js
fleg.delete('enableFoo')
```

### `reset()`

Reset flags back to initial state (what was passed to the constructor).

### `resetFleg` Query String option

For convenience, you can add `resetFleg` query string to your URL to remove all cookie flags.

```
e.g. yourdomain.com?resetFleg
```

### Globals

For convenience, the created Fleg instance can be accessed on the global scope both in NodeJS and the Browser.

```js
global.__fleg
window.__fleg
```

## Layered control

Fleg has **3 layers** in the following order of loading:

1. **Initial flags**: what is passed to the constructor.
2. **Cookie flags**: cookie flags will override initial flags.
3. **Query String flags**: will override all other flags AND will also set it as cookie, so it'll remain on next reload.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
