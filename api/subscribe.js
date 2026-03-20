export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Incoming body:', req.body);

    const { email } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Valid email is required',
        received: req.body
      });
    }

    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
        }),
      }
    );

    const text = await beehiivResponse.text();
    console.log('Beehiiv status:', beehiivResponse.status);
    console.log('Beehiiv response text:', text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!beehiivResponse.ok) {
      return res.status(beehiivResponse.status).json({
        error: data?.error || data?.message || 'Subscription failed',
        details: data
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      error: 'Server error',
      details: String(err)
    });
  }
}