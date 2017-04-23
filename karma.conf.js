module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "base.spec.ts" },
            { pattern: "src/**/*.+(ts|html)" }
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        karmaTypescriptConfig: {
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require("karma-typescript-angular2-transform")
                ]
            },
            reports: {
                json: { 
                    directory: "coverage",
                    subdirectory: "chrome",
                    filename: "coverage.json"
                },
                html: { 
                    directory: "coverage",
                    subdirectory: "chrome",
                },
            },
            compilerOptions: {
                lib: ["ES2015", "DOM"]
            },
            coverageOptions: {
                instrumentation: true
            }
        },
        reporters: ["progress", "kjhtml", "karma-typescript"],
        autoWatch: true,
        browsers: ["Chrome"]
    });
};
