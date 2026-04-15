import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkWordPressUsersAuth() {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const user = process.env.WORDPRESS_AUTH_USER;
  const pass = process.env.WORDPRESS_APP_PASS;

  if (!url || !user || !pass) throw new Error("Missing WP credentials");

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');

  const query = `
    query GetUsers {
      users(first: 10) {
        nodes {
          id
          name
          email
          username
          description
          roles {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  console.log(`Checking AUTHENTICATED WP users at ${url}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      return;
    }

    console.log("Success! Found Users:", data.data.users.nodes.length);
    console.log("Sample Data:", JSON.stringify(data.data.users.nodes[0], null, 2));
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

checkWordPressUsersAuth();
