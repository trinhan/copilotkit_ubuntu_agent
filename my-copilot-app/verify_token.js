const { GoogleAuth } = require("google-auth-library");
const fs = require("fs");
const path = require("path");

// Simple .env loader
function loadEnv() {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
        console.log("📝 Loading variables from .env...");
        const env = fs.readFileSync(envPath, "utf8");
        env.split("\n").forEach(line => {
            const [key, value] = line.split("=");
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } else {
        console.warn("⚠️ No .env file found in this directory.");
    }
}

async function verifyToken() {
    loadEnv();
    const remoteUrl = process.env.REMOTE_AGENT_URL;

    if (!remoteUrl) {
        console.error("❌ REMOTE_AGENT_URL is not set.");
        process.exit(1);
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn("⚠️ GOOGLE_APPLICATION_CREDENTIALS is not set. Using system-wide ADC.");
    }

    try {
        console.log(`📡 Fetching ID token for: ${remoteUrl}...`);
        const auth = new GoogleAuth();
        const client = await auth.getIdTokenClient(remoteUrl);
        const idToken = await client.idTokenProvider.fetchIdToken(remoteUrl);

        console.log("✅ ID Token fetched successfully!");
        console.log(`🎫 Token starts with: ${idToken.substring(0, 20)}...`);
        console.log("\n🚀 You're ready! Run 'npm run dev' to start the app.");
    } catch (error) {
        console.error("❌ Error fetching ID token:", error.message);
        console.error("\n💡 Hint: Ensure you have set GOOGLE_APPLICATION_CREDENTIALS to your service account key path.");
    }
}

verifyToken();
