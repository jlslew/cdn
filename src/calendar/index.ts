import Component from '../component/index.ts';

declare const __webpack_public_path__;
declare const CalendarStyle;
declare const _;

declare const moment;
declare const async;
declare const fa;
declare const m;

export default class CalendarComponent extends Component {
    public static getDependencies() {
        return Component.getDependencies().concat([
            `https://www.unpkg.com/moment@2.24.0/min/moment.min.js`,
            `https://www.unpkg.com/lodash@latest/lodash.min.js`,
            `${__webpack_public_path__}calendar.css`,
        ]);
    }

    public constructor(attrs) {
        super(`table.${CalendarStyle[`table`]}`, attrs);
    }

    protected init(self, attrs) {
        fa.load(`S-CaretRight`, `S-CaretLeft`);
        const date = attrs.date || moment();
        const dates = m.stream([]);

        self.add([
            new Component(`thead.${CalendarStyle[`thead`]}`).add([
                new Component(`tr.${CalendarStyle[`tr`]}`).add([
                    new Component(`th.${CalendarStyle[`th`]}`).add(
                        new Component(`button.${CalendarStyle[`button`]}`).set(`onclick`, () => {
                            date.subtract(1, `months`);
                            dates([]);
                        }).add(new Component(`svg.${CalendarStyle[`svg`]}`).add(
                            new Component(`use`).set('xlink:href', `#fas-caret-left`),
                        )),
                    ),
                    new Component(`th[colspan=5].${CalendarStyle[`th`]}`).add(() => () => date.format(`MMMM YYYY`)),
                    new Component(`th.${CalendarStyle[`th`]}`).add(
                        new Component(`button.${CalendarStyle[`button`]}`).set(`onclick`, () => {
                            date.add(1, `months`);
                            dates([]);
                        }).add(new Component(`svg.${CalendarStyle[`svg`]}`).add(
                            new Component(`use`).set('xlink:href', `#fas-caret-right`),
                        )),
                    ),
                ]),
                new Component(`tr.${CalendarStyle[`tr`]}`).add(
                    _.map(moment.weekdaysMin(), day => new Component(`th.${CalendarStyle[`th`]}`).add(day)),
                ),
            ]),
            new Component(`tbody.${CalendarStyle[`tbody`]}`).add(() => {
                const selected = attrs.selected || m.stream(attrs.selectable === `multiple` ? [] : ``);
                const components = m.stream([]);

                const compute = () => async.mapSeries(_.chunk(CalendarComponent.getDates(date), 7), (row, callback) =>
                    async.mapSeries(row, (col, callback) => {
                            let selector = `span.${CalendarStyle[`span`]}`;

                            if (_.indexOf([6, 7], col.isoWeekday()) !== -1) {
                                selector += `.${CalendarStyle[`week-end`]}`;
                            }

                            if (col.month() !== date.month()) {
                                selector += `.${CalendarStyle[`out-of-month`]}`;
                            }

                            new Component(selector).add(col.format(`DD`)).decorate([
                                    attrs.selectable ? `${__webpack_public_path__}selectable.js` : ``,
                                    attrs.hoverable ? `${__webpack_public_path__}hoverable.js` : ``,
                                ], {
                                    value: col.format(`YYYY-MM-DD`),
                                    selectable: attrs.selectable,
                                    components: components,
                                    selected: selected,
                                }, (error, component) =>
                                    callback(error, new Component(`td.${CalendarStyle[`td`]}`).add(component)),
                            );
                        }, (error, components) =>
                            callback(error, new Component(`tr.${CalendarStyle[`tr`]}`).add(components)),
                    ),
                ).then(dates).then(m.redraw);

                return () => {
                    if (dates().filter(Boolean).length === 0) {
                        compute();
                    }

                    return dates();
                };
            }),
        ]);
    }

    private static getDates(date) {
        const first = date.clone().startOf(`month`);
        first.subtract(first.weekday(), `days`);

        const last = date.clone().endOf(`month`).add(14, `days`);
        const dates = [];

        while (first < last) {
            dates.push(first.clone());
            first.add(1, `days`);
        }

        return _.slice(dates, 0, 42);
    }
};
