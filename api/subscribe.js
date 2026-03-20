export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.71fc3142-5d61-4f05-9b0a-178719e8f15f}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.pDCWQxPRAVxY1Ct9wOl11qWCYRL7LvusuRwUrVwjglv4ot8HAE4bwKCuDOnJy0D6}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || data?.message || 'Subscription failed',
        details: data
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      details: String(err)
    });
  }
}
