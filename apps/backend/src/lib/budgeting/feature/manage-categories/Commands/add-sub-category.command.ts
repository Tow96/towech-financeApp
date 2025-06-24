// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export class AddSubCategoryCommand extends Command<Result<string>> {
  constructor(
    public readonly categoryId: string,
    public readonly iconId: number,
    public readonly name: string
  ) {
    super();
  }
}

@CommandHandler(AddSubCategoryCommand)
export class AddSubCategoryHandler implements ICommandHandler<AddSubCategoryCommand> {
  private readonly logger = new Logger(AddSubCategoryCommand.name);

  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(command: AddSubCategoryCommand): Promise<Result<string>> {
    // TODO: Check if icon Id is valid

    const parentCategory = await this.categoryRepository.getById(command.categoryId);
    if (!parentCategory)
      return { status: CommandQueryResult.NotFound, message: 'Parent category not found' };

    this.logger.log(`Adding Subcategory to id: ${command.categoryId}`);

    try {
      const subCategoryId = parentCategory.addSubCategory(command);

      await this.categoryRepository.saveChanges(parentCategory);
      return { status: CommandQueryResult.Success, message: subCategoryId };
    } catch (exception: unknown) {
      return { status: CommandQueryResult.Conflict, message: exception.message };
    }
  }
}
