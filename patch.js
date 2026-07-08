

const accountId = '46261d5aa645c789ec1fad5727bcaa2e';
const projectName = 'temphook';
const token = 'cfoat_ku-2eKwSRLpI0zNNaqE3QwYs78h8WI5Xt0HApDyfhnY.RN6AkacYsAJzBCjc7mhj9jKa0YDLSKFRIBk9qNkQZ04';

const payload = {
  build_config: {
    build_command: 'npm run build',
    destination_dir: '.open-next/assets'
  },
  deployment_configs: {
    production: {
      compatibility_flags: ['nodejs_compat'],
      d1_databases: {
        DB: {
          id: '00a32b40-bc1b-4ba7-a3e0-383602f7846f'
        }
      }
    },
    preview: {
      compatibility_flags: ['nodejs_compat'],
      d1_databases: {
        DB: {
          id: '00a32b40-bc1b-4ba7-a3e0-383602f7846f'
        }
      }
    }
  }
};

async function patch() {
  console.log('Fetching current project settings...');
  let res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  console.log(res.status, text);
}

patch();
