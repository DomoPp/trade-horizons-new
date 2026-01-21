import { Injectable } from '@nestjs/common';
import { TurnResolverService } from './turn-resolver.service';

@Injectable()
export class TurnService {
  constructor(private readonly resolver: TurnResolverService) {}

  async nextTurn(saveId: number) {
    return this.resolver.resolveTurn(saveId);
  }
}
