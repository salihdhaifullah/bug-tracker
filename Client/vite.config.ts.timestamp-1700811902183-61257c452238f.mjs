// vite.config.ts
import { defineConfig } from "file:///home/salih/Desktop/progrims/Buegee/Client/node_modules/vite/dist/node/index.js";
import react from "file:///home/salih/Desktop/progrims/Buegee/Client/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { VitePWA } from "file:///home/salih/Desktop/progrims/Buegee/Client/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["fonts/*.ttf", "js/*.js", "maskable_icon.png", "favicon.ico", "robots.txt", "apple-touch-icon.png", "favicon-16x16.png", "favicon-32x32.png", "logo.svg"],
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module"
      },
      manifest: {
        name: "Buegee",
        short_name: "Buegee",
        description: "Project Management Tool",
        theme_color: "#bae6fd",
        start_url: "/",
        display: "standalone",
        background_color: "#bae6fd",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable_icon.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zYWxpaC9EZXNrdG9wL3Byb2dyaW1zL0J1ZWdlZS9DbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NhbGloL0Rlc2t0b3AvcHJvZ3JpbXMvQnVlZ2VlL0NsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zYWxpaC9EZXNrdG9wL3Byb2dyaW1zL0J1ZWdlZS9DbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICByZWFjdCgpLFxuICAgICAgICBWaXRlUFdBKHtcbiAgICAgICAgICAgIGluY2x1ZGVBc3NldHM6IFsnZm9udHMvKi50dGYnLCAnanMvKi5qcycsICdtYXNrYWJsZV9pY29uLnBuZycsICdmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJywgJ2Zhdmljb24tMTZ4MTYucG5nJyAsJ2Zhdmljb24tMzJ4MzIucG5nJywgJ2xvZ28uc3ZnJ10sXG4gICAgICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgICAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0J1ZWdlZScsXG4gICAgICAgICAgICAgICAgc2hvcnRfbmFtZTogJ0J1ZWdlZScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcm9qZWN0IE1hbmFnZW1lbnQgVG9vbCcsXG4gICAgICAgICAgICAgICAgdGhlbWVfY29sb3I6ICcjYmFlNmZkJyxcbiAgICAgICAgICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNiYWU2ZmQnLFxuICAgICAgICAgICAgICAgIGljb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJ2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6ICdtYXNrYWJsZV9pY29uLnBuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzEwMjR4MTAyNCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1cnBvc2U6ICdtYXNrYWJsZScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgXSxcbn0pXG5cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1QsU0FBUyxvQkFBb0I7QUFDN1UsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDSixlQUFlLENBQUMsZUFBZSxXQUFXLHFCQUFxQixlQUFlLGNBQWMsd0JBQXdCLHFCQUFxQixxQkFBcUIsVUFBVTtBQUFBLE1BQ3hLLGNBQWM7QUFBQSxNQUNkLFlBQVk7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULE1BQU07QUFBQSxNQUNWO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxRQUNsQixPQUFPO0FBQUEsVUFDSDtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDSSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNJLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNiO0FBQUEsUUFFSjtBQUFBLE1BQ0o7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
