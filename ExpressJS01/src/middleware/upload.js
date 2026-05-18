import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const folderName =
            file.fieldname === 'avatar'
                ? 'avatar'
                : 'product';

        const uploadPath = path.join(
            process.cwd(),
            'src/public/images',
            folderName
        );

        fs.mkdirSync(uploadPath, {
            recursive: true
        });

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage });

export default upload;