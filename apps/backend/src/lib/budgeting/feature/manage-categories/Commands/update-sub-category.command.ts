// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export class UpdateSubCategoryCommand extends Command<Result<string>> {
  constructor(
    public readonly categoryId: string,
    public readonly subCategoryId: string,
    public readonly iconId?: string,
    public readonly name?: string
  ) {
    super();
  }
}

@CommandHandler(UpdateSubCategoryCommand)
export class UpdateSubCategoryHandler implements ICommandHandler<UpdateSubCategoryCommand> {
  private readonly logger = new Logger(UpdateSubCategoryHandler.name);

  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(command: UpdateSubCategoryCommand): Promise<Result<string>> {
    // TODO: Check if icon Id is valid

    const parentCategory = await this.categoryRepository.getById(command.categoryId);
    if (parentCategory === null)
      return { status: CommandQueryResult.NotFound, message: 'Category not found' };

    this.logger.log(`Updating subcategory with id ${command.subCategoryId}`);

    try {
      parentCategory.updateSubCategory(command);

      await this.categoryRepository.saveChanges(parentCategory);
      return { status: CommandQueryResult.Success, message: 'sub category updated' };
    } catch (exception: unknown) {
      return { status: CommandQueryResult.Conflict, message: exception.message };
    }
  }
}
