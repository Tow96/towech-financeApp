// External packages
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

// App packages
import { SubCategoryRemovedEvent } from '../../../budgeting';

// Slice packages

@Injectable()
export class CacheCategoriesListener {
  private readonly logger = new Logger(CacheCategoriesListener.name);

  @OnEvent(SubCategoryRemovedEvent.name, { async: true, promisify: true })
  async subCategoryRemoved(event: SubCategoryRemovedEvent): Promise<void> {
    this.logger.log(`SubCategoryRemovedEvent event removed: ${event.categoryId}`);
  }
}
