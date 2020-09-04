require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    oninit: () => fa.load(`S-Home`),
    view: () => m(`svg`, m(`use`, {
        'xlink:href': `#fas-home`
    }))
})));
