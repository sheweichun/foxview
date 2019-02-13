
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import {uglify} from 'rollup-plugin-uglify'
import {terser} from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
export default {
    input: 'lib/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'esm'
    },
    plugins: [ 
        resolve(),
        commonjs(),
        terser({
            warnings: true,
            mangle: {
                module: true,
            },
        }),
        filesize({
            showBrotliSize: true,
        })
        
        // uglify()
    ]
};