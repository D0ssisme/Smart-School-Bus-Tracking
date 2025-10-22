import Route from "../models/Route.js";

// test
export const createRoute = async (req, res) => {
    try {
        const route = new Route(req.body);
        await route.save();
        res.status(201).json(route);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// test
export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.status(200).json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// test 
export const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ message: 'Không tìm thấy tuyến đường' });
        res.status(200).json(route);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//  UPDATE
export const updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!route) return res.status(404).json({ message: 'Không tìm thấy tuyến đường' });
        res.status(200).json(route);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// test
export const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndDelete(req.params.id);
        if (!route) return res.status(404).json({ message: 'Không tìm thấy tuyến đường' });
        res.status(200).json({ message: 'Đã xóa tuyến đường thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
