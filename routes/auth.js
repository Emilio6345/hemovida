// 🔥 LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 BODY LOGIN:", req.body);

    const email = req.body?.email;
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password requeridos"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      console.log("❌ Usuario no encontrado:", email);

      return res.status(401).json({
        error: "Usuario no existe"
      });
    }

    console.log("✅ USUARIO ENCONTRADO:", rows[0]);

    const usuario = rows[0];

    const match = await bcrypt.compare(
      password,
      usuario.password
    );

    console.log("🔐 MATCH PASSWORD:", match);

    if (!match) {
      return res.status(401).json({
        error: "Password incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ LOGIN EXITOSO:", usuario.email);

    return res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.log("🔥 ERROR LOGIN REAL:", error);

    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});