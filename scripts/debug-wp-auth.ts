import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugWPAuth() {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const user = process.env.WORDPRESS_AUTH_USER;
  const pass = process.env.WORDPRESS_APP_PASS;

  if (!url || !user || !pass) throw new Error("Missing WP credentials");

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const query = `query GetUsers { users(first: 5) { nodes { id name email username } } }`;

  try {
    console.log(`Sending request to ${url} with user: ${user}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({ query }),
    });

    console.log("Status:", response.status, response.statusText);
    const text = await response.text();
    
    if (text.startsWith('<!DOCTYPE')) {
      console.log("Received HTML (likely error page). Snippet:");
      console.log(text.substring(0, 500));
    } else {
      console.log("Received Data:", text);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

debugWPAuth();
