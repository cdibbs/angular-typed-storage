export default {
    entry: './dist/modules/angular-typed-storage.es5.js',
    dest: './dist/bundles/angular-typed-storage.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'AngularTypedStorage',
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Observable',
        'rxjs/Observer'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx'
    },
    onwarn: () => { return }
}