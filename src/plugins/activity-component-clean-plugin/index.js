const babel = nodeRequire('babel-core');
//const RawSource = nodeRequire("webpack-sources").RawSource;

class ActvityComponentCleanPlugin {
    constructor() {}

    apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
            compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
                const files = [];
				chunks.forEach((chunk) => files.push.apply(files, chunk.files));
				files.push.apply(files, compilation.additionalChunkAssets);
                files.forEach((file) => {
                    let asset = compilation.assets[file];
                    let result = babel.transform(asset.source(), {
                        plugins: [
                            ['transform-remove-props', {regex: /^(\$rule)$/}]
                        ]
                    });
                    asset.source = ()=> result.code;
                    asset.size = ()=> result.code.length;
                });
                callback();
            });
        });
    }
}

export default ActvityComponentCleanPlugin;