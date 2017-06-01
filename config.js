var config = {
  local: {
    mode: 'local',
    port: 3000,
    language: 'en',
    github_token: process.env.GHTOKEN,
    memcached_host: "127.0.0.1:11211",
    deployType:'development',
    defaultParams: {
      owner: 'devstaff-crete',
      repo: 'DevStaff-Heraklion',
      labels: 'Topics',
      state: 'open',
      terms: ['👍', ':+1:'],
      speakerTerms: ['🔈', ':speaker:'],
      reactionVotes: ['+1'],
      exclusive: true,
      per_page: 100
    }
  },
  staging: {
    mode: 'staging',
    port: 3000,
    language: 'en',
    github_token: process.env.GHTOKEN,
    memcached_host: "127.0.0.1:11211",
    deployType:'staging',
    defaultParams: {
      owner: 'devstaff-crete',
      repo: 'DevStaff-Heraklion',
      labels: 'Topics',
      state: 'open',
      terms: ['👍', ':+1:'],
      speakerTerms: ['🔈', ':speaker:'],
      reactionVotes: ['+1'],
      exclusive: true,
      per_page: 100
    }
  },
  production: {
    mode: 'production',
    port: 3000,
    language: 'en',
    github_token: process.env.GHTOKEN,
    memcached_host: "127.0.0.1:11211",
    deployType:'production',
    defaultParams: {
      owner: 'devstaff-crete',
      repo: 'DevStaff-Heraklion',
      labels: 'Topics',
      state: 'open',
      terms: ['👍', ':+1:'],
      speakerTerms: ['🔈', ':speaker:'],
      reactionVotes: ['+1'],
      exclusive: true,
      per_page: 100
    }
  }
}

module.exports = function(mode) {
    console.log("CONFIG MODE:", process.env.NODE_ENV);
    return config[mode || process.env.NODE_ENV || 'local'] || config.local;
}();