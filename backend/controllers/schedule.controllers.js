import Schedule from '../models/schedule.model.js';

const getSchedule = async (req, res) => {
  try {
    const items = await Schedule.find({}).sort({ date: 1, createdAt: -1 });
    if(!items) {
      return res.status(404).json({ 
        message: 'No events found' 
    });
  }
    const data = items.map(e => ({
      id: String(e._id),
      title: e.title,
      date: e.date,
      time: e.time,
      details: e.details,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load schedule:', error);
    res.status(500).json({ 
      message: 'Failed to load schedule'
    });
  }
};

const addEvent = async (req, res) => {
  try {
    const { title, date, time, details } = req.body;
    const event = await Schedule.create({ title, date, time, details });
    if(!event) {
      return res.status(400).json({ 
        message: 'Failed to add event' 
      });
    }

    res.status(201).json({ 
      id: String(e._id), 
      title: e.title, 
      date: e.date, 
      time: e.time, 
      details: e.details 
    });
  } catch (error) {
    console.error('Failed to add event:', error);
    res.status(500).json({ 
      message: 'Failed to add event' 
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Schedule.findByIdAndDelete(id);
   
    if(!event) {
      return res.status(404).json({ 
        message: 'Event not found' 
      });
    }

    res.status(204).json({ 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Failed to delete event:', error);
    res.status(500).json({ 
      message: 'Failed to delete event'
    });
  }
};

export { deleteEvent, addEvent, getSchedule };
