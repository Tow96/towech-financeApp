import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryAggregate, CategoryType } from '../../../common/Core/category-aggregate';
import { Logger } from '@nestjs/common';
import { ICategoryRepository } from '../../../common/Core/i-category-repository';

export enum CommandResult {
  Success = 'SUCCESS',
  Conflict = 'CONFLICT',
}

interface Result<T> {
  status: CommandResult;
  message: T;
}

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
      return { status: CommandResult.Conflict, message: 'Category with same name already exists!' };

    this.logger.log(
      `Creating new category of type: ${command.type} with name: ${command.name} for user: ${command.userId}`
    );

    const newCategory = CategoryAggregate.create({
      ...command,
    });

    await this.categoryRepo.saveChanges(newCategory);
    return { status: CommandResult.Success, message: newCategory.id };
  }
}
