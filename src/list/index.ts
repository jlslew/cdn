import Component from '../component/index.ts';

declare const __webpack_public_path__;

declare const async;
declare const m;

export default class ListComponent extends Component {
    public constructor(attrs) {
        super(`ul`, attrs);
    }

    protected init(self, attrs) {
        const selected = attrs.selected || m.stream(attrs.selectable === `multiple` ? [] : ``);

        self.add(() => {
            const components = m.stream([]);

            async.mapSeries(attrs.data(), (item, callback) => {
                const component = typeof attrs.render === `function` ? attrs.render(item) : item;

                new Component(`li`).add(component).decorate([
                    attrs.selectable ? `${__webpack_public_path__}selectable.js` : ``,
                ], {
                    selectable: attrs.selectable,
                    selected: selected,

                    components: components,
                    value: item,
                }, callback);
            }).then(attrs.data);

            return attrs.data;
        });
    }
};
