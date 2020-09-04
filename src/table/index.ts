import Component from '../component/index.ts';

declare const __webpack_public_path__;
declare const TableStyle;
declare const _;

declare const async;
declare const m;

export default class TableComponent extends Component {
    public static getDependencies() {
        return Component.getDependencies().concat([
            `https://www.unpkg.com/lodash@latest/lodash.min.js`,
            `${__webpack_public_path__}table.css`,
        ]);
    }

    public constructor(attrs) {
        super(`table.${TableStyle[`table`]}`, attrs);
    }

    protected init(self, attrs) {
        self.add([
            new Component(`thead.${TableStyle[`thead`]}`).add(
                new Component(`tr.${TableStyle[`tr`]}`).add(() => {
                    const headers = m.stream([]);
                    const sort = m.stream({});

                    async.mapSeries(attrs.cols || [], (col, callback) =>
                        new Component(`span`).add(_.startCase(_.lowerCase(col.name))).decorate([
                                attrs.sortable ? `${__webpack_public_path__}sortable.js` : ``,
                            ], {
                                data: attrs.data,
                                name: col.name,
                                sort: sort,
                            }, (error, component) =>
                                callback(error, new Component(`th.${TableStyle[`th`]}`).add(component)),
                        ),
                    ).then(headers).then(m.redraw);

                    return headers;
                }),
            ),
            new Component(`tbody.${TableStyle[`tbody`]}`).add(() => {
                const selected = attrs.selected || m.stream(attrs.selectable === `multiple` ? [] : ``);
                const children = m.stream({});

                (components => async.eachSeries(attrs.data() || [], (row, callback) =>
                    new Component(`tr.${TableStyle[`tr`]}`).add(
                        _.map(attrs.cols || [], col => {
                            const component = () => () => typeof col.render === `function` ? col.render(row) : row[col.name];

                            return new Component(`td.${TableStyle[`td`]}`).add(component)
                                .set(`data-label`, _.startCase(_.lowerCase(col.name)));
                        }),
                    ).decorate([
                        attrs.strippable ? `${__webpack_public_path__}strippable.js` : ``,
                        attrs.selectable ? `${__webpack_public_path__}selectable.js` : ``,
                        attrs.hoverable ? `${__webpack_public_path__}hoverable.js` : ``,
                    ], {
                        selectable: attrs.selectable,
                        value: JSON.stringify(row),
                        components: components,
                        selected: selected,
                    }).then(component => {
                        children[JSON.stringify(row)] = component;
                        callback();
                    }),
                ).then(m.redraw))(m.stream([]));

                return () => _.map(attrs.data(), item => children[JSON.stringify(item)]);
            }),
        ]);
    }
};
