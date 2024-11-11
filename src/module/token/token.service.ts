import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { PayloadModel } from './dto/payload.model';
import { TokensResponseModel } from './dto/tokens.response.model';
import { CreateTokenModel } from './dto/token.create.model';

@Injectable()
export class TokenService {
  private privateKey: Buffer;
  private publicKey: Buffer;
  constructor(private readonly tokenRepository: TokenRepository) {
    this.privateKey = fs.readFileSync('key/private-key.pem');
    this.publicKey = fs.readFileSync('key/public-key.pem');
  }

  public renderToken(payload: PayloadModel, expiredTime: number): string {
    const expiredAt = Math.floor(expiredTime / 1000);
    const token = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: expiredAt,
    });
    return token;
  }
  public decodeToken(token: string): any {
    const decoded = jwt.verify(
      token,
      this.publicKey,
      { algorithms: ['RS256'] },
      (err, decoded) => {
        if (err) {
          console.error('Token is invalid or expired:', err.message);
          return null;
        } else {
          return decoded;
        }
      },
    );
    return decoded;
  }
  public async refreshToken(token: string): Promise<TokensResponseModel> {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;
    const refreshTokens = await this.tokenRepository.getExpiredTokenByAccountId(
      decoded?.account_id,
    );
    if (!refreshTokens) return null;
  }
  public async addToken(refreshToken: CreateTokenModel): Promise<boolean> {
    refreshToken.isExpired = false;
    const addTokenResult = this.tokenRepository.add(refreshToken);
    if (!addTokenResult) return false;
    return true;
  }
  public async setExpiredToken(refreshToken: string): Promise<boolean> {
    const setExpiredToken =
      this.tokenRepository.setExpiredTokenByAccountId(refreshToken);
    if (!setExpiredToken) return false;
    return true;
  }
}
