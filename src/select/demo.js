require(`construct-style-sheets-polyfill`);
require(`systemjs/dist/system.js`);

System.import(`${__webpack_public_path__}index.css`).then(callback => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat(callback.default);
});

System.import(`${__webpack_public_path__}index.js`).then($ => $.ready(() => ({
    oninit: vnode => {
        q.push(`${__webpack_public_path__}select.js`, (error, Component) => {
            const d = new Date();

            vnode.state.components.push(new Component({
                selected: m.stream(`${d.getFullYear()}-${_.padStart(d.getMonth() + 1, 2, `0`)}-${_.padStart(d.getDate() + 1, 2, `0`)}`),
                placement: `bottom-start`,
                selectable: true,
                content: attrs => () => {
                    const component = m.stream(``);

                    Component.strategize(`${__webpack_public_path__}calendar.js`, {
                        selectable: attrs.selectable,
                        selected: attrs.selected
                    }).then(component);

                    return component;
                }
            }));

            vnode.state.components.push(new Component({
                placement: `bottom-start`,
                content: attrs => () => {
                    const component = m.stream(``);

                    Component.strategize(`${__webpack_public_path__}list.js`, {
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
                    }).then(component);

                    return component;
                }
            }));
        });

        vnode.state.components = [];
        fa.load(`S-Check`);
    },
    view: vnode => vnode.state.components.map(m)
})));
