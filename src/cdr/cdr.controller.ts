import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CallType } from './interfaces/cdr.enum';
import { CdrInfo } from './interfaces/cdr.interfaces';
import { CdrService } from './cdr.service';

@Controller('cdr')
export class CdrController {
  constructor(private cdrService: CdrService) {}

  @Post('outgoing')
  async createOutgoingCdr(@Res() res: Response, @Body() info: CdrInfo) {
    await this.cdrService.processingCdr({
      ...info,
      callType: CallType.outgoing,
    });
    return res.sendStatus(200);
  }

  @Post('incoming')
  async createIncomingCdr(@Res() res: Response, @Body() info: CdrInfo) {
    await this.cdrService.processingCdr({
      ...info,
      callType: CallType.incoming,
    });
    return res.sendStatus(200);
  }

  @Post('pozvonim')
  async createPozvonimCdr(@Res() res: Response, @Body() info: CdrInfo) {
    await this.cdrService.processingCdr({
      ...info,
      callType: CallType.pozvonim,
    });
    return res.sendStatus(200);
  }
}
