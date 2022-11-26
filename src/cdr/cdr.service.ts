import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CdrInfoWithTyp } from './interfaces/cdr.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Cdr, CdrDocument } from './cdr.schema';
import { Model } from 'mongoose';

@Injectable()
export class CdrService {
  constructor(
    @Inject('CDR') private subscribersService: ClientProxy,
    @InjectModel(Cdr.name) private cdrModel: Model<CdrDocument>,
  ) {}

  public async processingCdr(cdrInfo: CdrInfoWithTyp) {
    try {
      const result = await this.saveCdr(cdrInfo);
      return await this.addToQueue({
        _id: result._id.toString(),
        ...cdrInfo,
      });
    } catch (e) {
      return e;
    }
  }

  private async saveCdr(cdrInfo: CdrInfoWithTyp) {
    const cdr = new this.cdrModel({
      ...cdrInfo,
    });
    return await cdr.save();
  }

  private async addToQueue(info: Cdr) {
    return await this.subscribersService.emit('cdr', { ...info }).toPromise();
  }
}
