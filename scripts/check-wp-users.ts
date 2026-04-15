import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkWordPressUsers() {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!url) throw new Error("Missing WP API URL");

  const query = `
    query GetUsers {
      users(first: 5) {
        nodes {
          id
          name
          email
          username
        }
      }
    }
  `;

  console.log(`Checking WP users at ${url}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      return;
    }

    console.log("Found Users:", data.data.users.nodes.length);
    console.log(data.data.users.nodes);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

checkWordPressUsers();
