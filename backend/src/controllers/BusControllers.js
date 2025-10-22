import Bus from "../models/bus.js";

// test
export const createBus = async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// test
export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// chưa test
export const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Không tìm thấy xe buýt' });
        }
        res.status(200).json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// test 
export const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!bus) {
            return res.status(404).json({ message: 'Không tìm thấy xe buýt' });
        }
        res.status(200).json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 🔴 DELETE - Xóa xe buýt
export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Không tìm thấy xe buýt' });
        }
        res.status(200).json({ message: 'Đã xóa xe buýt thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
