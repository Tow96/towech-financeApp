// External packages
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// App packages
import { CommandQueryResult, Result } from '../../../../_common/command-query-result';
import { CategoryAggregate, CategoryType } from '../../../common/Core/category-aggregate';

// Internal imports
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export class CreateCategoryCommand extends Command<Result<string>> {
  constructor(
    public readonly userId: string,
    public readonly iconId: number,
    public readonly name: string,
    public readonly type: CategoryType
  ) {
    super();
  }
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  private readonly logger = new Logger(CreateCategoryCommand.name);

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(command: CreateCategoryCommand): Promise<Result<string>> {
    //TODO: Check if icon Id is valid

    const categoryExists = await this.categoryRepo.categoryExists(command.userId, command.name);
    if (categoryExists)
      return {
        status: CommandQueryResult.Conflict,
        message: 'Category with same name already exists!',
      };

    this.logger.log(
      `Creating new category of type: ${command.type} with name: ${command.name} for user: ${command.userId}`
    );

    const newCategory = CategoryAggregate.create({
      ...command,
    });

    await this.categoryRepo.saveChanges(newCategory);
    return { status: CommandQueryResult.Success, message: newCategory.id };
  }
}
