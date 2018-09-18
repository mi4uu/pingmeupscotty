const {
  SVGPlugin,
  FuseBox,
  WebIndexPlugin,
  CSSPlugin,
  SassPlugin,
  BabelPlugin,
  ImageBase64Plugin,
  CSSResourcePlugin,
} = require('fuse-box')
const PORT = parseInt(process.env.PORT || 3000, 10)

const fuse = FuseBox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  useTypescriptCompiler: true,
  alias: {
    client: '~/client',
    server: '~/server',
    '@client': '~/client',
    '@redux': '~/client/redux',
    '@pages': '~/client/pages',
    '@components': '~/client/components',
    '@server': '~/server/',
    '@pingservice': '~/pingservice/',
  },
  sourceMaps: { project: true, vendor: false, inline: false }, // VS debuging, sourcemaps not needed
  plugins: [
    WebIndexPlugin({
      bundles: ['client/app'],
      template: 'src/client/index.html',
    }),
    SVGPlugin(),
    ImageBase64Plugin(),
    [SassPlugin({ importer: true }), CSSResourcePlugin({ dist: 'dist/css-resources' }), CSSPlugin()],
    [
      BabelPlugin({
        presets: ['es2015', 'stage-0'],
        limit2project: true,
      }),
    ],
  ],
})

fuse.dev({
  port: PORT + 1,
  httpServer: false,
})

fuse
  .bundle('server/bundle')
  .watch('server/**') // watch only server related code.. bugs up atm
  .target('server')
  .instructions(' > [server/index.ts]')
  .completed(proc => proc.start())

fuse
  .bundle('client/app')
  .watch('client/**') // watch only client related code
  .target('browser')
  .hmr({ reload: true, socketURI: `ws://localhost:${PORT + 1}` })
  .instructions(' > client/index.tsx')

fuse.run()
