require(`construct-style-sheets-polyfill`);
require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.css`).then(callback => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat(callback.default);
});

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    oninit: vnode => {
        q.push(`${__webpack_public_path__}calendar.js`, (error, Component) =>
            vnode.state.components.push(new Component())
        );

        vnode.state.components = [];
    },
    view: vnode => vnode.state.components.map(m)
})));
