const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  }
});

// Validar tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  // Extensiones permitidas
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];

  // Obtener la extensión del archivo subido
  const fileExtension = path.extname(file.originalname).toLowerCase();

  // Verificar si la extensión es válida
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes: .jpg, .jpeg, .png'), false); // Rechazar el archivo
  }
};

// Configuración de Multer con el filtro
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Limite de tamaño: 2MB
  }
});

module.exports = upload;
