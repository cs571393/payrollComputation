export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 检查路径是否是我们想代理的 API
    // 让 /api/holidays/* 的请求指向外部 API
    if (url.pathname.startsWith('/api/holidays/')) {
      // 从路径中提取年份，例如 /api/holidays/2024 -> 2024
      const year = url.pathname.split('/')[3];
      
      // 构建目标 API 的 URL
      const apiUrl = `https://api.jiejiariapi.com/v1/holidays/${year}`;

      // 发起新的请求到真正的 API
      // 我们只创建一个简单的请求，因为原始请求中没有复杂的 Header 或 Body
      const apiRequest = new Request(apiUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Cloudflare-Worker-Proxy' } // 添加一个User-Agent头
      });

      // 直接返回 API 的响应，这样就完成了代理
      return fetch(apiRequest);
    }

    // 如果不是 API 请求，就正常返回项目中的静态文件（例如 salary_calculator.html）
    // env.ASSETS.fetch(request) 会自动处理这个逻辑
    return env.ASSETS.fetch(request);
  }
};
