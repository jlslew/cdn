import async from 'async';
import m from 'mithril';

window.async = async;
window.m = m;

window.q = (function queue() {
    return async.queue((task, callback) => {
        if (System.get(task)) {
            callback(null, System.get(task).default);
        } else {
            System.import(task).then(module => {
                let q = queue(), dependencies = [];
                m.redraw();

                if (module.default && typeof module.default.getDependencies === `function`) {
                    dependencies = module.default.getDependencies();
                }

                async.each(dependencies, (task, callback) =>
                        q.push(task, (error, styles) => {
                            if (task.endsWith(`.css`)) {
                                document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styles);
                            }

                            callback(error);
                        })
                    , error => {
                        callback(error, module.default);
                        System.set(task, module);
                    });
            });
        }
    }, 5);
})();

export function ready(component) {
    m.mount(document.body, {
        oninit: vnode => vnode.state.component = component(),
        view: vnode => m(vnode.state.component || ``)
    });
}
