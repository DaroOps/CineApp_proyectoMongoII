import AuthService  from './auth.service.js';

export default class AuthController {
    constructor() {
        this.authService = new AuthService();
    }
    
    login = async (req, res) => {
        const { accessToken, refreshToken } = await this.authService.login(req.body);
        res.cookie('access_token', accessToken, { httpOnly: true, secure: true , sameSite: 'strict' });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true , sameSite: 'strict' });
        res.status(200).json({ success: true});
    }
   
    refresh = async (req, res) => {
        const refreshToken = req.cookies.refresh_token;
        const { accessToken } = this.authService.refreshAccessToken(refreshToken);
        res.cookie('access_token', accessToken);
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
      
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json({ success: true });
    }

    createUser = async (req, res) => {
        const user = await this.authService.createUser(req.body);
        res.json(user);
    };
    
}
