import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) => {
    const uploadDir = "uploads/";

    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);

    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
