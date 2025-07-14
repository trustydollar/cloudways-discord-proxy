// Cloudways to Discord Webhook Proxy
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // Get the data from Cloudways Bot
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        
        // Convert to Discord format
        const discordPayload = {
            content: text,
            username: "Cloudways Bot",
            avatar_url: "https://www.cloudways.com/blog/wp-content/uploads/Cloudways-Logo-1.png"
        };

        // Send to Discord
        const discordResponse = await fetch('https://discord.com/api/webhooks/1394161612998578186/FlxfeE6zP-HhAA_YAKDYFveQ-5U9sqEK_SuStMIHnNzP97FgTcrF_60NYGZ2WFH-pyq9', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload)
        });

        if (!discordResponse.ok) {
            const errorText = await discordResponse.text();
            throw new Error(`Discord API error: ${discordResponse.status} - ${errorText}`);
        }

        // Return success
        res.status(200).json({ 
            success: true, 
            message: 'Notification sent to Discord successfully' 
        });
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to send notification',
            details: error.message 
        });
    }
}
