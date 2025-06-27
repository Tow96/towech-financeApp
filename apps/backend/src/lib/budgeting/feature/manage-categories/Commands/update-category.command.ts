// External packages
import { Logger } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export class UpdateCategoryCommand extends Command<Result<string>> {
  constructor(
    public readonly id: string,
    public readonly iconId?: number,
    public readonly name?: string
  ) {
    super();
  }
}

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  private readonly logger = new Logger(UpdateCategoryHandler.name);

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<Result<string>> {
    // TODO: Check if icon Id is valid

    const category = await this.categoryRepo.getById(command.id);
    if (category === null)
      return { status: CommandQueryResult.NotFound, message: 'Category not found' };

    // Check if there is another category with the same name
    if (command.name) {
      const categoryExists = await this.categoryRepo.categoryExists(category.userId, command.name);
      if (categoryExists)
        return {
          status: CommandQueryResult.Conflict,
          message: 'Category with same name already exists!',
        };
    }

    this.logger.log(`Updating category: ${category.id}`);
    category.update(command);
    await this.categoryRepo.saveChanges(category);

    return { status: CommandQueryResult.Success, message: 'Category updated' };
  }
}
