require(`construct-style-sheets-polyfill`);
require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.css`).then(callback => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat(callback.default);
});

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    oninit: vnode => {
        q.push(`${__webpack_public_path__}calendar.js`, (error, Component) => {
            const d = new Date();

            vnode.state.components.push(new Component({
                selected: m.stream([`${d.getFullYear()}-${_.padStart(d.getMonth() + 1, 2, `0`)}-${_.padStart(d.getDate() + 1, 2, `0`)}`]),
                selectable: `multiple`
            }));
        });

        q.push(`${__webpack_public_path__}calendar.js`, (error, Component) => {
            const d = new Date();

            vnode.state.components.push(new Component({
                selected: m.stream(`${d.getFullYear()}-${_.padStart(d.getMonth() + 1, 2, `0`)}-${_.padStart(d.getDate() + 1, 2, `0`)}`),
                selectable: true
            }));
        });

        q.push(`${__webpack_public_path__}table.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                selectable: `multiple`,
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

        q.push(`${__webpack_public_path__}table.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                selectable: true,
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

        q.push(`${__webpack_public_path__}list.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                selectable: `multiple`,
                data: m.stream([
                    `Alpha`,
                    `Beta`,
                    `Gamma`
                ]),
                render: item => {
                    const styles = `display:inline-block;height:1rem;margin-right:0.25rem;width:0.5rem`;

                    return m(`[style=cursor:pointer;padding:0.25rem]`, [
                        m(`svg[style=${styles}]`, m(`use[xlink:href=#fas-check]`)),
                        item
                    ]);
                }
            }))
        );

        q.push(`${__webpack_public_path__}list.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                selectable: true,
                data: m.stream([
                    `Alpha`,
                    `Beta`,
                    `Gamma`
                ]),
                render: item => {
                    const styles = `display:inline-block;height:1rem;margin-right:0.25rem;width:0.5rem`;

                    return m(`[style=cursor:pointer;padding:0.25rem]`, [
                        m(`svg[style=${styles}]`, m(`use[xlink:href=#fas-check]`)),
                        item
                    ]);
                }
            }))
        );

        vnode.state.components = [];
        fa.load(`S-Check`);
    },
    view: vnode => vnode.state.components.map(m)
})));
