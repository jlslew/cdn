require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    view: () => m(``, `Hello`)
})));
