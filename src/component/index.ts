declare const async;
declare const q;
declare const m;

export default class Component {
    private attrs = {};
    private children;

    public constructor(protected selector = ``, attrs = {}) {
        this.init(typeof selector === 'string' ? this : selector, attrs);
    }

    public static getDependencies() {
        return [];
    }

    protected init(self, attrs) {
        // Do nothing
    }

    public decorate(decorators, attrs = {}, callback = null) {
        const promise = async.reduce(decorators.filter(Boolean), this, (memo, item, callback) =>
                q.push(item, (error, Decorator) => callback(error, new Decorator(memo, attrs)))
            , callback);

        return typeof callback === `function` ? undefined : promise;
    }

    public add(children) {
        this.children = typeof children === `function` ? children().bind(this) : children;
        return this;
    }

    public get(key) {
        return this.attrs[key];
    }

    public set(key, value) {
        this.attrs[key] = value;
        return this;
    }

    private static render(child) {
        return typeof child.view === `function` ? child.view() : child;
    }

    public view() {
        let children = this.children || [];

        if (typeof children === `function`) {
            children = children();
        }

        if (Array.isArray(children)) {
            children = children.filter(Boolean).map(Component.render);
        } else {
            children = Component.render(children);
        }

        return m(this.selector, this.attrs, children);
    }
};
