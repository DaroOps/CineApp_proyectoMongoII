import AuthService from './auth.service.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    const { accessToken, refreshToken } = await this.authService.login(req.body);
    this.setCookie(res, 'access_token', accessToken);
    this.setCookie(res, 'refresh_token', refreshToken);
    res.status(200).json({ success: true });
  }

  refresh = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    const { accessToken } = this.authService.refreshAccessToken(refreshToken);
    this.setCookie(res, 'access_token', accessToken);
    res.status(200).json({ success: true });
  }

  verify = async (req, res) => {
    const { access_token } = req.cookies;
    console.log('cookies', req.cookies);
    const user = await this.authService.verify(access_token);
    res.status(200).json(user);
  }

  logout = async (req, res) => {
    const { access_token } = req.cookies;
    await this.authService.logout(access_token);
    this.clearCookie(res, 'access_token');
    this.clearCookie(res, 'refresh_token');
    res.status(200).json({ success: true });
  }

  createUser = async (req, res) => {
    const user = await this.authService.createUser(req.body);
    res.json(user);
  };

  setCookie(res, name, value) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: true, // Ensure this is true in production
      sameSite: 'none', // This allows cross-site cookie setting
    });
  }

  clearCookie(res, name) {
    res.cookie(name, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0)
    });
  }
}