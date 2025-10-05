import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { type, messageId, content, rating, conversationId, status } = req.body;
    const userId = req.headers['x-user-id'] || null;

    const feedback = new Feedback({
      user: userId,
      conversation: conversationId || undefined,
      message: messageId || undefined,
      type,
      content,
      rating,
      status,
      metadata: {
        browser: req.headers['user-agent'],
        os: req.headers['x-os'] || undefined,
        ipAddresses: Array.isArray(req.ips) && req.ips.length ? req.ips : [req.ip].filter(Boolean),
      },
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

export const getUserFeedback = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || null;
    const feedbacks = await Feedback.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const { type, status, conversationId } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (conversationId) filter.conversation = conversationId;

    const feedbacks = await Feedback.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
};

export const resolveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'resolved', response, respondedBy } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      {
        status,
        adminResponse: {
          response,
          respondedBy,
          respondedAt: new Date(),
        },
      },
      { new: true }
    );
    if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ success: true, feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to resolve feedback' });
  }
};