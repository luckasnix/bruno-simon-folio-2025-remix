import { normalizePath } from 'vite'
import wasm from 'vite-plugin-wasm'
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
    root: 'sources/', // Sources files (typically where index.html is)
    envDir: '../',  // Directory where the env file is located
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: './', // Public path (what's after the domain)
    server:
    {
        // https: true,
        host: true, // Open to local network and display URL
        open: true // Open in browser
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false // Add sourcemap
    },
    plugins:
    [
        // Vite 8's default browser target supports the top-level await used by WASM.
        wasm(),
        {
            name: 'reload-static-assets',
            apply: 'serve',
            configureServer(server)
            {
                const publicDir = `${normalizePath(server.config.publicDir)}/`

                // Public assets loaded by the game are outside Vite's module graph.
                server.watcher.on('all', (event, file) =>
                {
                    if(['add', 'change', 'unlink'].includes(event) && normalizePath(file).startsWith(publicDir))
                        server.ws.send({ type: 'full-reload', path: '*' })
                })
            }
        },
        // basicSsl()
    ]
}
