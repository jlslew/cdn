import Component from '../component/index.ts';
import Decorator from '../decorator/index.ts';

declare const _;

export default class FilterableComponent extends Decorator {
    public static getDependencies() {
        return Decorator.getDependencies().concat([
            `https://www.unpkg.com/lodash@latest/lodash.min.js`,
        ]);
    }

    protected init(self, attrs) {
        const data = attrs.data();

        const selector = () => {
            self.selector = _.replace(self.selector, `[value=${attrs.filtered()}]`, ``);

            if (_.includes(attrs.filtered(), attrs.value)) {
                self.selector += `[value=${attrs.filtered()}]`;
            }
        };

        self.add(new Component(`input[placeholder=Filter ...]`).set(`oninput`, e => {
            attrs.filtered(e.target.value.toLowerCase());

            if (e.target.value.toLowerCase()) {
                attrs.data(_.filter(attrs.data(), item =>
                    _.includes(item.toLowerCase(), e.target.value.toLowerCase()),
                ));
            } else {
                attrs.data(data);
            }

            selector();
        }));

        this.component = self;
        selector();
    }
};
