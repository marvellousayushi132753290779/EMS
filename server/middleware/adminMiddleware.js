const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Only admin can perform this action' })
    }
    next()
}

export default adminOnly
