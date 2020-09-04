import Component from '../component/index.ts';

declare const __webpack_public_path__;

export default class ListComponent extends Component {
    public constructor(attrs) {
        super(`ul`, attrs);
    }

    protected init(self, attrs) {
        self.add(attrs.data().map(item => {
            const component = typeof attrs.render === `function` ? attrs.render(item) : item;
            return new Component(`li`).add(component);
        }));
    }
};
