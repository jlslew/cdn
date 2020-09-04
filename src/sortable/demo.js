require(`construct-style-sheets-polyfill`);
require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.css`).then(callback => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat(callback.default);
});

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    oninit: vnode => {
        q.push(`${__webpack_public_path__}table.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                sortable: true,
                data: m.stream([{
                    first: `Mark`,
                    last: `Otto`,
                    handle: `@mdo`,
                    link: `/mdo`
                }, {
                    first: `Jacob`,
                    last: `Thornton`,
                    handle: `@fat`,
                    link: `/fat`
                }, {
                    first: `Larry`,
                    last: `the Bird`,
                    handle: `@twitter`,
                    link: `/twitter`
                }]),
                cols: [{
                    name: `first`
                }, {
                    name: `last`
                }, {
                    name: `handle`,
                    render: row => m(`a`, {
                        href: `https://twitter.com${row.link}`,
                        target: `_blank`
                    }, row.handle)
                }]
            }))
        );

        vnode.state.components = [];
    },
    view: vnode => vnode.state.components.map(m)
})));
