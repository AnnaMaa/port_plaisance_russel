
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../services/userService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentative de connexion avec :", email);

    // Vérifie l'existence de l'utilisateur
    const u = await findUserByEmail(email);
    if (!u) {
      console.warn("Utilisateur non trouvé :", email);
      return res.status(401).json({ message: 'Bad credentials' });
    }

    // Vérifie le mot de passe
    const valid = await u.comparePassword(password);
    if (!valid) {
      console.warn("Mot de passe invalide pour :", email);
      return res.status(401).json({ message: 'Bad credentials' });
    }

    // Génère le token JWT
    const token = jwt.sign(
      { id: u._id, email: u.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '2d' }
    );

    // Stocke aussi dans un cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'strict'
    });

    console.log("Connexion réussie pour :", email);
    return res.json({ message: 'ok', token });
  } catch (err) {
    console.error("Erreur serveur pendant login:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'logged out' });
  } catch (err) {
    console.error("Erreur serveur pendant logout:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
