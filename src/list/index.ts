import Component from '../component/index.ts';

declare const __webpack_public_path__;
declare const _;

declare const async;
declare const m;

export default class ListComponent extends Component {
    public static getDependencies() {
        return Component.getDependencies().concat([
            `https://www.unpkg.com/lodash@latest/lodash.min.js`,
        ]);
    }

    public constructor(attrs) {
        super(`ul`, attrs);
    }

    protected init(self, attrs) {
        const selected = attrs.selected || m.stream(attrs.selectable === `multiple` ? [] : ``);
        const filtered = attrs.filtered || m.stream(``);

        self.add(() => {
            const filter = m.stream(``);
            const children = {};

            if (attrs.filterable) {
                new Component(`li`).decorate([
                    `${__webpack_public_path__}filterable.js`,
                ], {
                    filtered: filtered,
                    data: attrs.data,
                }).then(filter);
            }

            (components => async.eachSeries(attrs.data(), (item, callback) => {
                const component = () => () => typeof attrs.render === `function` ? attrs.render(item) : item;

                new Component(`li`).add(component).decorate([
                    attrs.strippable ? `${__webpack_public_path__}strippable.js` : ``,
                    attrs.selectable ? `${__webpack_public_path__}selectable.js` : ``,
                    attrs.hoverable ? `${__webpack_public_path__}hoverable.js` : ``,
                ], {
                    selectable: attrs.selectable,
                    selected: selected,

                    components: components,
                    value: item,
                }).then(component => {
                    children[JSON.stringify(item)] = component;
                    callback();
                });
            }))(m.stream([]));

            return () => [
                filter(),
            ].concat(_.map(attrs.data(), item => children[JSON.stringify(item)]).filter(Boolean));
        });
    }
};
