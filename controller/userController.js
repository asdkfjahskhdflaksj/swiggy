const multer = require("multer");
const AppError = require("../utils/appError");

const storage = multer.diskStorage({
  destination: function (req, file, done) {
    done(null, "public/img");
  },
  filename: function (req, file, done) {
    const ext = file.mimetype.split("/")[1];
    done(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const fileFilter = function (req, file, done) {
  if (file.mimetype.startsWith("image")) {
    done(null, true);
  } else done(new AppError("file should be image", 400), false);
};

const upload = multer({ storage, fileFilter });

exports.uploadSingleFile = upload.single("image");
