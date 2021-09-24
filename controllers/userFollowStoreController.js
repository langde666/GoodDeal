const UserFollowStore = require('../models/userFollowStoreModel');

exports.follow = (req, res, next) => {
    const userId = req.user._id;
    const storeId = req.store._id;
    const follow = new UserFollowStore({ userId, storeId });
    follow.save((error, follow) => {
        if (error | !follow) {
            return res.status(400).json({
                error: errorHandler(error),
            });
        }

        //update number of followers for store
        req.updateNumberOfFollowers = 1;
        next();
    });
};

exports.unfollow = (req, res, next) => {
    const userId = req.user._id;
    const storeId = req.store._id;

    UserFollowStore.deleteOne({ userId, storeId })
        .exec()
        .then(() => {
            //update number of followers for store
            req.updateNumberOfFollowers = -1;
            next();
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'not follow yet',
            });
        });
};

//?limit=...&page=...
exports.listFollowingStoresByUser = (req, res) => {
    const userId = req.user._id;
    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * limit;

    const filter = {
        limit,
        currentPage: page,
    };

    UserFollowStore.countDocuments({ userId }, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Following stores not found',
            });
        }

        const size = count;
        const pageCount = Math.ceil(size / limit);
        filter.pageCount = pageCount;

        UserFollowStore.find({ userId })
            .skip(skip)
            .limit(limit)
            .populate(
                'storeId',
                '_id name slug avatar cover point commission number_of_successful_orders number_of_failed_orders number_of_followers',
            )
            .exec()
            .then((stores) => {
                return res.json({
                    success: 'Load list following stores successfully',
                    filter,
                    size,
                    stores,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Load list followings users failed',
                });
            });
    });
};
