import Component from '../component/index.ts';

export default class Decorator extends Component {
    protected component;

    constructor(component, attrs = {}) {
        super(component, attrs);
    }

    public view() {
        return this.component.view();
    }
};
