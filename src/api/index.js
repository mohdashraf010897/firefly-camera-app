// api.js

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken(id, secret) {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", id);
  params.append("client_secret", secret);
  params.append(
    "scope",
    "firefly_api,ff_apis,openid,AdobeID,session,additional_info,read_organizations"
  );

  let resp = await fetch("https://ims-na1-stg1.adobelogin.com/ims/token/v3", {
    method: "POST",
    body: params,
  });

  const json = await resp.json();
  return json.access_token;
}

async function textToImage(prompt, id, token) {
  let body = {
    prompt,
  };

  let req = await fetch(
    "https://firefly-api-enterprise-stage.adobe.io/v3/images/generate",
    {
      method: "POST",
      headers: {
        "X-Api-Key": id,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  let response = await req.json();
  return response.outputs[0].image.url; // Return the URL to the image
}

export const enhanceImage = async (prompt) => {
  try {
    const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
    const imageUrl = await textToImage(prompt, CLIENT_ID, token);
    return { enhancedImage: imageUrl };
  } catch (error) {
    console.error("Error enhancing image:", error);
    return { error: "Failed to enhance image" };
  }
};
