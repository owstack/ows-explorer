module.exports = {
    routePrefix: process.env.PROXY_PATH || '',
    fullNodes: [
        {
            url: process.env.EXPLORER_API_URL || 'https://dev.owstack.org',
            apiPrefix: process.env.EXPLORER_API_PROXY_PATH || '/api/explorer/btc'
        }
    ]
};
