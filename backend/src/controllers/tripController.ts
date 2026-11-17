import { Response } from 'express';
import { Trip } from '../models/Trip.js';
import { AuthRequest } from '../middleware/auth.js';

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const {
      title,
      destinationCountry,
      destinationCity,
      destinations,
      startDate,
      endDate,
      arrivalTime,
      departureTime,
      travelInterests,
      companionPreferences,
      languages,
      description,
      coverPhoto,
      isPublished,
    } = req.body;

    if (!title || !destinationCountry || !destinationCity || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Title, destination country, destination city, start date, and end date are required.',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      res.status(400).json({ success: false, message: 'Trip start date cannot be after end date.' });
      return;
    }

    const trip = await Trip.create({
      user: req.user._id,
      title,
      destinationCountry,
      destinationCity,
      destinations: destinations || [{ country: destinationCountry, city: destinationCity, order: 0 }],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      arrivalTime: arrivalTime || '',
      departureTime: departureTime || '',
      travelInterests: travelInterests || [],
      companionPreferences: companionPreferences || [],
      languages: languages || (req.user.languages.length ? req.user.languages : ['English']),
      description: description || '',
      coverPhoto:
        coverPhoto ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating trip' });
  }
};

export const getTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      country,
      city,
      search,
      startDate,
      endDate,
      interest,
      language,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destinationCountry: { $regex: search, $options: 'i' } },
        { destinationCity: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (country) {
      query.destinationCountry = { $regex: country, $options: 'i' };
    }

    if (city) {
      query.destinationCity = { $regex: city, $options: 'i' };
    }

    if (startDate) {
      query.endDate = { $gte: new Date(startDate as string) };
    } else {
      // By default show upcoming or active trips
      query.endDate = { $gte: new Date() };
    }

    if (endDate) {
      query.startDate = { ...query.startDate, $lte: new Date(endDate as string) };
    }

    if (interest) {
      query.travelInterests = { $in: [new RegExp(interest as string, 'i')] };
    }

    if (language) {
      query.languages = { $in: [new RegExp(language as string, 'i')] };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [trips, total] = await Promise.all([
      Trip.find(query)
        .populate('user', 'fullName avatar country currentCity accountType isVerified')
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Trip.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: trips,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching trips' });
  }
};

export const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      'user',
      'fullName avatar country currentCity accountType isVerified bio interests languages'
    );

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    res.json({
      success: true,
      trip,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching trip details' });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You are not authorized to update this trip' });
      return;
    }

    const updateFields = req.body;
    if (updateFields.startDate) updateFields.startDate = new Date(updateFields.startDate);
    if (updateFields.endDate) updateFields.endDate = new Date(updateFields.endDate);

    const updated = await Trip.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating trip' });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You are not authorized to delete this trip' });
      return;
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Trip removed successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting trip' });
  }
};

export const getMyTrips = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const trips = await Trip.find({ user: req.user._id }).sort({ startDate: 1 });

    res.json({
      success: true,
      trips,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching your trips' });
  }
};
