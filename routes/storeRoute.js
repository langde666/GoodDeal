const express = require('express');
const router = express.Router();

//import validators
const storeValidator = require('../validators/storeValidator');
const { validateHandler } = require('../helpers/validateHandler');

//import controllers
const {
    isAuth,
    isAdmin,
    isManager,
    isOwner,
    isVendor,
    isCustomer,
} = require('../controllers/authController');
const { userById } = require('../controllers/userController');
const {
    storeById,
    getStore,
    createStore,
    getStoreByUser,
    updateStore,
    activeStore,
    updateStatus,
    getStatusEnum,
    getAvatar,
    updateAvatar,
    getCover,
    updateCover,
    getFeatureImages,
    addFeatureImage,
    updateFeatureImage,
    removeFeaturedImage,
} = require('../controllers/storeController');

//routes
router.get('/store/:storeId', getStore);
router.get('/store/by/user/:userId', isAuth, isVendor, getStoreByUser);
// router.get('/stores/:userId', isAuth, isAdmin, listStores);
router.post(
    '/store/create/:userId',
    isAuth,
    isCustomer,
    storeValidator.storeProfile(),
    validateHandler,
    createStore,
);
router.put(
    '/store/:storeId/:userId',
    isAuth,
    isManager,
    storeValidator.storeProfile(),
    validateHandler,
    updateStore,
);

router.put(
    '/store/active/:storeId/:userId',
    isAuth,
    isAdmin,
    storeValidator.activeStore(),
    validateHandler,
    activeStore,
);

router.get('/store/status/enum', getStatusEnum);
router.put(
    '/store/status/:storeId/:userId',
    isAuth,
    isManager,
    storeValidator.updateStatus(),
    validateHandler,
    updateStatus,
);

router.get('/store/avatar/:storeId', getAvatar);
router.put('/store/avatar/:storeId/:userId', isAuth, isManager, updateAvatar);

router.get('/store/cover/:storeId', getCover);
router.put('/store/cover/:storeId/:userId', isAuth, isManager, updateCover);

router.get('/store/featured/images/:storeId', getFeatureImages);
router.put(
    '/store/featured/image/:storeId/:userId',
    isAuth,
    isManager,
    addFeatureImage,
);
router.put(
    '/store/featured/image/:storeId/:userId/:imageIndex',
    isAuth,
    isManager,
    updateFeatureImage,
);
router.delete(
    '/store/featured/image/:storeId/:userId/:imageIndex',
    isAuth,
    isManager,
    removeFeaturedImage,
);

//router params
router.param('userId', userById);
router.param('storeId', storeById);

module.exports = router;
