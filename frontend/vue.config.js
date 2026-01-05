const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // Convert modern JavaScript to older versions for browser compatibility
  transpileDependencies: true,
  
  devServer: {
    port: 8080,                 
    host: '0.0.0.0',            
    allowedHosts: 'all'         
  },
  
   publicPath: '/',
})