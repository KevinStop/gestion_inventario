const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
const prisma = new PrismaClient();

// Crear un usuario
const createUser = async (data) => {
  try {
    if (!data.email || !data.password) {
      throw new Error("El email y la contraseña son obligatorios");
    }

    // Hashear la contraseña
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Asignar una imagen predeterminada si no se proporciona una
    if (!data.imageUrl) {
      data.imageUrl = "/assets/user.png"; // Ruta relativa a la carpeta pública del backend
    }

    // Eliminar campos no necesarios
    delete data.confirmPassword;

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: data,
    });

    return user;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("El email ya está registrado");
    }
    console.error("Error al crear el usuario:", error);
    throw new Error(error.message || "Hubo un problema al crear el usuario");
  }
};

// Verificar credenciales (inicio de sesión manual)
const verifyUserCredentials = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    return user;
  } catch (error) {
    throw new Error("Error en la verificación de credenciales");
  }
};

// Actualizar un usuario por su ID
const updateUser = async (id, data) => {
  try {
    // Si se proporciona una nueva contraseña, hashearla antes de guardar
    if (data.password) {
      if (data.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Manejar la imagen anterior si se proporciona una nueva
    if (data.newImageUrl) {
      // Registrar qué se está asignando
      if (data.currentImageUrl) {
        const currentImagePath = path.join(
          __dirname,
          "..",
          "uploads/users",
          path.basename(data.currentImageUrl)
        );

        // Eliminar la imagen anterior si existe
        if (fs.existsSync(currentImagePath)) {
          console.log('Eliminando la imagen anterior:', currentImagePath);
          fs.unlinkSync(currentImagePath);
        }
      }

      data.imageUrl = data.newImageUrl; // Asignar la nueva imagen al campo imageUrl
    }
    // Eliminar campos temporales
    delete data.newImageUrl;
    delete data.currentImageUrl;

    const updatedUser = await prisma.user.update({
      where: { userId: Number(id) },
      data: data, // `data` ahora contiene solo campos válidos
    });

    return updatedUser;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw new Error(
      error.message || "Hubo un problema al actualizar el usuario"
    );
  }
};

// Desactivar un usuario por su ID
const deactivateUser = async (id) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { userId: Number(id) },
      data: { isActive: false },
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Error al desactivar el usuario");
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw new Error(error.message || "Hubo un problema al obtener el usuario");
  }
};

module.exports = {
  createUser,
  updateUser,
  deactivateUser,
  verifyUserCredentials,
  getUserById,
};
