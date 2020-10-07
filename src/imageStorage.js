class ImageStorage {
  constructor(cloud) {
    this.cloud = cloud;
  }

  upload(bookId, file) {
    return new Promise((resolve, reject) => {
      const imageOptions = { tags: bookId, folder: 'library_images' };
      const callBack = function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.secure_url);
        }
      };

      const stream = this.cloud.uploader.upload_stream(imageOptions, callBack);
      stream.write(file);
      stream.end();
    });
  }
}

module.exports = { ImageStorage };
