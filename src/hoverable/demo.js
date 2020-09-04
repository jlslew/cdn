require(`construct-style-sheets-polyfill`);
require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.css`).then(callback => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat(callback.default);
});

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    oninit: vnode => {
        q.push(`${__webpack_public_path__}calendar.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                hoverable: true
            }))
        );

        q.push(`${__webpack_public_path__}list.js`, (error, Component) =>
            vnode.state.components.push(new Component({
                hoverable: true,
                data: m.stream([
                    `Alpha`,
                    `Beta`,
                    `Gamma`
                ]),
                render: item => {
                    const styles = `display:inline-block;height:1rem;margin-right:0.25rem;width:0.5rem`;

                    return m(`[style=padding:0.25rem]`, [
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
