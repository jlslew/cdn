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
                new Component(`tr.${TableStyle[`tr`]}`).add(
                    _.map(attrs.cols || [], col => new Component(`th.${TableStyle[`th`]}`).add(
                        _.startCase(_.lowerCase(col.name)),
                    )),
                ),
            ),
            new Component(`tbody.${TableStyle[`tbody`]}`).add(() => {
                const selected = attrs.selected || m.stream(attrs.selectable === `multiple` ? [] : ``);
                const children = m.stream([]);

                (components => async.mapSeries(attrs.data() || [], (row, callback) =>
                    new Component(`tr.${TableStyle[`tr`]}`).add(
                        _.map(attrs.cols || [], col => new Component(`td.${TableStyle[`td`]}`).add(
                            typeof col.render === `function` ? col.render(row) : row[col.name],
                        ).set(`data-label`, _.startCase(_.lowerCase(col.name)))),
                    ).decorate([
                        attrs.strippable ? `${__webpack_public_path__}strippable.js` : ``,
                        attrs.selectable ? `${__webpack_public_path__}selectable.js` : ``,
                        attrs.hoverable ? `${__webpack_public_path__}hoverable.js` : ``,
                    ], {
                        selectable: attrs.selectable,
                        value: JSON.stringify(row),
                        components: components,
                        selected: selected,
                    }, callback),
                ).then(children))(m.stream([]));

                return children;
            }),
        ]);
    }
};
