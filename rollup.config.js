
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import {uglify} from 'rollup-plugin-uglify'
import {terser} from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const FORMAT_MAP = {
    es:{
        suffix:'.es',
        format:'es',
        input:'esm/index.js'
    },
    umd:{
        format:'umd',
        input:'lib/index.js'
    },
}

function generateConfig(format,isPro){
    const item = FORMAT_MAP[format];
    const plugins = [
        resolve(),
        commonjs(),
    ]
    if(isPro){
        plugins.push(
            terser({
                warnings: true,
                mangle: {
                    module: true,
                },
            }),
            filesize({
                showBrotliSize: true,
            })
        )
    }
    return {
        input: item.input,
        output: {
          name:'FoxView',
          file: `dist/foxview${item.suffix || ''}${isPro ? '' : '.dev'}.js`,
          format: item.format
        },
        plugins: plugins
    }
}

export default [
    generateConfig('es'),
    generateConfig('es',true),
    generateConfig('umd'),
    generateConfig('umd',true),
]